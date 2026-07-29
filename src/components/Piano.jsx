import { useMemo, useState } from 'react'
import { noteIndex, noteName } from '../lib/theory.js'
import { playNote } from '../lib/audio.js'

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const BLACK_AFTER = { C: 'C#', D: 'D#', F: 'F#', G: 'G#', A: 'A#' }

/**
 * Props:
 * - octaves: number of octaves (default 2)
 * - startOctave: starting octave (default 4)
 * - highlightedNotes: semitone indexes to highlight
 * - rootNote: name to color as root
 * - showNoteNames: render labels on highlighted keys
 */
export default function Piano({
  octaves = 2,
  startOctave = 4,
  highlightedNotes = [],
  rootNote = null,
  showNoteNames = true
}) {
  const rootIdx = rootNote != null ? noteIndex(rootNote) : null
  const highlightSet = useMemo(() => new Set(highlightedNotes), [highlightedNotes])
  const [active, setActive] = useState(null)

  const keys = []
  for (let o = 0; o < octaves; o++) {
    WHITE_KEYS.forEach((wk) => {
      keys.push({ note: wk, octave: startOctave + o, type: 'white' })
      const black = BLACK_AFTER[wk]
      if (black) keys.push({ note: black, octave: startOctave + o, type: 'black' })
    })
  }

  const handlePlay = async (k) => {
    const pitch = `${k.note}${k.octave}`
    setActive(pitch)
    try { await playNote(pitch, 0.7) } catch {}
    setTimeout(() => setActive(null), 250)
  }

  // Compute white key positions, then place black keys absolutely on top.
  const whites = keys.filter((k) => k.type === 'white')
  const blacks = keys.filter((k) => k.type === 'black')
  const whiteWidth = 100 / whites.length

  return (
    <div className="card p-4">
      <div className="relative w-full" style={{ aspectRatio: `${whites.length * 0.9} / 4` }}>
        {/* White keys */}
        <div className="absolute inset-0 flex">
          {whites.map((k, i) => {
            const idx = noteIndex(k.note)
            const isRoot = rootIdx === idx
            const isHi = highlightSet.has(idx)
            const isActive = active === `${k.note}${k.octave}`
            return (
              <button
                key={`w${i}`}
                onClick={() => handlePlay(k)}
                className="flex-1 relative border border-white/10 first:rounded-l-md last:rounded-r-md transition"
                style={{
                  background: isRoot
                    ? 'linear-gradient(180deg, #fce7f3, #f472b6)'
                    : isHi
                    ? 'linear-gradient(180deg, #ede9fe, #a78bfa)'
                    : 'linear-gradient(180deg, #f8fafc, #cbd5e1)',
                  boxShadow: isActive ? 'inset 0 -8px 14px rgba(0,0,0,0.18)' : 'inset 0 -4px 8px rgba(0,0,0,0.08)'
                }}
                aria-label={`${k.note}${k.octave}`}
              >
                {(isHi || isRoot) && showNoteNames && (
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-bold text-ink-900">
                    {k.note}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Black keys */}
        <div className="absolute inset-0 pointer-events-none">
          {blacks.map((k, i) => {
            const idx = noteIndex(k.note)
            const isRoot = rootIdx === idx
            const isHi = highlightSet.has(idx)
            const isActive = active === `${k.note}${k.octave}`

            // Determine which white key this sits between
            const whiteIndex = whites.findIndex(
              (w) => w.octave === k.octave && w.note === k.note.replace('#', '')
            )
            const left = (whiteIndex + 1) * whiteWidth - whiteWidth * 0.32

            return (
              <button
                key={`b${i}`}
                onClick={() => handlePlay(k)}
                className="absolute top-0 rounded-b-md pointer-events-auto transition"
                style={{
                  left: `${left}%`,
                  width: `${whiteWidth * 0.64}%`,
                  height: '62%',
                  background: isRoot
                    ? 'linear-gradient(180deg, #f472b6, #9d174d)'
                    : isHi
                    ? 'linear-gradient(180deg, #a78bfa, #5b21b6)'
                    : 'linear-gradient(180deg, #1f2937, #0b1220)',
                  border: '1px solid rgba(0,0,0,0.5)',
                  boxShadow: isActive
                    ? 'inset 0 -6px 12px rgba(0,0,0,0.5)'
                    : '0 4px 8px rgba(0,0,0,0.45), inset 0 -4px 6px rgba(0,0,0,0.4)'
                }}
                aria-label={`${k.note}${k.octave}`}
              >
                {(isHi || isRoot) && showNoteNames && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/95">
                    {k.note}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
