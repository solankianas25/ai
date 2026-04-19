import { del } from '@vercel/blob';
import { type NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const { pathname, complaintId } = await request.json();

    if (!pathname) {
      return NextResponse.json(
        { error: 'No pathname provided' },
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

    // Delete the file from Blob storage
    // Note: del() expects the full URL, not pathname
    // If we have pathname, we need to construct the full URL
    // Blob returns URL in format: https://[hash].public.blob.vercel-storage.com/[pathname]
    // For private blobs, construct from pathname
    const url = `https://blob.vercel-storage.com/${pathname}`;
    
    try {
      await del(url);
    } catch (delError: any) {
      // If URL format fails, try direct deletion with pathname
      if (delError.message?.includes('Invalid')) {
        // Blob API might have changed, try alternative approach
        console.log('[v0] Using alternative deletion method');
        await del(pathname as any);
      } else {
        throw delError;
      }
    }

    console.log('[v0] File deleted:', pathname);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[v0] Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}
