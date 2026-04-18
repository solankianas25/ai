'use client';

import { useState } from 'react';

interface TrackingResult {
  complaint: {
    complaint_id: string;
    status: string;
    priority: string;
    category?: string;
    title?: string;
    created_at?: string;
  };
  updates?: Array<{
    new_status: string;
    update_notes?: string;
    created_at?: string;
  }>;
  mock?: boolean;
}

export default function TrackTab() {
  const [complaintId, setComplaintId] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    if (!complaintId.trim()) {
      setError('Please enter a Complaint ID');
      return;
    }

    setIsLoading(true);
    setError('');
    setTrackingData(null);

    try {
      const response = await fetch(`/api/complaints/${complaintId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Complaint ID not found. Please check and try again.');
        } else {
          setError(`Error: ${response.statusText}`);
        }
        setIsLoading(false);
        return;
      }

      const data: TrackingResult = await response.json();
      setTrackingData(data);
    } catch (err) {
      console.error('[v0] Error tracking complaint:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'registered': 'var(--blue)',
      'assigned': 'var(--orange)',
      'in_progress': 'var(--orange)',
      'resolved': 'var(--green)',
      'rejected': '#c00',
      'escalated': '#d9a600',
      'on_hold': '#666'
    };
    return colors[status] || '#333';
  };

  return (
    <div className="two" style={{ gap: '14px' }}>
      <div style={{
        background: '#fff',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        marginBottom: '14px'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--text3)',
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>Track your complaint</div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text2)',
            marginBottom: '4px',
            display: 'block',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>Complaint ID</label>
          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
            placeholder="VMC-2024-00101"
            style={{
              width: '100%',
              padding: '9px 11px',
              border: '1.5px solid var(--border2)',
              borderRadius: 'var(--radius)',
              fontSize: '15px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              fontFamily: 'var(--font)',
              color: 'var(--text)',
              background: '#fff',
              boxSizing: 'border-box',
              textTransform: 'uppercase'
            }}
          />
        </div>

        <button
          onClick={handleTrack}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '11px',
            border: 'none',
            borderRadius: 'var(--radius)',
            background: isLoading ? '#ccc' : 'var(--navy)',
            color: isLoading ? '#666' : '#fff',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'var(--font)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
            opacity: isLoading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              (e.currentTarget as any).style.background = 'var(--navy2)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              (e.currentTarget as any).style.background = 'var(--navy)';
            }
          }}
        >
          {isLoading ? 'Searching...' : 'Track now →'}
        </button>

        {error && (
          <div style={{
            marginTop: '10px',
            fontSize: '11px',
            color: '#c00',
            padding: '8px',
            background: '#ffe8e8',
            borderRadius: 'var(--radius)',
            border: '1px solid rgba(204,0,0,0.2)'
          }}>
            ⚠ {error}
          </div>
        )}

        {!trackingData && !error && (
          <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text3)' }}>
            Example: VHB-2026-12345
          </div>
        )}
      </div>

      {trackingData && (
        <div style={{
          background: '#fff',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: '14px'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Complaint ID
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
              {trackingData.complaint.complaint_id}
            </h3>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.8' }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>Status:</strong>{' '}
              <span style={{
                fontWeight: 700,
                color: getStatusColor(trackingData.complaint.status),
                textTransform: 'capitalize'
              }}>
                {trackingData.complaint.status.replace(/_/g, ' ')}
              </span>
              {trackingData.mock && (
                <span style={{ fontSize: '10px', color: 'var(--text3)', marginLeft: '8px' }}>
                  (Demo)
                </span>
              )}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Priority:</strong> <span style={{ textTransform: 'capitalize' }}>{trackingData.complaint.priority}</span>
            </div>
            {trackingData.complaint.category && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Category:</strong> <span style={{ textTransform: 'capitalize' }}>{trackingData.complaint.category.replace(/_/g, ' ')}</span>
              </div>
            )}
            {trackingData.complaint.title && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Title:</strong> {trackingData.complaint.title}
              </div>
            )}
            {trackingData.complaint.created_at && (
              <div style={{ marginBottom: '10px', fontSize: '11px', color: 'var(--text3)' }}>
                <strong>Registered:</strong> {new Date(trackingData.complaint.created_at).toLocaleDateString()} {new Date(trackingData.complaint.created_at).toLocaleTimeString()}
              </div>
            )}
          </div>

          {trackingData.updates && trackingData.updates.length > 0 && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Recent Updates
              </div>
              <div style={{ fontSize: '12px' }}>
                {trackingData.updates.slice(0, 3).map((update, idx) => (
                  <div key={idx} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: idx < trackingData.updates!.length - 1 ? '1px solid var(--off)' : 'none' }}>
                    <div style={{ fontWeight: 700, color: getStatusColor(update.new_status), textTransform: 'capitalize' }}>
                      {update.new_status.replace(/_/g, ' ')}
                    </div>
                    {update.update_notes && (
                      <div style={{ fontSize: '11px', color: 'var(--text2)', marginTop: '2px' }}>
                        {update.update_notes}
                      </div>
                    )}
                    {update.created_at && (
                      <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '2px' }}>
                        {new Date(update.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        @media (max-width: 900px) {
          .two {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
