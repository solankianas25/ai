import { put } from '@vercel/blob';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const complaintId = formData.get('complaintId') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!complaintId) {
      return NextResponse.json(
        { error: 'Complaint ID is required' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'text/plain',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `File type ${file.type} not allowed. Allowed: JPEG, PNG, WebP, PDF, TXT` },
        { status: 400 }
      );
    }

    // Upload to Blob storage with private access
    // Filename format: complaints/complaint-id/filename
    const filename = `complaints/${complaintId}/${Date.now()}-${file.name}`;
    
    const blob = await put(filename, file, {
      access: 'private',
    });

    console.log('[v0] File uploaded:', blob.pathname);

    return NextResponse.json({
      pathname: blob.pathname,
      filename: file.name,
      size: file.size,
      contentType: file.type,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
