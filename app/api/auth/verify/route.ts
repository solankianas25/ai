import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get session from request header (for API calls)
    const sessionToken = request.headers.get('x-vmc-session');

    if (!sessionToken) {
      return NextResponse.json(
        { authenticated: false, error: 'No session token' },
        { status: 401 }
      );
    }

    // Verify and decode the session token
    try {
      const decoded = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'));
      const loginTime = new Date(decoded.loginTime).getTime();
      const now = new Date().getTime();

      if (now - loginTime > decoded.expiresIn) {
        return NextResponse.json(
          { authenticated: false, error: 'Session expired' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          authenticated: true,
          userId: decoded.id,
          userType: decoded.type,
          role: decoded.role,
          expiresIn: decoded.expiresIn - (now - loginTime),
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { authenticated: false, error: 'Invalid session token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('[v0] Session verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
