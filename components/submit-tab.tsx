'use client';

import { useState } from 'react';

const departmentMap: { [key: string]: string } = {
  'Roads & Potholes': 'Public Works',
  'Water Supply': 'Water & Sewage',
  'Drainage & Sewage': 'Water & Sewage',
  'Garbage Collection': 'Sanitation',
  'Street Lights': 'Public Works',
  'Illegal Construction': 'Building Dept',
  'Stray Animals': 'Health Dept',
  'Tree Cutting / Falling': 'Parks & Gardens',
  'Park & Garden': 'Parks & Gardens',
  'Mosquito / Pest Control': 'Health Dept',
  'Encroachment': 'Public Works',
  'Birth / Death Certificate': 'Civic Center'
};

const priorityMap: { [key: string]: string } = {
  'Roads & Potholes': 'Medium',
  'Water Supply': 'High',
  'Drainage & Sewage': 'High',
  'Garbage Collection': 'Low',
  'Street Lights': 'Medium',
  'Illegal Construction': 'Medium',
  'Stray Animals': 'Medium',
  'Tree Cutting / Falling': 'High',
  'Park & Garden': 'Low',
  'Mosquito / Pest Control': 'High',
  'Encroachment': 'High',
  'Birth / Death Certificate': 'Low'
};

export default function SubmitTab() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    ward: '',
    source: 'Web form',
    address: '',
    category: '',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState('');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: any) => {
    const category = e.target.value;
    setFormData(prev => ({ ...prev, category }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.category || !formData.description || !formData.address || !formData.ward) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const response = await fetch('/api/complaints/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.id) {
        setComplaintId(data.id);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ name: '', phone: '', email: '', ward: '', source: 'Web form', address: '', category: '', description: '' });
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
    }
  };

  const dept = formData.category ? departmentMap[formData.category] || 'TBD' : '';
  const priority = formData.category ? priorityMap[formData.category] || 'Medium' : '';

  return (
    <div className="two" style={{ gap: '14px' }}>
      {submitted && (
        <div style={{
          background: 'var(--green-bg)',
          color: 'var(--green)',
          padding: '12px 16px',
          borderRadius: 'var(--radius)',
          fontSize: '13px',
          marginBottom: '12px',
          fontWeight: 500,
          border: '1px solid rgba(29,106,45,0.2)',
          gridColumn: '1 / -1'
        }}>
          ✓ Complaint submitted successfully! Your ID: <strong>{complaintId}</strong>
        </div>
      )}

      <div>
        {/* Your Details Card */}
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
          }}>Your details</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', marginBottom: '4px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rajesh Patel"
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1.5px solid var(--border2)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  fontFamily: 'var(--font)',
                  color: 'var(--text)',
                  background: '#fff',
                  transition: 'border-color 0.15s',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', marginBottom: '4px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Mobile number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit"
                maxLength={10}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1.5px solid var(--border2)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  fontFamily: 'var(--font)',
                  color: 'var(--text)',
                  background: '#fff',
                  transition: 'border-color 0.15s',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', marginBottom: '4px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email (optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '9px 11px',
                border: '1.5px solid var(--border2)',
                borderRadius: 'var(--radius)',
                fontSize: '13px',
                fontFamily: 'var(--font)',
                color: 'var(--text)',
                background: '#fff',
                transition: 'border-color 0.15s',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', marginBottom: '4px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ward / area *</label>
              <select
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1.5px solid var(--border2)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  fontFamily: 'var(--font)',
                  color: 'var(--text)',
                  background: '#fff',
                  transition: 'border-color 0.15s',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select ward</option>
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={`Ward ${i + 1}`}>Ward {i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', marginBottom: '4px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Channel</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1.5px solid var(--border2)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  fontFamily: 'var(--font)',
                  color: 'var(--text)',
                  background: '#fff',
                  transition: 'border-color 0.15s',
                  boxSizing: 'border-box'
                }}
              >
                <option>Web form</option>
                <option>WhatsApp</option>
                <option>SMS</option>
                <option>Phone / IVR</option>
                <option>Instagram</option>
                <option>Twitter / X</option>
                <option>Walk-in</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', marginBottom: '4px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Landmark / address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nearest landmark or street name"
              style={{
                width: '100%',
                padding: '9px 11px',
                border: '1.5px solid var(--border2)',
                borderRadius: 'var(--radius)',
                fontSize: '13px',
                fontFamily: 'var(--font)',
                color: 'var(--text)',
                background: '#fff',
                transition: 'border-color 0.15s',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Complaint Details Card */}
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
          }}>Complaint details</div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', marginBottom: '4px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              style={{
                width: '100%',
                padding: '9px 11px',
                border: '1.5px solid var(--border2)',
                borderRadius: 'var(--radius)',
                fontSize: '13px',
                fontFamily: 'var(--font)',
                color: 'var(--text)',
                background: '#fff',
                transition: 'border-color 0.15s',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select category</option>
              {Object.keys(departmentMap).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', marginBottom: '4px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Department (auto)</label>
              <input
                type="text"
                readOnly
                value={dept}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1.5px solid var(--border2)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  fontFamily: 'var(--font)',
                  color: 'var(--text)',
                  background: 'var(--off)',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', marginBottom: '4px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Priority (auto)</label>
              <input
                type="text"
                readOnly
                value={priority}
                style={{
                  width: '100%',
                  padding: '9px 11px',
                  border: '1.5px solid var(--border2)',
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  fontFamily: 'var(--font)',
                  color: 'var(--text)',
                  background: 'var(--off)',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text2)', marginBottom: '4px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe clearly — location, severity, time of occurrence…"
              style={{
                width: '100%',
                padding: '9px 11px',
                border: '1.5px solid var(--border2)',
                borderRadius: 'var(--radius)',
                fontSize: '13px',
                fontFamily: 'var(--font)',
                color: 'var(--text)',
                background: '#fff',
                transition: 'border-color 0.15s',
                minHeight: '80px',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '12px',
              border: 'none',
              borderRadius: 'var(--radius)',
              background: 'var(--navy)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'var(--font)',
              cursor: 'pointer',
              transition: 'background 0.15s',
              letterSpacing: '0.02em'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as any).style.background = 'var(--navy2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as any).style.background = 'var(--navy)';
            }}
          >
            Submit & get Complaint ID →
          </button>
        </div>
      </div>

      {/* Right Column - Stats & Contacts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Live City Stats */}
        <div style={{
          background: '#fff',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text3)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>Live city stats</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
            <div style={{ background: 'var(--off)', borderRadius: 'var(--radius)', padding: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '4px' }}>Open</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--blue)' }}>—</div>
            </div>
            <div style={{ background: 'var(--off)', borderRadius: 'var(--radius)', padding: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '4px' }}>Resolved</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--green)' }}>—</div>
            </div>
            <div style={{ background: 'var(--off)', borderRadius: 'var(--radius)', padding: '10px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '4px' }}>Avg time</div>
              <div style={{ fontSize: '18px', fontWeight: 700 }}>28h</div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div style={{
          background: '#fff',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text3)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>Emergency contacts</div>

          <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'IVR helpline (toll free)', value: '1800-233-XXXX' },
                { label: 'WhatsApp', value: '+91 9XXX-XXXXXX' },
                { label: 'SMS keyword', value: 'COMPLAIN to 56677' },
                { label: 'Water emergency', value: '1800-XXX-WATER' },
                { label: 'Email', value: 'complaints@vmc.gov.in' }
              ].map((item, idx) => (
                <tr key={idx} style={{ borderBottom: idx < 4 ? '0.5px solid var(--off2)' : 'none' }}>
                  <td style={{ padding: '8px 0', color: 'var(--text2)' }}>{item.label}</td>
                  <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 700, color: idx === 3 ? 'var(--red)' : 'var(--blue)' }}>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
