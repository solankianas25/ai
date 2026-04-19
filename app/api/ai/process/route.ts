import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { ComplaintCategory, ComplaintPriority } from '@/lib/types';
import Groq from 'groq-sdk';

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

    let supabase: any;
    try {
      supabase = getSupabaseAdmin();
    } catch (err) {
      console.log('[v0] Supabase not available for logging');
      supabase = null;
    }
    
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
      result = useMock || !supabase
        ? { isDuplicate: false, similarComplaints: [] }
        : await detectDuplicates(complaint_id, text, supabase);
    }

    const processingTimeMs = Date.now() - startTime;

    // Log AI processing (if database available)
    if (supabase) {
      try {
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
      } catch (dbErr) {
        console.log('[v0] Database logging failed, but AI processing succeeded');
      }
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
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const categories = [
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
      'other',
    ];

    const prompt = `You are a complaint classification assistant for a municipal complaint system. 
    
Classify the following complaint into one of these categories: ${categories.join(', ')}

Complaint: "${text}"

Respond with ONLY a JSON object in this format (no markdown, no extra text):
{"category": "category_name", "confidence": 0.85, "reasoning": "brief explanation"}`;

    const message = await groq.messages.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    try {
      const result = JSON.parse(responseText);
      
      // Validate category
      if (!categories.includes(result.category)) {
        result.category = 'other';
      }

      return {
        category: result.category as ComplaintCategory,
        confidence: Math.min(result.confidence || 0.75, 1),
        reasoning: result.reasoning || 'Classified by Groq AI',
      };
    } catch (parseError) {
      console.log('[v0] Failed to parse Groq response:', responseText);
      return getMockClassification(text);
    }
  } catch (error) {
    console.error('[v0] Classification error:', error);
    return getMockClassification(text);
  }
}

/**
 * Assess complaint priority using AI
 */
async function assessPriority(text: string): Promise<PriorityResult> {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `You are a priority assessment system for municipal complaints.
    
Assess the priority level of this complaint (critical, high, medium, low):
- Critical: Life-threatening or severe safety hazards
- High: Major issues affecting many people or public services
- Medium: Issues affecting some people or minor public services
- Low: Minor issues with minimal impact

Complaint: "${text}"

Respond with ONLY a JSON object in this format (no markdown, no extra text):
{"priority": "priority_level", "confidence": 0.85, "reasoning": "brief explanation"}`;

    const message = await groq.messages.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    try {
      const result = JSON.parse(responseText);
      const validPriorities: ComplaintPriority[] = [
        'critical',
        'high',
        'medium',
        'low',
      ];

      // Validate priority
      if (!validPriorities.includes(result.priority)) {
        result.priority = 'medium';
      }

      return {
        priority: result.priority as ComplaintPriority,
        confidence: Math.min(result.confidence || 0.7, 1),
        reasoning: result.reasoning || 'Assessed by Groq AI',
      };
    } catch (parseError) {
      console.log('[v0] Failed to parse priority response:', responseText);
      return getMockPriority(text);
    }
  } catch (error) {
    console.error('[v0] Priority assessment error:', error);
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
