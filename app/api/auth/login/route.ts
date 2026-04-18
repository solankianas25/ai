import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface LoginPayload {
  id: string;
  password: string;
  type: 'officer' | 'admin';
}

// Demo credentials - in production, validate against Supabase Auth
const DEMO_CREDENTIALS = {
  officer: {
    id: 'VMC-OFF-042',
    password: '1234',
  },
  admin: {
    id: 'VMC-ADM-001',
    password: '1234',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body: LoginPayload = await request.json();

    const { id, password, type } = body;

    if (!id || !password || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate credentials (demo mode)
    const demoUser = DEMO_CREDENTIALS[type];

    if (id !== demoUser.id || password !== demoUser.password) {
      console.log('[v0] Invalid login attempt:', { id, type });
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token
    const sessionToken = Buffer.from(
      JSON.stringify({
        id: id,
        type: type,
        role: type === 'admin' ? 'admin' : 'officer',
        loginTime: new Date().toISOString(),
        expiresIn: 24 * 60 * 60 * 1000, // 24 hours
      })
    ).toString('base64');

    return NextResponse.json(
      {
        success: true,
        sessionToken,
        userId: id,
        userType: type,
        message: 'Login successful',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Login failed' },
      { status: 500 }
    );
  }
}
