import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Try to fetch from database
    let data = null;
    let count = 0;
    let error = null;

    try {
      // Build query
      let query = supabase
        .from('complaints')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) query = query.eq('status', status);
      if (category) query = query.eq('category', category);
      if (priority) query = query.eq('priority', priority);

      const result = await query;
      data = result.data;
      count = result.count || 0;
      error = result.error;
    } catch (dbError) {
      console.log('[v0] Database not available, returning mock data');
      error = dbError;
    }

    // If database error, return mock data for development
    if (error && error.message?.includes('table') || error?.message?.includes('does not exist')) {
      return NextResponse.json({
        complaints: [
          {
            id: 'mock-1',
            complaint_id: 'VHB-2026-00001',
            title: 'Pothole on Main Street',
            category: 'roads',
            status: 'in_progress',
            priority: 'high',
            citizen_name: 'John Doe',
            citizen_phone: '9876543210',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'mock-2',
            complaint_id: 'VHB-2026-00002',
            title: 'Water Supply Issue',
            category: 'water_supply',
            status: 'assigned',
            priority: 'high',
            citizen_name: 'Jane Smith',
            citizen_phone: '8765432109',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'mock-3',
            complaint_id: 'VHB-2026-00003',
            title: 'Street Light Not Working',
            category: 'streetlights',
            status: 'registered',
            priority: 'medium',
            citizen_name: 'Bob Johnson',
            citizen_phone: '7654321098',
            created_at: new Date().toISOString(),
          },
        ],
        count: 3,
        limit,
        offset,
        mock: true,
      });
    }

    if (error) {
      console.error('[v0] List API error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch complaints' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      complaints: data,
      count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('[v0] API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
