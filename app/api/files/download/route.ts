import { get } from '@vercel/blob';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.searchParams.get('pathname');
    const complaintId = request.nextUrl.searchParams.get('complaintId');

    if (!pathname) {
      return NextResponse.json(
        { error: 'Missing pathname' },
        { status: 400 }
      );
    }

    // Security check: ensure the file belongs to the requested complaint
    if (complaintId && !pathname.includes(complaintId)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Retrieve the private file
    const result = await get(pathname, {
      access: 'private',
      ifNoneMatch: request.headers.get('if-none-match') ?? undefined,
    });

    if (!result) {
      return new NextResponse('File not found', { status: 404 });
    }

    // If file hasn't changed, return 304 Not Modified
    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          'Cache-Control': 'private, no-cache',
        },
      });
    }

    // Stream the file to the client
    return new NextResponse(result.stream, {
      headers: {
        'Content-Type': result.blob.contentType,
        'Content-Disposition': `attachment; filename="${pathname.split('/').pop()}"`,
        ETag: result.blob.etag,
        'Cache-Control': 'private, no-cache',
      },
    });
  } catch (error) {
    console.error('[v0] Error serving file:', error);
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  }
}
