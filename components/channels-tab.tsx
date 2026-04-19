'use client';

import { useState } from 'react';

interface Channel {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
  availability: string;
  color: string;
  action: string;
}

const CHANNELS: Channel[] = [
  {
    id: 'web',
    name: 'Web Form',
    icon: '🌐',
    description: 'File complaints directly through our online portal',
    features: ['File complaints anytime', 'Upload attachments', 'Real-time tracking', 'SMS/Email updates'],
    availability: '24/7',
    color: 'var(--blue)',
    action: 'submit'
  },
  {
    id: 'sms',
    name: 'SMS (WhatsApp)',
    icon: '💬',
    description: 'Send complaints via WhatsApp to our dedicated number',
    features: ['Quick submission', 'Easy to use', 'Get reference ID', 'Mobile friendly'],
    availability: '24/7',
    color: 'var(--green)',
    action: 'whatsapp'
  },
  {
    id: 'call',
    name: 'Phone / IVR',
    icon: '☎️',
    description: 'Call our IVR system to file complaints via voice',
    features: ['Voice-based filing', 'Multi-language', 'Automated response', 'Quick processing'],
    availability: '9 AM - 6 PM',
    color: 'var(--orange)',
    action: 'ivr'
  },
  {
    id: 'walkin',
    name: 'Walk-in Counter',
    icon: '🏛️',
    description: 'Visit our offices to file complaints in person',
    features: ['Direct assistance', 'Document submission', 'Officer support', 'Instant ID generation'],
    availability: '9 AM - 1 PM, 2 PM - 6 PM',
    color: 'var(--saffron)',
    action: 'walkin'
  },
  {
    id: 'social',
    name: 'Social Media',
    icon: '📱',
    description: 'Reach out via our social media channels',
    features: ['Facebook messages', 'Twitter DMs', 'Instagram DMs', 'Quick response'],
    availability: '24/7',
    color: '#1f2937',
    action: 'social'
  },
  {
    id: 'email',
    name: 'Email',
    icon: '✉️',
    description: 'Send detailed complaints with attachments via email',
    features: ['Detailed descriptions', 'Multiple attachments', 'Document proof', 'Formal record'],
    availability: '24/7',
    color: '#6b7280',
    action: 'email'
  }
];

export default function ChannelsTab({ onChannelSelect }: { onChannelSelect: (channel: string) => void }) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  const handleChannelClick = (channel: Channel) => {
    if (channel.action === 'submit') {
      onChannelSelect('submit');
    } else if (channel.action === 'ivr') {
      setSelectedChannel('ivr');
    } else if (channel.action === 'whatsapp') {
      setSelectedChannel('whatsapp');
    } else if (channel.action === 'walkin') {
      setSelectedChannel('walkin');
    } else if (channel.action === 'social') {
      setSelectedChannel('social');
    } else if (channel.action === 'email') {
      setSelectedChannel('email');
    }
  };

  // IVR Modal
  if (selectedChannel === 'ivr') {
    return (
      <div style={{ marginBottom: '40px' }}>
        <button
          onClick={() => setSelectedChannel(null)}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            background: 'var(--navy)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px'
          }}
        >
          ← Back to channels
        </button>

        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--navy)' }}>
            ☎️ Phone / IVR System
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '12px' }}>
              Our automated IVR (Interactive Voice Response) system allows you to file complaints over the phone without speaking to an agent.
            </p>
          </div>

          <div style={{
            background: 'var(--off)',
            padding: '16px',
            borderRadius: 'var(--radius)',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Call now
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--navy)', fontFamily: 'monospace', marginBottom: '8px' }}>
              📞 +91-265-2791000
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
              Available: 9 AM - 6 PM, Monday to Saturday
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--navy)' }}>
              How to use the IVR system:
            </h3>
            <ol style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.8, paddingLeft: '20px' }}>
              <li style={{ marginBottom: '10px' }}>
                <strong>Press 1</strong> for File a New Complaint
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Enter your phone number</strong> when prompted
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Select complaint category:</strong>
                <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
                  <li>Press 1 for Roads & Potholes</li>
                  <li>Press 2 for Water Supply</li>
                  <li>Press 3 for Drainage & Sewage</li>
                  <li>Press 4 for Garbage Collection</li>
                  <li>Press 5 for Street Lights</li>
                  <li>Press 6 for Other Issues</li>
                </ul>
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Describe your issue</strong> in brief after the beep
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Receive your Complaint ID</strong> via SMS
              </li>
              <li>
                <strong>Track your complaint</strong> anytime using your ID
              </li>
            </ol>
          </div>

          <div style={{
            background: '#fff3cd',
            padding: '12px 16px',
            borderRadius: 'var(--radius)',
            borderLeft: '4px solid var(--orange)',
            fontSize: '12px',
            color: '#856404'
          }}>
            <strong>ℹ️ Tip:</strong> Make sure you are in a quiet place when calling the IVR system for better voice recognition accuracy.
          </div>
        </div>
      </div>
    );
  }

  // WhatsApp Modal
  if (selectedChannel === 'whatsapp') {
    return (
      <div style={{ marginBottom: '40px' }}>
        <button
          onClick={() => setSelectedChannel(null)}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            background: 'var(--navy)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px'
          }}
        >
          ← Back to channels
        </button>

        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--green)' }}>
            💬 WhatsApp Messages
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '12px' }}>
              Send your complaint details via WhatsApp to our dedicated number. We will respond with your unique Complaint ID within 2 hours.
            </p>
          </div>

          <div style={{
            background: 'var(--off)',
            padding: '16px',
            borderRadius: 'var(--radius)',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Send WhatsApp message to
            </div>
            <a
              href="https://wa.me/919876543210?text=Hi%20VMC%2C%20I%20want%20to%20file%20a%20complaint"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--green)',
                textDecoration: 'none',
                marginBottom: '8px'
              }}
            >
              📱 +91 98765-43210
            </a>
            <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
              Available: 24/7 (Responses within 2 hours)
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--navy)' }}>
              Message format:
            </h3>
            <div style={{
              background: '#f3f4f6',
              padding: '12px',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: 'var(--text)',
              lineHeight: 1.8
            }}>
              Subject: [Issue Category]<br/>
              Location: [Your Address]<br/>
              <br/>
              Description: [Detailed description of issue]<br/>
              <br/>
              Contact: [Your Name & Phone]
            </div>
          </div>

          <button
            onClick={() => window.open('https://wa.me/919876543210?text=Hi%20VMC%2C%20I%20want%20to%20file%20a%20complaint', '_blank')}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--green)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '14px'
            }}
          >
            Open WhatsApp
          </button>
        </div>
      </div>
    );
  }

  // Walkin Modal
  if (selectedChannel === 'walkin') {
    return (
      <div style={{ marginBottom: '40px' }}>
        <button
          onClick={() => setSelectedChannel(null)}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            background: 'var(--navy)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px'
          }}
        >
          ← Back to channels
        </button>

        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--saffron)' }}>
            🏛️ Walk-in Counter
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '12px' }}>
              Visit our municipal offices to file complaints in person. Get instant assistance from our complaint management officers.
            </p>
          </div>

          <div style={{
            background: 'var(--off)',
            padding: '16px',
            borderRadius: 'var(--radius)',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Main office
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>
              Vadodara Municipal Corporation Headquarters
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '12px' }}>
              Narmada Nagar, Refinery Road<br/>
              Vadodara, Gujarat 390007
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
              <strong>Hours:</strong> 9:00 AM - 1:00 PM, 2:00 PM - 6:00 PM<br/>
              <strong>Days:</strong> Monday to Saturday (Closed on Sundays & Public Holidays)<br/>
              <strong>Phone:</strong> +91-265-2791000
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--navy)' }}>
              Branch Offices:
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              {[
                { name: 'North Zone', address: 'North Zone Office, Chhani Road' },
                { name: 'South Zone', address: 'South Zone Office, Akota' },
                { name: 'East Zone', address: 'East Zone Office, Karelibaug' },
                { name: 'West Zone', address: 'West Zone Office, Alkapuri' }
              ].map((office, idx) => (
                <div key={idx} style={{
                  background: 'var(--off2)',
                  padding: '12px',
                  borderRadius: 'var(--radius)',
                  fontSize: '12px'
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '4px' }}>{office.name}</div>
                  <div style={{ color: 'var(--text2)', fontSize: '11px' }}>{office.address}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: '#e8f5e9',
            padding: '12px 16px',
            borderRadius: 'var(--radius)',
            borderLeft: '4px solid var(--green)',
            fontSize: '12px',
            color: '#2e7d32'
          }}>
            <strong>✓ What to bring:</strong> Valid ID proof, address proof, photos/documents related to the issue
          </div>
        </div>
      </div>
    );
  }

  // Social Media Modal
  if (selectedChannel === 'social') {
    return (
      <div style={{ marginBottom: '40px' }}>
        <button
          onClick={() => setSelectedChannel(null)}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            background: 'var(--navy)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px'
          }}
        >
          ← Back to channels
        </button>

        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#1f2937' }}>
            📱 Social Media
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '12px' }}>
              Reach out to us via our official social media accounts. Our team monitors these channels 24/7 and will respond promptly to your complaints.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px'
          }}>
            {[
              { platform: 'Facebook', handle: '@VadodaraMunicipal', url: 'https://www.facebook.com/VadodaraMunicipalCorporation', emoji: '👍' },
              { platform: 'Twitter', handle: '@VadodaraVMC', url: 'https://twitter.com/VadodaraVMC', emoji: '𝕏' },
              { platform: 'Instagram', handle: '@vadodaravmc', url: 'https://www.instagram.com/vadodaravmc/', emoji: '📷' }
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px',
                  background: 'var(--off)',
                  borderRadius: 'var(--radius)',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as any).style.background = 'var(--off2)';
                  (e.currentTarget as any).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as any).style.background = 'var(--off)';
                  (e.currentTarget as any).style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{social.emoji}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>{social.platform}</div>
                <div style={{ fontSize: '11px', color: 'var(--text2)' }}>{social.handle}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Email Modal
  if (selectedChannel === 'email') {
    return (
      <div style={{ marginBottom: '40px' }}>
        <button
          onClick={() => setSelectedChannel(null)}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            background: 'var(--navy)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px'
          }}
        >
          ← Back to channels
        </button>

        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#6b7280' }}>
            ✉️ Email
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '12px' }}>
              Send detailed complaints with attachments via email. This is best for complex issues that require multiple supporting documents.
            </p>
          </div>

          <div style={{
            background: 'var(--off)',
            padding: '16px',
            borderRadius: 'var(--radius)',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Email addresses
            </div>
            <a
              href="mailto:complaints@vmc.gov.in"
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0066cc',
                textDecoration: 'none',
                marginBottom: '8px'
              }}
            >
              complaints@vmc.gov.in
            </a>
            <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
              General complaints portal
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--navy)' }}>
              Email template:
            </h3>
            <div style={{
              background: '#f3f4f6',
              padding: '12px',
              borderRadius: 'var(--radius)',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: 'var(--text)',
              lineHeight: 1.8
            }}>
              <strong>Subject:</strong> Complaint: [Issue Category] - Ward [Ward Number]<br/>
              <br/>
              <strong>Body:</strong><br/>
              Dear VMC Officer,<br/>
              <br/>
              I would like to file a complaint regarding [issue category].<br/>
              <br/>
              <strong>Issue Details:</strong><br/>
              Location: [Full Address]<br/>
              Ward: [Ward Number]<br/>
              Date of Issue: [Date]<br/>
              Description: [Detailed description]<br/>
              <br/>
              <strong>My Contact Information:</strong><br/>
              Name: [Your Name]<br/>
              Phone: [Your Phone Number]<br/>
              Email: [Your Email]<br/>
              <br/>
              Attached are supporting documents.<br/>
              <br/>
              Thank you,<br/>
              [Your Name]
            </div>
          </div>

          <button
            onClick={() => window.location.href = 'mailto:complaints@vmc.gov.in'}
            style={{
              width: '100%',
              padding: '12px',
              background: '#6b7280',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '14px'
            }}
          >
            Send Email
          </button>
        </div>
      </div>
    );
  }

  // Default: Show all channels
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--navy)', marginBottom: '12px' }}>
          Multiple ways to file a complaint
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6 }}>
          Choose the channel that works best for you. All complaints are tracked with a unique ID and can be monitored in real-time.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '12px'
      }}>
        {CHANNELS.map((channel) => (
          <button
            key={channel.id}
            onClick={() => handleChannelClick(channel)}
            style={{
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as any).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
              (e.currentTarget as any).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as any).style.boxShadow = 'none';
              (e.currentTarget as any).style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '28px' }}>{channel.icon}</div>
              <div style={{
                fontSize: '10px',
                fontWeight: 700,
                background: channel.color + '20',
                color: channel.color,
                padding: '4px 8px',
                borderRadius: 'var(--radius)',
                textTransform: 'uppercase'
              }}>
                {channel.availability}
              </div>
            </div>

            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', marginBottom: '6px' }}>
              {channel.name}
            </h3>

            <p style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5, marginBottom: '10px' }}>
              {channel.description}
            </p>

            <ul style={{ fontSize: '11px', color: 'var(--text3)', marginLeft: '16px', lineHeight: 1.6 }}>
              {channel.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>

            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border)',
              fontSize: '12px',
              fontWeight: 700,
              color: channel.color
            }}>
              Get started →
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
