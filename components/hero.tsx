export default function HeroSection({ onTabChange }: { onTabChange: (tab: string) => void }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg,var(--navy) 0%,var(--navy2) 60%,#1a3060 100%)',
      color: '#fff',
      borderRadius: '16px',
      padding: 'clamp(20px, 8vw, 36px) clamp(16px, 6vw, 32px)',
      marginBottom: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        background: 'rgba(232,130,26,0.08)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-60px',
        right: '60px',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        background: 'rgba(232,130,26,0.05)',
        pointerEvents: 'none'
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          opacity: 0.55,
          marginBottom: '8px',
          fontWeight: 500
        }}>Vadodara Municipal Corporation — Nagarpalika</div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(20px, 6vw, 30px)',
          lineHeight: 1.2,
          marginBottom: '10px'
        }}>Baroda — <span style={{ color: 'var(--saffron2)' }}>City of Culture</span> &amp; Progress</h1>

        <p style={{
          fontSize: 'clamp(12px, 3vw, 13px)',
          opacity: 0.75,
          lineHeight: 1.75,
          maxWidth: '520px',
          marginBottom: '24px'
        }}>Vadodara, Gujarat&apos;s third-largest and fastest-growing city, is a vibrant hub of heritage, industry, and civic excellence. VMC proudly serves over 20 lakh citizens across 76 wards, delivering smart, transparent, and responsive municipal services.</p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <button
            onClick={() => onTabChange('submit')}
            style={{
              padding: '11px 22px',
              borderRadius: 'var(--radius)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font)',
              transition: 'all 0.15s',
              border: 'none',
              background: 'var(--saffron)',
              color: 'var(--navy)',
              boxShadow: '0 2px 12px rgba(232,130,26,0.3)'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as any).style.background = 'var(--saffron2)';
              (e.currentTarget as any).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as any).style.background = 'var(--saffron)';
              (e.currentTarget as any).style.transform = 'translateY(0)';
            }}
          >
            Register a complaint
          </button>
          <button
            onClick={() => onTabChange('track')}
            style={{
              padding: '11px 22px',
              borderRadius: 'var(--radius)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font)',
              transition: 'all 0.15s',
              border: '1.5px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as any).style.background = 'rgba(255,255,255,0.18)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as any).style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            Track my complaint
          </button>
          <button
            style={{
              padding: '11px 22px',
              borderRadius: 'var(--radius)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font)',
              transition: 'all 0.15s',
              border: '1.5px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: '#fff'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as any).style.background = 'rgba(255,255,255,0.18)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as any).style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            All channels
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0,
          borderTop: '1px solid rgba(255,255,255,0.12)',
          paddingTop: '20px'
        }}>
          {[
            { value: '76', label: 'Wards' },
            { value: '20L+', label: 'Citizens served' },
            { value: '4,200+', label: 'VMC staff' },
            { value: '83%', label: 'Resolution rate' },
            { value: 'Smart City', label: 'Mission member' }
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                padding: '0 24px 0 0',
                marginRight: '24px',
                borderRight: idx < 4 ? '1px solid rgba(255,255,255,0.12)' : 'none'
              }}
            >
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--saffron2)' }}>{stat.value}</div>
              <div style={{ fontSize: '10px', opacity: 0.55, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
