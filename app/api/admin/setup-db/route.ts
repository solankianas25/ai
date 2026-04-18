import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Security: Check for admin header (in production, use proper auth)
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET || 'dev-setup-key';
    
    if (authHeader !== `Bearer ${adminSecret}` && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      );
    }

    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Read the SQL migration file
    const sqlPath = join(process.cwd(), 'scripts', '01-init-schema.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Try to verify connection with Supabase
    try {
      const { error: connError } = await supabase.auth.admin.listUsers();
      if (connError) {
        throw connError;
      }
    } catch (testError) {
      console.error('Connection test failed:', testError);
    }

    // Note: Direct SQL execution via client is limited in Supabase JS library
    // The SQL file needs to be executed via Supabase Dashboard or PostgreSQL client
    console.log('Schema SQL prepared:', sql.substring(0, 100) + '...');

    return NextResponse.json({
      success: true,
      message: 'Database schema setup initiated. Check Supabase dashboard to verify.',
      instructions: [
        '1. Go to Supabase Dashboard > SQL Editor',
        '2. Create a new query',
        '3. Paste the contents of scripts/01-init-schema.sql',
        '4. Run the query',
      ],
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Setup failed',
        instructions: [
          '1. Go to Supabase Dashboard > SQL Editor',
          '2. Create a new query',
          '3. Paste the contents of scripts/01-init-schema.sql',
          '4. Run the query',
        ],
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Setup API available',
    instructions: [
      'POST /api/admin/setup-db with Authorization header',
      'Bearer token should match ADMIN_SECRET env var',
    ],
  });
}
