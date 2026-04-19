import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

interface WhatsAppMessage {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        messages: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body: string };
          image?: { id: string; mime_type: string };
          document?: { id: string; mime_type: string };
        }>;
        contacts: Array<{ profile: { name: string }; wa_id: string }>;
      };
    }>;
  }>;
}

/**
 * Handle WhatsApp webhook callbacks
 * POST: Receive messages from users
 * GET: Webhook verification
 */
export async function POST(request: NextRequest) {
  try {
    const body: WhatsAppMessage = await request.json();

    console.log('[v0] WhatsApp webhook received');

    if (!body.entry?.[0]?.changes?.[0]?.value?.messages) {
      return NextResponse.json({ success: true });
    }

    const messages = body.entry[0].changes[0].value.messages;
    const contacts = body.entry[0].changes[0].value.contacts || [];

    for (const message of messages) {
      if (message.type === 'text') {
        await handleWhatsAppMessage(
          message.from,
          message.text?.body || '',
          message.id,
          contacts[0]?.profile?.name || 'WhatsApp User'
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * GET handler for webhook verification
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'test_token';

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
}

/**
 * Process WhatsApp message and create complaint
 */
async function handleWhatsAppMessage(
  fromNumber: string,
  messageBody: string,
  messageId: string,
  contactName: string
) {
  try {
    const supabase = getSupabaseAdmin();

    // Parse complaint from message
    // Example format: "TITLE|DESCRIPTION|LOCATION|CATEGORY"
    // Or simple format: just the message as description
    const parts = messageBody.split('|').map(p => p.trim());
    
    let title = 'WhatsApp Complaint';
    let description = messageBody;
    let location = 'Unknown';
    let category = 'other';

    if (parts.length >= 4) {
      [title, description, location, category] = parts.slice(0, 4);
    } else if (parts.length >= 2) {
      [title, description] = parts.slice(0, 2);
    }

    const complaintId = generateComplaintId();

    // Try to create complaint from WhatsApp
    let complaint: any = null;
    try {
      // Log integration event
      await supabase.from('integration_logs').insert({
        integration_type: 'whatsapp',
        event_type: 'message_received',
        external_id: messageId,
        phone_number: fromNumber,
        message_body: messageBody,
        status: 'success',
      });

      const { data, error } = await supabase
        .from('complaints')
        .insert({
          complaint_id: complaintId,
          citizen_phone: fromNumber,
          citizen_name: contactName,
          category: category as any,
          title: title,
          description: description,
          location: location,
          status: 'registered',
          priority: 'medium',
          intake_channel: 'whatsapp',
          external_ref_id: messageId,
          intake_timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      complaint = data;
    } catch (dbError: any) {
      // Database error - use mock mode
      if (dbError.message?.includes('table') || dbError.message?.includes('does not exist')) {
        console.log('[v0] Database not available for WhatsApp, using mock mode');
        complaint = {
          complaint_id: complaintId,
          citizen_phone: fromNumber,
          status: 'registered',
        };
      } else {
        console.error('[v0] WhatsApp complaint creation error:', dbError);
        return;
      }
    }

    console.log('[v0] Complaint received from WhatsApp:', complaint.complaint_id);

    // Send WhatsApp confirmation message
    const responseMessage = `Thank you for your complaint. Reference: ${complaint.complaint_id}. We will process it shortly.`;
    console.log('[v0] WhatsApp confirmation would be sent to:', fromNumber);
    
    // In production, use WhatsApp Business API to send response
    // await sendWhatsAppMessage(fromNumber, responseMessage);
  } catch (error) {
    console.error('[v0] WhatsApp processing error:', error);
  }
}

/**
 * Generate a complaint ID
 */
function generateComplaintId(): string {
  const year = new Date().getFullYear();
  const randomId = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  return `VHB-${year}-${randomId}`;
}
