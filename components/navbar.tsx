'use client';

import { useState } from 'react';
import LoginModal from './login-modal';

export default function Navbar() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginType, setLoginType] = useState('officer');
  const [activePage, setActivePage] = useState('home');

  return (
    <>
      {/* Topbar */}
      <div style={{ background: 'var(--navy)', position: 'sticky', top: 0, zIndex: 200, borderBottom: '3px solid var(--saffron)' }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px', height: '60px' }}>
          {/* Logo */}
          <a href="#" onClick={() => setActivePage('home')} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
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
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.2 }}>Vadodara Municipal Corporation</div>
              <div style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '0.05em', fontWeight: 400 }}>GOVERNMENT OF GUJARAT · ESTABLISHED 1950</div>
            </div>
          </a>

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: 'auto' }}>
            <button
              onClick={() => setActivePage('home')}
              style={{
                padding: '6px 13px',
                borderRadius: 'var(--radius)',
                color: activePage === 'home' ? '#fff' : 'rgba(255,255,255,0.75)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: activePage === 'home' ? 'rgba(255,255,255,0.15)' : 'transparent',
                fontFamily: 'var(--font)',
                transition: 'all 0.15s',
              }}
            >
              Home
            </button>
            <button
              onClick={() => setActivePage('channels')}
              style={{
                padding: '6px 13px',
                borderRadius: 'var(--radius)',
                color: activePage === 'channels' ? '#fff' : 'rgba(255,255,255,0.75)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: activePage === 'channels' ? 'rgba(255,255,255,0.15)' : 'transparent',
                fontFamily: 'var(--font)',
                transition: 'all 0.15s',
              }}
            >
              Channels
            </button>
            <button
              onClick={() => setActivePage('ivr')}
              style={{
                padding: '6px 13px',
                borderRadius: 'var(--radius)',
                color: activePage === 'ivr' ? '#fff' : 'rgba(255,255,255,0.75)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: activePage === 'ivr' ? 'rgba(255,255,255,0.15)' : 'transparent',
                fontFamily: 'var(--font)',
                transition: 'all 0.15s',
              }}
            >
              IVR
            </button>

            {/* Login Buttons */}
            <button
              onClick={() => { setLoginType('officer'); setLoginOpen(true); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
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
                marginLeft: '6px'
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
              <span>👤</span>
              Officer login
            </button>

            <button
              onClick={() => { setLoginType('admin'); setLoginOpen(true); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
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
                marginLeft: '2px'
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
              <span>🔐</span>
              Admin login
            </button>
          </div>
        </div>
      </div>

      <LoginModal isOpen={loginOpen} type={loginType} onClose={() => setLoginOpen(false)} />
    </>
  );
}
