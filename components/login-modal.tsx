'use client';

import { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  type: 'officer' | 'admin';
  onClose: () => void;
}

export default function LoginModal({ isOpen, type, onClose }: LoginModalProps) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loginType, setLoginType] = useState(type);

  const handleLogin = () => {
    // Demo credentials
    const validOfficer = loginType === 'officer' && id === 'VMC-OFF-042' && password === '1234';
    const validAdmin = loginType === 'admin' && id === 'VMC-ADM-001' && password === '1234';
    
    if (validOfficer || validAdmin) {
      // Create a session token
      const sessionToken = btoa(JSON.stringify({
        id: id,
        type: loginType,
        role: loginType === 'admin' ? 'admin' : 'officer',
        loginTime: new Date().toISOString(),
        expiresIn: 24 * 60 * 60 * 1000 // 24 hours
      }));
      
      // Store session in sessionStorage
      sessionStorage.setItem('vmc_session', sessionToken);
      sessionStorage.setItem('vmc_user_id', id);
      sessionStorage.setItem('vmc_user_type', loginType);
      
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  if (!isOpen) return null;

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '28px 24px',
          width: '100%',
          maxWidth: '360px',
          position: 'relative',
          animation: 'modalIn 0.2s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '14px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: 'var(--text3)',
            lineHeight: 1
          }}
        >
          ×
        </button>

        {/* Logo */}
        <div style={{
          width: '48px',
          height: '48px',
          background: 'var(--navy)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
          fontFamily: 'var(--font-display)',
          fontSize: '20px',
          color: 'var(--saffron)',
          fontWeight: 700
        }}>V</div>

        <h2 style={{
          textAlign: 'center',
          fontSize: '17px',
          fontWeight: 700,
          marginBottom: '4px'
        }}>VMC Staff Portal</h2>

        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text3)',
          marginBottom: '20px'
        }}>Login with your VMC-issued credentials</p>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '18px',
          background: 'var(--off2)',
          padding: '4px',
          borderRadius: 'var(--radius)'
        }}>
          {['officer', 'admin'].map((tab) => (
            <button
              key={tab}
              onClick={() => setLoginType(tab as 'officer' | 'admin')}
              style={{
                flex: 1,
                padding: '7px',
                textAlign: 'center',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                color: loginType === tab ? 'var(--navy)' : 'var(--text2)',
                background: loginType === tab ? '#fff' : 'transparent',
                boxShadow: loginType === tab ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
                border: 'none',
                fontFamily: 'var(--font)'
              }}
            >
              {tab === 'officer' ? 'Officer' : 'Admin / Commissioner'}
            </button>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: 'var(--red-bg)',
            color: 'var(--red)',
            padding: '8px 12px',
            borderRadius: 'var(--radius)',
            fontSize: '12px',
            marginBottom: '10px'
          }}>Invalid credentials. Please try again.</div>
        )}

        {/* Form fields */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text2)',
            marginBottom: '4px',
            display: 'block',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {loginType === 'officer' ? 'Officer ID' : 'Admin ID'}
          </label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder={loginType === 'officer' ? 'VMC-OFF-042' : 'VMC-ADM-001'}
            style={{
              width: '100%',
              padding: '9px 12px',
              border: '1.5px solid var(--border2)',
              borderRadius: 'var(--radius)',
              fontSize: '14px',
              fontFamily: 'var(--font)',
              color: 'var(--text)',
              transition: 'border-color 0.15s',
              background: '#fff',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              (e.currentTarget as any).style.borderColor = 'var(--navy)';
            }}
            onBlur={(e) => {
              (e.currentTarget as any).style.borderColor = 'var(--border2)';
            }}
          />
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text2)',
            marginBottom: '4px',
            display: 'block',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '9px 12px',
              border: '1.5px solid var(--border2)',
              borderRadius: 'var(--radius)',
              fontSize: '14px',
              fontFamily: 'var(--font)',
              color: 'var(--text)',
              transition: 'border-color 0.15s',
              background: '#fff',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              (e.currentTarget as any).style.borderColor = 'var(--navy)';
            }}
            onBlur={(e) => {
              (e.currentTarget as any).style.borderColor = 'var(--border2)';
            }}
          />
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '11px',
            border: 'none',
            borderRadius: 'var(--radius)',
            background: 'var(--navy)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 700,
            fontFamily: 'var(--font)',
            cursor: 'pointer',
            marginTop: '4px',
            transition: 'background 0.15s'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as any).style.background = 'var(--navy2)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as any).style.background = 'var(--navy)';
          }}
        >
          Login ���
        </button>

        <div style={{
          fontSize: '11px',
          color: 'var(--text3)',
          textAlign: 'center',
          marginTop: '10px'
        }}>Demo — Officer: VMC-OFF-042 / 1234</div>
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
  );
}
