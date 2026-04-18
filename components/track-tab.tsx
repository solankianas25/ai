'use client';

import { useState } from 'react';

export default function TrackTab() {
  const [complaintId, setComplaintId] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);

  const handleTrack = async () => {
    if (!complaintId) return;
    try {
      const response = await fetch(`/api/complaints/${complaintId}`);
      const data = await response.json();
      setTrackingData(data);
    } catch (error) {
      console.error('Error tracking complaint:', error);
      alert('Complaint ID not found');
    }
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
          style={{
            width: '100%',
            padding: '11px',
            border: 'none',
            borderRadius: 'var(--radius)',
            background: 'var(--navy)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
            fontFamily: 'var(--font)',
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
          Track now →
        </button>

        <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text3)' }}>
          Sample IDs: VMC-2024-00101 · VMC-2024-00102 · VMC-2024-00104
        </div>
      </div>

      {trackingData && (
        <div style={{
          background: '#fff',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          marginBottom: '14px'
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>{trackingData.id}</h3>
          <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: '1.8' }}>
            <p><strong>Category:</strong> {trackingData.category}</p>
            <p><strong>Status:</strong> <span style={{ fontWeight: 700, color: 'var(--green)' }}>{trackingData.status}</span></p>
            <p><strong>Priority:</strong> {trackingData.priority}</p>
            <p><strong>Assigned to:</strong> {trackingData.assigned_to || 'Pending'}</p>
          </div>
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
