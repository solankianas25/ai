export default function Footer() {
  return (
    <footer style={{
      background: 'var(--navy)',
      color: 'rgba(255,255,255,0.8)',
      marginTop: '48px',
      padding: '40px 0 16px'
    }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
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
              Serving Vadodara's 20+ lakh citizens with smart, transparent, and responsive municipal services.
            </p>
          </div>

          {/* Links Columns */}
          {[
            {
              title: 'About',
              links: ['About VMC', 'Departments', 'History']
            },
            {
              title: 'Services',
              links: ['File Complaint', 'Track Complaint', 'Channels']
            },
            {
              title: 'Support',
              links: ['Contact', 'FAQ', 'Help']
            }
          ].map((col, idx) => (
            <div key={idx}>
              <h3 style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--saffron2)',
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                marginBottom: '14px'
              }}>{col.title}</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {col.links.map((link, lidx) => (
                  <li key={lidx} style={{ marginBottom: '8px' }}>
                    <a href="#" style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.15s',
                      display: 'block'
                    }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
          gap: '8px'
        }}>
          <p style={{ fontSize: '11px', opacity: 0.45 }}>
            © 2024 Vadodara Municipal Corporation. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Facebook', 'Twitter', 'Instagram'].map((social) => (
              <a
                key={social}
                href="#"
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
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
