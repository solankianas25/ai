import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ComplaintStatus, ComplaintPriority } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/complaints/[id]
 * Fetch detailed complaint information
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const complaintId = params.id;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });

    // Fetch complaint
    const { data: complaint, error: complaintError } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', complaintId)
      .single();

    if (complaintError || !complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Fetch attachments
    const { data: attachments } = await supabase
      .from('attachments')
      .select('*')
      .eq('complaint_id', complaintId);

    // Fetch updates/audit trail
    const { data: updates } = await supabase
      .from('complaint_updates')
      .select('*')
      .eq('complaint_id', complaintId)
      .order('created_at', { ascending: false });

    // Fetch AI processing logs
    const { data: aiLogs } = await supabase
      .from('ai_processing_log')
      .select('*')
      .eq('complaint_id', complaintId)
      .order('created_at', { ascending: false });

    return NextResponse.json({
      complaint,
      attachments: attachments || [],
      updates: updates || [],
      ai_logs: aiLogs || [],
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/complaints/[id]
 * Update complaint status, priority, assignment, etc.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const complaintId = params.id;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });

    const body = await request.json();
    const {
      status,
      priority,
      assigned_to,
      update_notes,
      is_escalated,
      escalation_reason,
    } = body;

    // Get current complaint for audit trail
    const { data: currentComplaint } = await supabase
      .from('complaints')
      .select('status, priority')
      .eq('id', complaintId)
      .single();

    if (!currentComplaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Update complaint
    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assigned_to !== undefined) {
      updateData.assigned_to = assigned_to;
      updateData.assigned_at = assigned_to ? new Date().toISOString() : null;
    }
    if (is_escalated !== undefined) updateData.is_escalated = is_escalated;
    if (escalation_reason !== undefined) updateData.escalation_reason = escalation_reason;

    const { data: updated, error: updateError } = await supabase
      .from('complaints')
      .update(updateData)
      .eq('id', complaintId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update complaint' },
        { status: 500 }
      );
    }

    // Create audit trail entry
    if (status || priority || assigned_to !== undefined) {
      await supabase.from('complaint_updates').insert({
        complaint_id: complaintId,
        updated_by: user?.id || null,
        old_status: currentComplaint.status,
        new_status: status || currentComplaint.status,
        old_priority: currentComplaint.priority,
        new_priority: priority || currentComplaint.priority,
        update_notes: update_notes || null,
        update_type: status ? 'status_change' : 'priority_update',
      });
    }

    return NextResponse.json(
      {
        success: true,
        complaint: updated,
        message: 'Complaint updated successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
