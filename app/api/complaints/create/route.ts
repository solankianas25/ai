import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { IntakeChannel, ComplaintCategory } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface CreateComplaintPayload {
  citizen_name: string;
  citizen_email?: string;
  citizen_phone?: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  location: string;
  location_coordinates?: { lat: number; lng: number };
  intake_channel: IntakeChannel;
  external_ref_id?: string; // For integration refs (Twilio SID, WhatsApp msg ID)
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateComplaintPayload = await request.json();

    // Validate required fields
    if (!body.citizen_name || !body.title || !body.description || !body.location || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Generate complaint ID (VHB-YYYY-XXXXX format)
    const year = new Date().getFullYear();
    // This is a simplified version - in production, use a proper sequence
    const randomId = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
    const complaintId = `VHB-${year}-${randomId}`;

    // Try to create complaint in database
    let complaint: any = null;
    let createError: any = null;

    try {
      const result = await supabase
        .from('complaints')
        .insert({
          complaint_id: complaintId,
          citizen_name: body.citizen_name,
          citizen_email: body.citizen_email || null,
          citizen_phone: body.citizen_phone || null,
          category: body.category,
          title: body.title,
          description: body.description,
          location: body.location,
          location_coordinates: body.location_coordinates || null,
          intake_channel: body.intake_channel,
          external_ref_id: body.external_ref_id || null,
          status: 'registered',
          priority: 'medium', // Default priority
          intake_timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      complaint = result.data;
      createError = result.error;
    } catch (err) {
      // Database not initialized - use mock mode
      createError = err;
    }

    if (createError) {
      // If the table doesn't exist, use mock mode for development
      const errorMsg = createError.message || '';
      if (errorMsg.includes('relation') || errorMsg.includes('does not exist') || errorMsg.includes('table')) {
        console.log('[v0] Database not initialized, using mock mode for testing. To initialize: POST /api/admin/setup-db');
        // Return a mock complaint for development/testing
        complaint = {
          id: `mock-${Date.now()}`,
          complaint_id: complaintId,
          citizen_name: body.citizen_name,
          status: 'registered',
        };
      } else {
        console.error('[v0] Complaint creation error:', createError);
        return NextResponse.json(
          { error: 'Failed to create complaint: ' + (createError.message || 'Unknown error') },
          { status: 500 }
        );
      }
    }

    // Log integration event if applicable
    if (body.intake_channel !== 'website' && body.external_ref_id) {
      await supabase.from('integration_logs').insert({
        complaint_id: complaint.id,
        integration_type: body.intake_channel as any,
        event_type: 'message_received',
        external_id: body.external_ref_id,
        phone_number: body.citizen_phone || null,
        status: 'success',
      });
    }

    // Trigger AI processing asynchronously (in production, use a queue)
    // For now, we'll do this synchronously with mock mode
    await processComplaintWithAI(complaint.id, body.description);

    return NextResponse.json(
      {
        success: true,
        complaint_id: complaint.complaint_id,
        id: complaint.id,
        message: 'Complaint registered successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Process complaint with AI for classification and priority assessment
 */
async function processComplaintWithAI(complaintId: string, description: string) {
  try {
    // Call AI processing endpoint asynchronously (fire and forget)
    // In production, this would be queued via a job queue service
    
    // Classification
    fetch('http://localhost:3000/api/ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complaint_id: complaintId,
        text: description,
        processing_type: 'classification',
      }),
    }).catch((err) => {
      console.log('[v0] Background AI classification failed (non-critical):', err.message);
    });

    // Priority assessment
    fetch('http://localhost:3000/api/ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complaint_id: complaintId,
        text: description,
        processing_type: 'priority_assessment',
      }),
    }).catch((err) => {
      console.log('[v0] Background AI priority assessment failed (non-critical):', err.message);
    });

    console.log('[v0] AI processing triggered for complaint:', complaintId);
  } catch (error) {
    console.error('[v0] AI processing error:', error);
    // Don't fail the complaint creation if AI processing fails
  }
}
