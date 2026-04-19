'use client';

import { useState, useRef } from 'react';

interface FileUploadProps {
  complaintId: string;
  onFileUploaded?: (file: UploadedFile) => void;
}

interface UploadedFile {
  pathname: string;
  filename: string;
  size: number;
  contentType: string;
  uploadedAt: string;
}

export default function FileUpload({ complaintId, onFileUploaded }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    setError('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const formData = new FormData();
        formData.append('file', file);
        formData.append('complaintId', complaintId);

        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Upload failed');
          continue;
        }

        setUploadedFiles((prev) => [...prev, data]);
        onFileUploaded?.(data);
      }
    } catch (err) {
      console.error('[v0] Error uploading file:', err);
      setError('Upload error. Please try again.');
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownload = (file: UploadedFile) => {
    const url = `/api/files/download?pathname=${encodeURIComponent(file.pathname)}&complaintId=${encodeURIComponent(complaintId)}`;
    window.open(url, '_blank');
  };

  const handleDelete = async (file: UploadedFile) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch('/api/files/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathname: file.pathname,
          complaintId: complaintId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Delete failed');
        return;
      }

      setUploadedFiles((prev) => prev.filter((f) => f.pathname !== file.pathname));
    } catch (err) {
      console.error('[v0] Error deleting file:', err);
      setError('Delete error. Please try again.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div style={{
      padding: '16px',
      background: 'var(--off)',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      marginBottom: '16px'
    }}>
      <div style={{
        fontSize: '12px',
        fontWeight: 700,
        color: 'var(--text3)',
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        marginBottom: '12px'
      }}>
        📎 Attachments
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* Upload area */}
        <label style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          border: '2px dashed var(--border)',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          background: '#fafafa',
          transition: 'all 0.15s',
        }}
          onMouseEnter={(e) => {
            (e.currentTarget as any).style.background = '#f0f0f0';
            (e.currentTarget as any).style.borderColor = 'var(--navy)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as any).style.background = '#fafafa';
            (e.currentTarget as any).style.borderColor = 'var(--border)';
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            disabled={isLoading}
            style={{
              display: 'none'
            }}
          />
          <div style={{
            textAlign: 'center',
            fontSize: '13px',
            color: isLoading ? '#999' : 'var(--text2)',
          }}>
            {isLoading ? (
              <>
                <div style={{ marginBottom: '8px' }}>Uploading...</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Please wait</div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '4px', fontWeight: 600 }}>Click to upload or drag & drop</div>
                <div style={{ fontSize: '11px', color: 'var(--text3)' }}>JPEG, PNG, WebP, PDF, TXT (max 10MB)</div>
              </>
            )}
          </div>
        </label>

        {/* Error message */}
        {error && (
          <div style={{
            fontSize: '12px',
            color: '#c00',
            background: '#ffe8e8',
            padding: '10px',
            borderRadius: 'var(--radius)',
            border: '1px solid rgba(204,0,0,0.2)'
          }}>
            {error}
          </div>
        )}

        {/* Uploaded files list */}
        {uploadedFiles.length > 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text3)',
              textTransform: 'uppercase'
            }}>
              {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
            </div>
            {uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px',
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '12px'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                  minWidth: 0
                }}>
                  <span style={{ color: 'var(--text3)' }}>
                    {file.contentType.includes('image') ? '🖼️' : file.contentType.includes('pdf') ? '📄' : '📋'}
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: 'var(--text)',
                      fontWeight: 500
                    }}>
                      {file.filename}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'var(--text3)',
                      marginTop: '2px'
                    }}>
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  marginLeft: '8px'
                }}>
                  <button
                    onClick={() => handleDownload(file)}
                    style={{
                      padding: '4px 8px',
                      background: 'var(--navy)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.background = 'var(--navy2)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.background = 'var(--navy)';
                    }}
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(file)}
                    style={{
                      padding: '4px 8px',
                      background: '#f0f0f0',
                      color: '#c00',
                      border: '1px solid #e0e0e0',
                      borderRadius: 'var(--radius)',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.background = '#ffe8e8';
                      (e.currentTarget as any).style.borderColor = '#ffb3b3';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.background = '#f0f0f0';
                      (e.currentTarget as any).style.borderColor = '#e0e0e0';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
