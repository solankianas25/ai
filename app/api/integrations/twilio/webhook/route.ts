import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { getSupabaseAdmin } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * Handle Twilio webhooks for:
 * - IVR call callbacks
 * - SMS inbound messages
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const eventType = formData.get('type') || formData.get('EventType');
    const fromNumber = formData.get('From');
    const messageBody = formData.get('Body') || formData.get('CallSid');
    const callSid = formData.get('CallSid');

    console.log('[v0] Twilio webhook received:', { eventType, fromNumber, callSid });

    // For SMS
    if (eventType === 'message' || messageBody) {
      return handleSMSInbound(
        String(fromNumber),
        String(messageBody),
        String(callSid || formData.get('MessageSid'))
      );
    }

    // For IVR call completion
    if (eventType === 'call-end' || callSid) {
      return handleIVRCallback(
        String(fromNumber),
        String(callSid),
        formData
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Twilio webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle inbound SMS
 */
async function handleSMSInbound(
  fromNumber: string,
  messageBody: string,
  messageSid: string
) {
  try {
    const supabase = getSupabaseAdmin();

    // Parse complaint from message
    // Simple example: first line is title, rest is description
    const lines = messageBody.split('\n');
    const title = lines[0];
    const description = lines.slice(1).join('\n') || 'Complaint via SMS';
    const complaintId = generateComplaintId();

    // Try to create complaint via SMS
    let complaint: any = null;
    try {
      // Log the integration event
      await supabase.from('integration_logs').insert({
        integration_type: 'twilio_sms',
        event_type: 'sms_received',
        external_id: messageSid,
        phone_number: fromNumber,
        message_body: messageBody,
        status: 'success',
      });

      const { data, error } = await supabase
        .from('complaints')
        .insert({
          complaint_id: complaintId,
          citizen_phone: fromNumber,
          citizen_name: `SMS User ${fromNumber.slice(-4)}`,
          category: 'other', // Will be classified by AI
          title: title || 'SMS Complaint',
          description: description,
          location: 'Unknown', // SMS doesn't provide location
          status: 'registered',
          priority: 'medium',
          intake_channel: 'twilio_sms',
          external_ref_id: messageSid,
          intake_timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      complaint = data;
    } catch (dbError: any) {
      // Database error - use mock mode
      if (dbError.message?.includes('table') || dbError.message?.includes('does not exist')) {
        console.log('[v0] Database not available for SMS, using mock mode');
        complaint = {
          complaint_id: complaintId,
          citizen_phone: fromNumber,
          status: 'registered',
        };
      } else {
        throw dbError;
      }
    }

    // Send SMS confirmation
    const responseMessage = `Thank you for your complaint. Reference: ${complaint.complaint_id}. We will process it shortly.`;
    console.log('[v0] SMS confirmation would be sent to:', fromNumber);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] SMS processing error:', error);
    return NextResponse.json(
      { error: 'SMS processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle IVR call completion
 */
async function handleIVRCallback(
  fromNumber: string,
  callSid: string,
  formData: FormData
) {
  try {
    const supabase = getSupabaseAdmin();

    // Extract IVR data from callback
    const complaintData = {
      category: formData.get('category') || 'other',
      location: formData.get('location') || 'Unknown',
      description: formData.get('description') || 'Complaint via IVR',
      title: formData.get('title') || 'IVR Complaint',
    };

    const complaintId = generateComplaintId();

    // Try to create complaint from IVR
    let complaint: any = null;
    try {
      // Log the integration event
      await supabase.from('integration_logs').insert({
        integration_type: 'twilio_ivr',
        event_type: 'callback',
        external_id: callSid,
        phone_number: fromNumber,
        request_data: Object.fromEntries(formData),
        status: 'success',
      });

      const { data, error } = await supabase
        .from('complaints')
        .insert({
          complaint_id: complaintId,
          citizen_phone: fromNumber,
          citizen_name: `IVR User ${fromNumber.slice(-4)}`,
          category: complaintData.category as any,
          title: complaintData.title,
          description: complaintData.description,
          location: complaintData.location,
          status: 'registered',
          priority: 'medium',
          intake_channel: 'twilio_ivr',
          external_ref_id: callSid,
          intake_timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      complaint = data;
    } catch (dbError: any) {
      // Database error - use mock mode
      if (dbError.message?.includes('table') || dbError.message?.includes('does not exist')) {
        console.log('[v0] Database not available for IVR, using mock mode');
        complaint = {
          complaint_id: complaintId,
          status: 'registered',
        };
      } else {
        throw dbError;
      }
    }

    return NextResponse.json({ 
      success: true,
      complaint_id: complaint.complaint_id 
    });
  } catch (error) {
    console.error('[v0] IVR processing error:', error);
    return NextResponse.json(
      { error: 'IVR processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Generate a complaint ID in format VHB-YYYY-XXXXX
 */
function generateComplaintId(): string {
  const year = new Date().getFullYear();
  const randomId = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  return `VHB-${year}-${randomId}`;
}
