import { useState } from 'react'
import guitarDB from '@tombatossals/chords-db/lib/guitar.json'

// ─── Root / suffix mapping ────────────────────────────────────────────────────

const ROOT_MAP = {
  C: 'C', 'C#': 'Csharp', D: 'D', Eb: 'Eb', E: 'E',
  F: 'F', 'F#': 'Fsharp', G: 'G', Ab: 'Ab', A: 'A', Bb: 'Bb', B: 'B',
}

// Our internal chord keys → chords-db suffixes
const SUFFIX_MAP = {
  maj: 'major', min: 'minor', dim: 'dim', aug: 'aug',
  maj7: 'maj7', '7': '7', min7: 'm7', m7b5: 'm7b5',
  dim7: 'dim7', '9': '9', maj9: 'maj9', min9: 'm9',
  sus2: 'sus2', sus4: 'sus4', add9: 'add9',
  '7sus4': '7sus4', '7b9': '7b9', '7#9': '7#9',
  maj13: 'maj13', min11: 'm11', '13': '13',
}

function lookupPositions(root, chordKey) {
  const dbKey = ROOT_MAP[root]
  const suffix = SUFFIX_MAP[chordKey]
  if (!dbKey || !suffix) return []
  const chord = (guitarDB.chords[dbKey] ?? []).find(c => c.suffix === suffix)
  return chord ? chord.positions.slice(0, 4) : []
}

// ─── SVG layout constants ─────────────────────────────────────────────────────

const VW = 140   // viewBox width (extra room on the left for "Xfr" indicator)
const VH = 160   // viewBox height
const STRINGS = 6
const FRETS_SHOWN = 4
const STR_X0 = 28     // x of first string (E6) — shifted right to leave room for fret label
const STR_XN = 128    // x of last string (e1)
const STR_GAP = (STR_XN - STR_X0) / (STRINGS - 1)  // 20px between strings
const GRID_TOP = 34   // y where the nut / top fret line sits
const FRET_GAP = 27   // height of each fret row
const DOT_R = 8       // fret dot radius

const strX = (s) => STR_X0 + s * STR_GAP
const fretLineY = (f) => GRID_TOP + f * FRET_GAP
const fretCenterY = (f) => GRID_TOP + (f - 0.5) * FRET_GAP   // center of fret cell (f=1..4)

// ─── Single SVG diagram ───────────────────────────────────────────────────────

function ChordSVG({ pos, accentColor, width, height }) {
  if (!pos) return null
  const { frets, fingers, baseFret, barres = [] } = pos
  const isOpenChord = baseFret === 1
  const barreSet = new Set(barres)

  const C_GRID    = '#2d3748'
  const C_NUT     = '#e2e8f0'
  const C_DOT     = accentColor
  const C_OPEN    = '#94a3b8'
  const C_MUTED   = '#64748b'
  const C_LABEL   = '#0f172a'
  const C_FRETNUM = '#9ca3af'

  return (
    <svg
      width={width} height={height}
      viewBox={`0 0 ${VW} ${VH}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* String lines */}
      {Array.from({ length: STRINGS }, (_, s) => (
        <line key={`s${s}`}
          x1={strX(s)} y1={fretLineY(0)}
          x2={strX(s)} y2={fretLineY(FRETS_SHOWN)}
          stroke={C_GRID} strokeWidth={0.9} />
      ))}

      {/* Fret lines */}
      {Array.from({ length: FRETS_SHOWN + 1 }, (_, f) => (
        <line key={`f${f}`}
          x1={STR_X0} y1={fretLineY(f)}
          x2={STR_XN} y2={fretLineY(f)}
          stroke={C_GRID} strokeWidth={0.9} />
      ))}

      {/* Nut (thick bar at top for open-position chords) */}
      {isOpenChord && (
        <rect
          x={STR_X0 - 1} y={fretLineY(0) - 4.5}
          width={STR_XN - STR_X0 + 2} height={4.5}
          fill={C_NUT} rx={1.5} />
      )}

      {/* Barre bars */}
      {barres.map((barFret) => {
        const on = frets.map((f, s) => ({ f, s })).filter(({ f }) => f === barFret)
        if (on.length < 2) return null
        const s1 = on[0].s, s2 = on[on.length - 1].s
        const cy = fretCenterY(barFret)
        const finger = fingers[s1] || 1
        return (
          <g key={`barre${barFret}`}>
            <rect
              x={strX(s1) - DOT_R} y={cy - DOT_R}
              width={strX(s2) - strX(s1) + DOT_R * 2} height={DOT_R * 2}
              fill={C_DOT} rx={DOT_R} />
            <text
              x={strX(s1) + (strX(s2) - strX(s1)) / 2} y={cy + 3.5}
              textAnchor="middle" fill={C_LABEL}
              fontSize="7.5" fontWeight="800">
              {finger}
            </text>
          </g>
        )
      })}

      {/* Per-string indicators */}
      {frets.map((fret, s) => {
        const cx = strX(s)
        if (fret === -1) {
          // Muted
          return (
            <text key={`x${s}`}
              x={cx} y={GRID_TOP - 11}
              textAnchor="middle" fill={C_MUTED}
              fontSize="11" fontWeight="800">×</text>
          )
        }
        if (fret === 0) {
          // Open string
          return (
            <circle key={`o${s}`}
              cx={cx} cy={GRID_TOP - 11}
              r={4} fill="none" stroke={C_OPEN} strokeWidth={1.3} />
          )
        }
        // Covered by barre → skip individual dot
        if (barreSet.has(fret)) return null

        const cy = fretCenterY(fret)
        const finger = fingers[s]
        return (
          <g key={`d${s}`}>
            <circle cx={cx} cy={cy} r={DOT_R} fill={C_DOT} />
            {finger > 0 && (
              <text x={cx} y={cy + 3.5}
                textAnchor="middle" fill={C_LABEL}
                fontSize="7.5" fontWeight="800">
                {finger}
              </text>
            )}
          </g>
        )
      })}

      {/* Fret position label (for non-open chords) — placed on left, prominent */}
      {!isOpenChord && (
        <g>
          {/* Background pill so the label is always visible */}
          <rect
            x={STR_X0 - 26} y={fretCenterY(1) - 8}
            width={22} height={16} rx={3}
            fill={`${accentColor}1f`}
            stroke={`${accentColor}66`} strokeWidth={0.7}
          />
          <text
            x={STR_X0 - 15} y={fretCenterY(1) + 3.5}
            textAnchor="middle"
            fill={accentColor}
            fontSize="9.5" fontWeight="800"
            style={{ letterSpacing: '0.02em' }}
          >
            {baseFret}fr
          </text>
        </g>
      )}

      {/* Hidden duplicate (kept for reference, never rendered) */}
      {false && !isOpenChord && (
        <text
          x={STR_XN + 9} y={fretCenterY(1) + 3}
          fill={C_FRETNUM} fontSize="9" fontWeight="600">
          {baseFret}fr
        </text>
      )}
    </svg>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────

export default function GuitarChordDiagram({
  root,
  chordKey,
  accentColor = '#3b82f6',
  width = 124,
  height = 160,
}) {
  const [posIdx, setPosIdx] = useState(0)
  const positions = lookupPositions(root, chordKey)

  // Reset index when chord changes (keep within bounds)
  const idx = Math.min(posIdx, Math.max(0, positions.length - 1))

  if (!positions.length) {
    return (
      <div
        style={{ width, height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}
      >
        <div style={{ fontSize: 20, color: '#374151' }}>—</div>
        <div style={{ fontSize: 10, color: '#6b7280', textAlign: 'center' }}>sem diagrama</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <ChordSVG pos={positions[idx]} accentColor={accentColor} width={width} height={height} />

      {/* Position selector dots */}
      {positions.length > 1 && (
        <div style={{ display: 'flex', gap: 5 }}>
          {positions.map((_, i) => (
            <button
              key={i}
              onClick={() => setPosIdx(i)}
              title={`Posição ${i + 1}`}
              style={{
                width: 7, height: 7, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
                background: i === idx ? accentColor : 'rgba(255,255,255,0.2)',
                transition: 'background 0.15s',
              }} />
          ))}
        </div>
      )}
    </div>
  )
}
