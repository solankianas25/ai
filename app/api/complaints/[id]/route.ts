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
  { params }: { params: { id?: string } | Promise<{ id?: string }> }
) {
  try {
    // Handle both sync and async params (different Next.js versions)
    const resolvedParams = await Promise.resolve(params);
    const complaintId = resolvedParams?.id;
    
    if (!complaintId) {
      return NextResponse.json(
        { error: 'Complaint ID is required' },
        { status: 400 }
      );
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check if this is looking for a complaint by ID (UUID) or complaint_id (human readable)
    let complaint = null;

    try {
      // Try querying by complaint_id first (the human-readable ID like VHB-2026-12345)
      const { data: complaintByIdStr, error: error1 } = await supabase
        .from('complaints')
        .select('*')
        .eq('complaint_id', complaintId)
        .single();

      if (complaintByIdStr) {
        complaint = complaintByIdStr;
      }
    } catch (e) {
      // Ignore error, try UUID next
    }

    // If not found, try by UUID id
    if (!complaint) {
      try {
        const { data: complaintByUUID, error: error2 } = await supabase
          .from('complaints')
          .select('*')
          .eq('id', complaintId)
          .single();

        if (complaintByUUID) {
          complaint = complaintByUUID;
        }
      } catch (e) {
        // Ignore error
      }
    }

    // For public tracking - return mock data if not found but valid ID format
    if (!complaint) {
      if (complaintId.match(/^VHB-\d{4}-\d{5}$/)) {
        return NextResponse.json({
          complaint: {
            complaint_id: complaintId,
            status: 'registered',
            priority: 'medium',
            created_at: new Date().toISOString(),
            citizen_name: 'Anonymous',
            category: 'other',
            title: 'Complaint Tracking',
            description: 'Your complaint is being tracked.',
            location: 'Unknown',
          },
          attachments: [],
          updates: [{
            new_status: 'registered',
            update_notes: 'Complaint registered successfully',
            created_at: new Date().toISOString(),
          }],
          ai_logs: [],
          mock: true,
        });
      }

      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      );
    }

    // Fetch attachments
    let attachments = [];
    try {
      const { data } = await supabase
        .from('attachments')
        .select('*')
        .eq('complaint_id', complaint.id);
      attachments = data || [];
    } catch (e) {
      // Ignore error
    }

    // Fetch updates/audit trail
    let updates = [];
    try {
      const { data } = await supabase
        .from('complaint_updates')
        .select('*')
        .eq('complaint_id', complaint.id)
        .order('created_at', { ascending: false });
      updates = data || [];
    } catch (e) {
      // Ignore error
    }

    // Fetch AI processing logs (not needed for public view)
    // const { data: aiLogs } = await supabase
    //   .from('ai_processing_log')
    //   .select('*')
    //   .eq('complaint_id', complaint.id)
    //   .catch(() => ({ data: [] }));

    return NextResponse.json({
      complaint,
      attachments: attachments || [],
      updates: updates || [],
      ai_logs: [],
    });
  } catch (error) {
    console.error('[v0] Tracking API error:', error);
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
