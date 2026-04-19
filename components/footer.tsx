'use client';

import { useState } from 'react';

interface ModalState {
  aboutVMC: boolean;
  departments: boolean;
}

export default function Footer() {
  const [modals, setModals] = useState<ModalState>({ aboutVMC: false, departments: false });

  const toggleModal = (modal: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modal]: !prev[modal] }));
  };

  const socialLinks = {
    facebook: 'https://www.facebook.com/VadodaraMunicipalCorporation',
    twitter: 'https://twitter.com/VadodaraVMC',
    instagram: 'https://www.instagram.com/vadodaravmc/'
  };

  return (
    <>
      <footer style={{
        background: 'var(--navy)',
        color: 'rgba(255,255,255,0.8)',
        marginTop: '48px',
        padding: '40px 0 16px'
      }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            marginBottom: '32px'
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  background: 'var(--saffron)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  color: 'var(--navy)',
                  fontWeight: 700,
                  flexShrink: 0
                }}>V</div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>Vadodara Municipal Corporation</div>
                  <div style={{ fontSize: '10px', opacity: 0.5, letterSpacing: '0.06em', marginTop: '2px' }}>ESTABLISHED 1950</div>
                </div>
              </div>
              <p style={{ fontSize: '12px', lineHeight: 1.8, opacity: 0.6, marginBottom: '20px' }}>
                Serving Vadodara&apos;s 20+ lakh citizens with smart, transparent, and responsive municipal services.
              </p>
            </div>

            {/* Links Columns */}
            <div>
              <h3 style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--saffron2)',
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                marginBottom: '14px'
              }}>About</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <button
                    onClick={() => toggleModal('aboutVMC')}
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.15s',
                      display: 'block',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font)',
                      padding: 0,
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    About VMC
                  </button>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <button
                    onClick={() => toggleModal('departments')}
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.15s',
                      display: 'block',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font)',
                      padding: 0,
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    Departments
                  </button>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                    display: 'block'
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    History
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--saffron2)',
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                marginBottom: '14px'
              }}>Services</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                    display: 'block'
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    File Complaint
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                    display: 'block'
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    Track Complaint
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                    display: 'block'
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    Channels
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--saffron2)',
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                marginBottom: '14px'
              }}>Support</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="tel:+919876543210" style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                    display: 'block'
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    Contact
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                    display: 'block'
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    FAQ
                  </a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#" style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'color 0.15s',
                    display: 'block'
                  }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    Help
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <hr style={{ border: 'none', borderTop: '0.5px solid rgba(255,255,255,0.1)', margin: '0' }} />

          {/* Bottom */}
          <div style={{
            padding: '16px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <p style={{ fontSize: '11px', opacity: 0.45 }}>
              © 2024 Vadodara Municipal Corporation. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { name: 'Facebook', url: socialLinks.facebook, emoji: 'f' },
                { name: 'Twitter', url: socialLinks.twitter, emoji: '𝕏' },
                { name: 'Instagram', url: socialLinks.instagram, emoji: '📷' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 10px',
                    border: '0.5px solid rgba(255,255,255,0.15)',
                    borderRadius: '20px',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as any).style.background = 'var(--saffron)';
                    (e.currentTarget as any).style.borderColor = 'var(--saffron)';
                    (e.currentTarget as any).style.color = 'var(--navy)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as any).style.background = 'transparent';
                    (e.currentTarget as any).style.borderColor = 'rgba(255,255,255,0.15)';
                    (e.currentTarget as any).style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* About VMC Modal */}
      {modals.aboutVMC && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,34,64,0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => toggleModal('aboutVMC')}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              animation: 'modalIn 0.2s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => toggleModal('aboutVMC')}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: 'var(--text3)'
              }}
            >
              ×
            </button>

            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--navy)' }}>
              About Vadodara Municipal Corporation
            </h2>

            <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text)', space: '16px' }}>
              <p style={{ marginBottom: '16px' }}>
                <strong>Vadodara Municipal Corporation (VMC)</strong> is a civic body responsible for urban governance and development of Vadodara city, established in 1950. With a population of over 20 lakh residents across 76 wards, VMC is one of Gujarat&apos;s leading municipal corporations.
              </p>

              <h3 style={{ fontSize: '14px', fontWeight: 700, marginTop: '16px', marginBottom: '8px', color: 'var(--navy)' }}>
                Vision
              </h3>
              <p style={{ marginBottom: '16px' }}>
                To transform Vadodara into a smart city with focus on sustainable development, civic amenities, and citizen satisfaction.
              </p>

              <h3 style={{ fontSize: '14px', fontWeight: 700, marginTop: '16px', marginBottom: '8px', color: 'var(--navy)' }}>
                Key Initiatives
              </h3>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li style={{ marginBottom: '8px' }}>Smart City Mission implementation</li>
                <li style={{ marginBottom: '8px' }}>24×7 water supply under AMRUT 2.0</li>
                <li style={{ marginBottom: '8px' }}>12,000+ solar LED street lights</li>
                <li style={{ marginBottom: '8px' }}>700+ e-Services on eVadodara portal</li>
                <li style={{ marginBottom: '8px' }}>Ranked among top 10 cleanest cities in Gujarat</li>
                <li style={{ marginBottom: '8px' }}>Heritage conservation and restoration</li>
              </ul>

              <h3 style={{ fontSize: '14px', fontWeight: 700, marginTop: '16px', marginBottom: '8px', color: 'var(--navy)' }}>
                Contact
              </h3>
              <p>
                Email: <a href="mailto:info@vadodaravmc.com" style={{ color: 'var(--navy)' }}>info@vadodaravmc.com</a><br />
                Phone: 0265-2430000
              </p>
            </div>

            <style jsx>{`
              @keyframes modalIn {
                from {
                  opacity: 0;
                  transform: translateY(-12px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Departments Modal */}
      {modals.departments && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,34,64,0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => toggleModal('departments')}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              animation: 'modalIn 0.2s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => toggleModal('departments')}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: 'var(--text3)'
              }}
            >
              ×
            </button>

            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: 'var(--navy)' }}>
              VMC Departments
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { name: 'Engineering Department', desc: 'Roads, drainage, water supply', contact: '0265-2431234' },
                { name: 'Health Department', desc: 'Public health, sanitation, waste management', contact: '0265-2432345' },
                { name: 'Planning & Development', desc: 'Urban planning, building permits', contact: '0265-2433456' },
                { name: 'Finance Department', desc: 'Property tax, revenue collection', contact: '0265-2434567' },
                { name: 'Parks & Gardens', desc: 'Green spaces, public parks maintenance', contact: '0265-2435678' },
                { name: 'Social Welfare', desc: 'Community programs, citizen services', contact: '0265-2436789' }
              ].map((dept, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: 'var(--off)'
                  }}
                >
                  <h4 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px', color: 'var(--navy)' }}>
                    {dept.name}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '8px' }}>
                    {dept.desc}
                  </p>
                  <a href={`tel:${dept.contact.replace(/\D/g, '')}`} style={{
                    fontSize: '11px',
                    color: 'var(--navy)',
                    textDecoration: 'none',
                    fontWeight: 600
                  }}>
                    {dept.contact}
                  </a>
                </div>
              ))}
            </div>

            <style jsx>{`
              @keyframes modalIn {
                from {
                  opacity: 0;
                  transform: translateY(-12px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </>
  );
}
