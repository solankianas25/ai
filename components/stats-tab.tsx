export default function StatsTab() {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px', marginBottom: '16px' }}>
        {[
          { label: 'Total 2024', value: '1,248' },
          { label: 'Resolved', value: '1,041', color: 'var(--green)' },
          { label: 'Resolution rate', value: '83%', color: 'var(--green)' },
          { label: 'Avg resolution', value: '28h' }
        ].map((stat, idx) => (
          <div key={idx} style={{ background: 'var(--off)', borderRadius: 'var(--radius)', padding: '12px 14px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text2)', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '21px', fontWeight: 700, color: stat.color || 'var(--text)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="two" style={{ gap: '14px' }}>
        <div style={{
          background: '#fff',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text3)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>By category</div>

          {[
            { label: 'Roads & Potholes', count: 245 },
            { label: 'Water Supply', count: 182 },
            { label: 'Drainage & Sewage', count: 156 },
            { label: 'Garbage Collection', count: 128 }
          ].map((item, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ minWidth: '120px', fontSize: '11px', color: 'var(--text2)' }}>{item.label}</div>
                <div style={{ flex: 1, height: '12px', background: 'var(--off2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    borderRadius: '4px',
                    background: 'var(--blue)',
                    width: `${(item.count / 250) * 100}%`
                  }} />
                </div>
                <div style={{ minWidth: '24px', textAlign: 'right', fontSize: '11px', color: 'var(--text3)' }}>{item.count}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: '#fff',
          border: '0.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--text3)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>By ward</div>

          {[
            { label: 'Ward 1 — Sayajigunj', count: 156 },
            { label: 'Ward 2 — Alkapuri', count: 124 },
            { label: 'Ward 3 — Fatehgunj', count: 98 },
            { label: 'Ward 4 — Karelibaug', count: 87 }
          ].map((item, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ minWidth: '120px', fontSize: '11px', color: 'var(--text2)' }}>{item.label}</div>
                <div style={{ flex: 1, height: '12px', background: 'var(--off2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    borderRadius: '4px',
                    background: 'var(--green)',
                    width: `${(item.count / 160) * 100}%`
                  }} />
                </div>
                <div style={{ minWidth: '24px', textAlign: 'right', fontSize: '11px', color: 'var(--text3)' }}>{item.count}</div>
              </div>
            </div>
          ))}
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
