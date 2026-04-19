'use client';

import { useState } from 'react';
import LoginModal from './login-modal';

export default function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState<'officer' | 'admin'>('officer');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Topbar */}
      <div style={{ background: 'var(--navy)', position: 'sticky', top: 0, zIndex: 200, borderBottom: '3px solid var(--saffron)' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px', height: '60px', minHeight: '60px' }}>
          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: '38px',
              height: '38px',
              background: 'var(--saffron)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              color: 'var(--navy)',
              fontWeight: 700,
              flexShrink: 0
            }}>V</div>
            <div style={{ color: '#fff', display: 'none', minWidth: 0 }} className="navbar-text">
              <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.2, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>Vadodara Municipal</div>
              <div style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '0.05em', fontWeight: 400, whiteSpace: 'nowrap' }}>EST. 1950</div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div style={{ display: 'none', alignItems: 'center', gap: '2px', marginLeft: 'auto' }} className="navbar-nav">
            <button
              style={{
                padding: '6px 13px',
                borderRadius: 'var(--radius)',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                fontFamily: 'var(--font)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as any).style.background = 'rgba(255,255,255,0.15)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as any).style.background = 'transparent';
              }}
            >
              Home
            </button>
            <button
              style={{
                padding: '6px 13px',
                borderRadius: 'var(--radius)',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                fontFamily: 'var(--font)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as any).style.background = 'rgba(255,255,255,0.15)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as any).style.background = 'transparent';
              }}
            >
              Channels
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'none'
            }}
            className="mobile-menu-btn"
          >
            ☰
          </button>

          {/* Desktop Login Buttons */}
          <div style={{ display: 'none', gap: '8px' }} className="navbar-buttons">
            <button
              onClick={() => { setLoginType('officer'); setLoginOpen(true); }}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius)',
                border: '1.5px solid rgba(232,130,26,0.6)',
                background: 'rgba(232,130,26,0.12)',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font)',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as any).style.background = 'var(--saffron)';
                (e.currentTarget as any).style.borderColor = 'var(--saffron)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as any).style.background = 'rgba(232,130,26,0.12)';
                (e.currentTarget as any).style.borderColor = 'rgba(232,130,26,0.6)';
              }}
            >
              Officer login
            </button>

            <button
              onClick={() => { setLoginType('admin'); setLoginOpen(true); }}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--radius)',
                border: '1.5px solid rgba(232,130,26,0.6)',
                background: 'rgba(232,130,26,0.12)',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font)',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as any).style.background = 'var(--saffron)';
                (e.currentTarget as any).style.borderColor = 'var(--saffron)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as any).style.background = 'rgba(232,130,26,0.12)';
                (e.currentTarget as any).style.borderColor = 'rgba(232,130,26,0.6)';
              }}
            >
              Admin login
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            background: 'var(--navy2)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '12px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <button
              onClick={() => { setLoginType('officer'); setLoginOpen(true); setMobileMenuOpen(false); }}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 'var(--radius)',
                border: '1.5px solid rgba(232,130,26,0.6)',
                background: 'rgba(232,130,26,0.12)',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font)',
                transition: 'all 0.15s',
                textAlign: 'left'
              }}
            >
              Officer login
            </button>
            <button
              onClick={() => { setLoginType('admin'); setLoginOpen(true); setMobileMenuOpen(false); }}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 'var(--radius)',
                border: '1.5px solid rgba(232,130,26,0.6)',
                background: 'rgba(232,130,26,0.12)',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font)',
                transition: 'all 0.15s',
                textAlign: 'left'
              }}
            >
              Admin login
            </button>
          </div>
        )}
      </div>

      {/* Styles for responsive design */}
      <style jsx>{`
        @media (min-width: 768px) {
          :global(.navbar-nav) {
            display: flex !important;
          }
          :global(.navbar-buttons) {
            display: flex !important;
          }
          :global(.navbar-text) {
            display: block !important;
          }
          :global(.mobile-menu-btn) {
            display: none !important;
          }
        }

        @media (max-width: 767px) {
          :global(.navbar-text) {
            display: none !important;
          }
          :global(.mobile-menu-btn) {
            display: block !important;
          }
        }
      `}</style>

      <LoginModal isOpen={loginOpen} type={loginType} onClose={() => setLoginOpen(false)} />
    </>
  );
}
