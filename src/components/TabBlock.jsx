// Simple ASCII-based TAB renderer with colored modifiers + beat ruler.
// No external dependencies — fast, lightweight, and visually consistent.

export default function TabBlock({ tab, color = '#60a5fa', timeSig = '4/4', tempo, rhythm }) {
  const renderLine = (line) => line.split('').map((ch, i) => {
    if ('bhpr'.includes(ch)) return <span key={i} style={{ color }}>{ch}</span>
    if (ch === '~')          return <span key={i} style={{ color, fontWeight: 800 }}>{ch}</span>
    if ('/\\'.includes(ch))  return <span key={i} style={{ color }}>{ch}</span>
    return <span key={i}>{ch}</span>
  })

  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.3))',
      border: `1px solid ${color}30`,
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      {/* Header strip */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 18px',
        borderBottom: `1px solid ${color}20`,
        background: `${color}06`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 9, fontWeight: 800, color,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            padding: '3px 7px', borderRadius: 4,
            background: `${color}15`,
          }}>TAB</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            {timeSig}
          </span>
          {tempo && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              ♩ = {tempo}
            </span>
          )}
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-ultra)' }}>
          {tab.length} cordas
        </span>
      </div>

      {/* Beat ruler (if provided) */}
      {rhythm && (
        <div style={{
          padding: '10px 18px 4px',
          fontFamily: '"JetBrains Mono", "SF Mono", Menlo, monospace',
          fontSize: 11,
          lineHeight: 1.5,
          color: `${color}aa`,
          whiteSpace: 'pre',
          letterSpacing: '0.02em',
          opacity: 0.85,
          fontWeight: 700,
        }}>
          {rhythm}
        </div>
      )}

      {/* TAB content */}
      <div style={{ padding: rhythm ? '4px 18px 16px' : '14px 18px', overflowX: 'auto' }}>
        <pre style={{
          margin: 0,
          fontFamily: '"JetBrains Mono", "SF Mono", Menlo, monospace',
          fontSize: 13,
          lineHeight: 1.75,
          color: 'var(--text-base)',
          whiteSpace: 'pre',
          letterSpacing: '0.02em',
        }}>
          {tab.map((line, i) => <div key={i}>{renderLine(line)}</div>)}
        </pre>
      </div>
    </div>
  )
}
