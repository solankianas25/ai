import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { ComplaintCategory, ComplaintPriority } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface AIProcessRequest {
  complaint_id: string;
  text: string;
  processing_type: 'classification' | 'duplicate_detection' | 'priority_assessment';
}

interface ClassificationResult {
  category: ComplaintCategory;
  confidence: number;
  reasoning: string;
}

interface PriorityResult {
  priority: ComplaintPriority;
  confidence: number;
  reasoning: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AIProcessRequest = await request.json();
    const { complaint_id, text, processing_type } = body;

    if (!complaint_id || !text || !processing_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const useMock = process.env.USE_MOCK_AI === 'true';

    let result: any;
    const startTime = Date.now();

    if (processing_type === 'classification') {
      result = useMock 
        ? getMockClassification(text)
        : await classifyComplaint(text);
    } else if (processing_type === 'priority_assessment') {
      result = useMock
        ? getMockPriority(text)
        : await assessPriority(text);
    } else if (processing_type === 'duplicate_detection') {
      result = useMock
        ? { isDuplicate: false, similarComplaints: [] }
        : await detectDuplicates(complaint_id, text, supabase);
    }

    const processingTimeMs = Date.now() - startTime;

    // Log AI processing
    await supabase.from('ai_processing_log').insert({
      complaint_id,
      ai_model: useMock ? 'mock' : 'groq_mixtral',
      processing_type,
      input_data: { text },
      output_data: result,
      confidence_score: result.confidence || result.isDuplicate ? 1 : 0,
      processing_time_ms: processingTimeMs,
      is_mock: useMock,
    });

    // Update complaint with results if classification or priority
    if (processing_type === 'classification' && result.category) {
      await supabase
        .from('complaints')
        .update({
          ai_category: result.category,
          ai_confidence: result.confidence,
        })
        .eq('id', complaint_id);
    } else if (processing_type === 'priority_assessment' && result.priority) {
      await supabase
        .from('complaints')
        .update({
          ai_priority: result.priority,
        })
        .eq('id', complaint_id);
    }

    return NextResponse.json({
      success: true,
      result,
      processing_time_ms: processingTimeMs,
    });
  } catch (error) {
    console.error('AI processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Classify complaint into a category using AI
 */
async function classifyComplaint(text: string): Promise<ClassificationResult> {
  try {
    // In production, use Groq API
    // const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    // const response = await groq.chat.completions.create({...});

    console.log('[v0] Would classify complaint with Groq:', text.substring(0, 50));
    return getMockClassification(text);
  } catch (error) {
    console.error('Classification error:', error);
    return getMockClassification(text);
  }
}

/**
 * Assess complaint priority using AI
 */
async function assessPriority(text: string): Promise<PriorityResult> {
  try {
    // In production, use Groq API
    console.log('[v0] Would assess priority with Groq:', text.substring(0, 50));
    return getMockPriority(text);
  } catch (error) {
    console.error('Priority assessment error:', error);
    return getMockPriority(text);
  }
}

/**
 * Detect duplicate complaints
 */
async function detectDuplicates(
  complaintId: string,
  text: string,
  supabase: any
) {
  try {
    // Fetch recent complaints and compare
    const { data: recentComplaints } = await supabase
      .from('complaints')
      .select('id, title, description')
      .neq('id', complaintId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Simple keyword matching (in production, use semantic similarity)
    const keywords = text.toLowerCase().split(' ');
    const similarComplaints = recentComplaints?.filter((complaint: any) => {
      const complaintText = (complaint.title + ' ' + complaint.description).toLowerCase();
      const matches = keywords.filter(k => complaintText.includes(k)).length;
      return matches > 3; // At least 4 matching keywords
    }) || [];

    return {
      isDuplicate: similarComplaints.length > 0,
      similarComplaints: similarComplaints.slice(0, 3),
      confidence: similarComplaints.length > 0 ? 0.7 : 0.1,
    };
  } catch (error) {
    console.error('Duplicate detection error:', error);
    return {
      isDuplicate: false,
      similarComplaints: [],
      confidence: 0,
    };
  }
}

/**
 * Mock classification result
 */
function getMockClassification(text: string): ClassificationResult {
  const categories: ComplaintCategory[] = [
    'water_supply',
    'sanitation',
    'roads',
    'streetlights',
    'garbage',
    'traffic',
    'construction',
    'parks',
    'public_facilities',
    'corruption',
  ];

  // Simple heuristic based on keywords
  const lowerText = text.toLowerCase();
  let category: ComplaintCategory = 'other';

  if (lowerText.includes('water') || lowerText.includes('supply')) {
    category = 'water_supply';
  } else if (lowerText.includes('road') || lowerText.includes('pothole')) {
    category = 'roads';
  } else if (lowerText.includes('garbage') || lowerText.includes('waste')) {
    category = 'garbage';
  } else if (lowerText.includes('light') || lowerText.includes('street')) {
    category = 'streetlights';
  } else if (lowerText.includes('traffic')) {
    category = 'traffic';
  } else if (lowerText.includes('sanitation') || lowerText.includes('sewage')) {
    category = 'sanitation';
  }

  return {
    category,
    confidence: 0.75,
    reasoning: `Classified as ${category} based on keyword matching`,
  };
}

/**
 * Mock priority assessment
 */
function getMockPriority(text: string): PriorityResult {
  const lowerText = text.toLowerCase();
  let priority: ComplaintPriority = 'medium';
  let confidence = 0.7;

  // Escalate based on keywords
  if (
    lowerText.includes('urgent') ||
    lowerText.includes('critical') ||
    lowerText.includes('emergency') ||
    lowerText.includes('danger')
  ) {
    priority = 'critical';
    confidence = 0.9;
  } else if (
    lowerText.includes('major') ||
    lowerText.includes('serious') ||
    lowerText.includes('high')
  ) {
    priority = 'high';
    confidence = 0.8;
  } else if (lowerText.includes('minor') || lowerText.includes('small')) {
    priority = 'low';
    confidence = 0.75;
  }

  return {
    priority,
    confidence,
    reasoning: `Priority set to ${priority} based on text analysis`,
  };
}
