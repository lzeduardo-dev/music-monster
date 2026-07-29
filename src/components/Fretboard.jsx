import { useMemo, useState } from 'react'
import { noteIndex, noteName } from '../lib/theory.js'
import { playNote } from '../lib/audio.js'

// Standard tuning, low to high. We display high to low so it visually matches a real guitar.
const STANDARD_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']
const STRING_LABELS = ['E', 'A', 'D', 'G', 'B', 'E']

const PITCH_ORDER = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
function pitchAtFret(openPitch, fret) {
  const m = openPitch.match(/^([A-G]#?)(-?\d+)$/)
  const idx = PITCH_ORDER.indexOf(m[1])
  const oct = parseInt(m[2], 10)
  const total = oct * 12 + idx + fret
  return `${PITCH_ORDER[((total % 12) + 12) % 12]}${Math.floor(total / 12)}`
}

const FRET_MARKERS = [3, 5, 7, 9, 15, 17, 19, 21]
const DOUBLE_MARKERS = [12, 24]

/**
 * Props:
 * - frets: number of frets to render (default 15)
 * - highlightedNotes: array of semitone indexes to color (e.g. scale notes)
 * - rootNote: name like "C" — colored differently
 * - userMarks: { [stringIdx_fret]: { color } }  — controlled marks
 * - onToggleMark: (stringIdx, fret) => void
 * - markColor: current selected color when clicking
 * - interactive: boolean (clicking plays the note)
 */
export default function Fretboard({
  frets = 15,
  highlightedNotes = [],
  rootNote = null,
  userMarks = {},
  onToggleMark = null,
  markColor = '#60a5fa',
  interactive = true,
  showNoteNames = true,
  tuning = STANDARD_TUNING,
  useFlats = false,
  characteristicNote = null,        // semitone index (0-11) — highlighted with characteristicColor
  characteristicColor = '#f59e0b',
}) {
  const stringsTopDown = useMemo(() => [...tuning].reverse(), [tuning])
  const labelsTopDown = useMemo(() => [...STRING_LABELS].reverse(), [tuning])

  const rootIdx = rootNote != null ? noteIndex(rootNote) : null
  const highlightSet = useMemo(() => new Set(highlightedNotes), [highlightedNotes])

  const [hover, setHover] = useState(null)

  const handleClick = async (sIdx, fret, pitch, semitoneIdx) => {
    if (onToggleMark) onToggleMark(sIdx, fret)
    if (interactive) {
      try { await playNote(pitch, 0.6) } catch {}
    }
  }

  return (
    <div className="card p-4 md:p-5 overflow-x-auto">
      <div className="min-w-[820px]">
        {/* Fret numbers */}
        <div className="flex pl-10 select-none">
          {Array.from({ length: frets + 1 }).map((_, f) => (
            <div key={f} className="flex-1 text-center text-[10px] text-white/40 font-semibold">
              {f}
            </div>
          ))}
        </div>

        {/* Strings */}
        <div className="mt-1.5 rounded-xl border border-white/5 bg-gradient-to-b from-[#1a1408] to-[#0f0a04] p-2 shadow-inner">
          {stringsTopDown.map((openPitch, rowIdx) => {
            const sIdx = stringsTopDown.length - 1 - rowIdx // logical string index (low E = 0)
            return (
              <div key={rowIdx} className="flex items-stretch">
                {/* String label */}
                <div className="w-10 grid place-items-center text-xs font-bold text-white/60">
                  {labelsTopDown[rowIdx]}
                </div>

                {Array.from({ length: frets + 1 }).map((_, f) => {
                  const pitch = pitchAtFret(openPitch, f)
                  const semitoneIdx = noteIndex(pitch.replace(/[0-9]+$/, ''))
                  const isRoot = rootIdx != null && semitoneIdx === rootIdx
                  const isInScale = highlightSet.has(semitoneIdx)
                  const markKey = `${sIdx}_${f}`
                  const userMark = userMarks[markKey]
                  const showDouble = DOUBLE_MARKERS.includes(f)
                  const showSingle = FRET_MARKERS.includes(f)
                  const isHover = hover === markKey

                  let bg = 'transparent'
                  let label = ''
                  let textColor = 'rgba(255,255,255,0.85)'
                  let ring = 'transparent'

                  const isCharacteristic = characteristicNote != null && semitoneIdx === characteristicNote

                  if (userMark) {
                    bg = userMark.color
                    label = showNoteNames ? noteName(semitoneIdx, useFlats) : ''
                    textColor = '#0b1220'
                    ring = 'rgba(255,255,255,0.45)'
                  } else if (isRoot) {
                    bg = '#2563eb'
                    label = noteName(semitoneIdx, useFlats)
                    textColor = '#ffffff'
                  } else if (isCharacteristic) {
                    bg = characteristicColor
                    label = noteName(semitoneIdx, useFlats)
                    textColor = '#1a1a1a'
                    ring = `${characteristicColor}80`
                  } else if (isInScale) {
                    bg = '#e2e8f0'
                    label = showNoteNames ? noteName(semitoneIdx, useFlats) : ''
                    textColor = '#1e293b'
                  }

                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => handleClick(sIdx, f, pitch, semitoneIdx)}
                      onMouseEnter={() => setHover(markKey)}
                      onMouseLeave={() => setHover(null)}
                      className="fret-cell flex-1 relative h-10 md:h-11"
                      style={{
                        borderRight: f === 0 ? '3px solid #c9a96a' : '1px solid rgba(255,255,255,0.08)',
                        background: f === 0 ? 'rgba(201,169,106,0.08)' : 'transparent'
                      }}
                      aria-label={`Corda ${labelsTopDown[rowIdx]}, casa ${f}, nota ${noteName(semitoneIdx, useFlats)}`}
                    >
                      {/* String line */}
                      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-white/40 via-white/25 to-white/40" />

                      {/* Fret marker dots (between strings, draw on middle row) */}
                      {rowIdx === 2 && showSingle && (
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-2 h-2 rounded-full bg-white/15" />
                      )}
                      {rowIdx === 2 && showDouble && (
                        <>
                          <div className="absolute left-[35%] -bottom-2 w-2 h-2 rounded-full bg-white/20" />
                          <div className="absolute left-[55%] -bottom-2 w-2 h-2 rounded-full bg-white/20" />
                        </>
                      )}

                      {/* Note dot */}
                      {(bg !== 'transparent' || isHover) && (
                        <div
                          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 rounded-full grid place-items-center text-[10px] md:text-xs font-bold ${isHover ? 'note-pulse' : ''}`}
                          style={{
                            background: bg !== 'transparent' ? bg : 'rgba(255,255,255,0.05)',
                            color: textColor,
                            boxShadow: ring !== 'transparent' ? `0 0 0 2px ${ring}` : 'none',
                            border: bg === 'transparent' ? '1px dashed rgba(255,255,255,0.25)' : 'none'
                          }}
                        >
                          {label || (isHover ? noteName(semitoneIdx, useFlats) : '')}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
