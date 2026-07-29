import { useMemo, useState } from 'react'
import { PageHeader, Section, TheoryBlock, Step, Pill } from '../components/Common.jsx'
import Fretboard from '../components/Fretboard.jsx'
import { buildScale, indexesToNames, scaleWithOctaves } from '../lib/theory.js'
import { playSequence } from '../lib/audio.js'
import { useProgress } from '../context/ProgressContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

import LessonFooter from '../components/LessonFooter.jsx'

// Theme-aware "ink" colour. Returns white-w/alpha in dark mode, dark-w/alpha in light mode.
const useInk = () => {
  const { isDark } = useTheme()
  return (alpha) => isDark ? `rgba(255,255,255,${alpha})` : `rgba(15,23,42,${alpha})`
}
const CIRCLE_KEYS = [
  { key: 'C',  label: 'C',  sharps: 0, flats: 0, acc: [],                                    rel: 'Lám', newAcc: null,        idx: 0 },
  { key: 'G',  label: 'G',  sharps: 1, flats: 0, acc: ['F#'],                                 rel: 'Mim', newAcc: 'F#',        idx: 1 },
  { key: 'D',  label: 'D',  sharps: 2, flats: 0, acc: ['F#','C#'],                            rel: 'Sim', newAcc: 'C#',        idx: 2 },
  { key: 'A',  label: 'A',  sharps: 3, flats: 0, acc: ['F#','C#','G#'],                       rel: 'F#m', newAcc: 'G#',        idx: 3 },
  { key: 'E',  label: 'E',  sharps: 4, flats: 0, acc: ['F#','C#','G#','D#'],                  rel: 'C#m', newAcc: 'D#',        idx: 4 },
  { key: 'B',  label: 'B',  sharps: 5, flats: 0, acc: ['F#','C#','G#','D#','A#'],             rel: 'G#m', newAcc: 'A#',        idx: 5 },
  { key: 'F#', label: 'F#', sharps: 6, flats: 0, acc: ['F#','C#','G#','D#','A#','E#'],        rel: 'D#m', newAcc: 'E#',        idx: 6 },
  { key: 'Db', label: 'Db', sharps: 0, flats: 5, acc: ['Bb','Eb','Ab','Db','Gb'],             rel: 'Bbm', newAcc: 'Gb',        idx: 7 },
  { key: 'Ab', label: 'Ab', sharps: 0, flats: 4, acc: ['Bb','Eb','Ab','Db'],                  rel: 'Fám', newAcc: 'Db',        idx: 8 },
  { key: 'Eb', label: 'Eb', sharps: 0, flats: 3, acc: ['Bb','Eb','Ab'],                       rel: 'Dóm', newAcc: 'Ab',        idx: 9 },
  { key: 'Bb', label: 'Bb', sharps: 0, flats: 2, acc: ['Bb','Eb'],                            rel: 'Solm',newAcc: 'Eb',        idx: 10 },
  { key: 'F',  label: 'F',  sharps: 0, flats: 1, acc: ['Bb'],                                 rel: 'Rém', newAcc: 'Bb',        idx: 11 },
]

const FLAT_KEYS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'])
const CX = 150, CY = 150
const OUTER_R = 108
const INNER_R = 73

function keyPos(idx) {
  const a = ((-90 + idx * 30) * Math.PI) / 180
  return { x: CX + OUTER_R * Math.cos(a), y: CY + OUTER_R * Math.sin(a) }
}
function relPos(idx) {
  const a = ((-90 + idx * 30) * Math.PI) / 180
  return { x: CX + INNER_R * Math.cos(a), y: CY + INNER_R * Math.sin(a) }
}

function AccidentalChip({ label, isNew }) {
  return (
    <span
      className="px-2 py-0.5 rounded-md text-xs font-bold"
      style={{
        background: isNew ? 'rgba(251,113,133,0.18)' : 'rgba(99,102,241,0.14)',
        color: isNew ? '#f472b6' : '#a78bfa',
        border: `1px solid ${isNew ? '#f472b640' : '#a78bfa30'}`,
      }}
    >
      {label}
    </span>
  )
}

export default function CicloQuintas() {
  const ink = useInk()
  const [selectedKey, setSelectedKey] = useState('C')
  const [hovered, setHovered] = useState(null)
  const { markLesson, isComplete } = useProgress()

  const kData = CIRCLE_KEYS.find(k => k.key === selectedKey) ?? CIRCLE_KEYS[0]
  const useFlats = FLAT_KEYS.has(selectedKey)
  const scaleNotes = useMemo(() => buildScale(selectedKey, 'major'), [selectedKey])
  const noteNames = useMemo(() => indexesToNames(scaleNotes, useFlats), [scaleNotes, useFlats])
  const scalePitches = useMemo(() => scaleWithOctaves(selectedKey, 'major', 3), [selectedKey])

  function handleKeyClick(k) {
    setSelectedKey(k.key)
    playSequence(scaleWithOctaves(k.key, 'major', 3), 0.22).catch(() => {})
  }

  const displayKey = hovered ?? selectedKey
  const displayData = CIRCLE_KEYS.find(k => k.key === displayKey) ?? kData

  return (
    <div>
      <PageHeader
        chip="Ciclo das Quintas"
        title="O Mapa da Harmonia"
        description="O Ciclo das Quintas organiza as 12 tonalidades em um círculo que revela relações de acordes, escalas e progressões."
      />

      {/* ── Circle + Info ───────────────────────────────────────────────── */}
      <Section title="1. O Círculo Interativo">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* SVG Circle */}
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <svg
              width={300}
              height={300}
              viewBox="0 0 300 300"
              style={{ display: 'block' }}
            >
              {/* Outer decorative ring */}
              <circle cx={CX} cy={CY} r={130} fill="none" stroke={ink(0.03)} strokeWidth={36} />

              {/* Inner decorative circle */}
              <circle cx={CX} cy={CY} r={52} fill={ink(0.03)} />

              {/* Direction labels */}
              <text x={148} y={14} textAnchor="middle" fontSize={9} fill={ink(0.25)} fontWeight="600">
                Quintas →
              </text>
              <text x={152} y={293} textAnchor="middle" fontSize={9} fill={ink(0.25)} fontWeight="600">
                ← Quartas
              </text>

              {/* Relative minor labels (inner ring) */}
              {CIRCLE_KEYS.map((k) => {
                const { x, y } = relPos(k.idx)
                return (
                  <text key={k.key + '-rel'} x={x} y={y + 1} textAnchor="middle"
                        dominantBaseline="middle" fontSize={7.5}
                        fill={ink(0.28)}>
                    {k.rel}
                  </text>
                )
              })}

              {/* Key buttons */}
              {CIRCLE_KEYS.map((k) => {
                const { x, y } = keyPos(k.idx)
                const isSelected = selectedKey === k.key
                const isHov = hovered === k.key
                const fillColor = isSelected
                  ? '#3b82f6'
                  : isHov
                  ? 'rgba(96,165,250,0.18)'
                  : k.flats > 0
                  ? 'rgba(167,139,250,0.08)'
                  : ink(0.05)
                const strokeColor = isSelected
                  ? '#60a5fa'
                  : isHov
                  ? 'rgba(96,165,250,0.5)'
                  : ink(0.1)
                return (
                  <g
                    key={k.key}
                    onClick={() => handleKeyClick(k)}
                    onMouseEnter={() => setHovered(k.key)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx={x} cy={y} r={21}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 2 : 1.5}
                    />
                    <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
                          fontSize={k.label.length > 2 ? 10 : 12} fontWeight="700"
                          fill={isSelected ? 'white' : ink(0.75)}>
                      {k.label}
                    </text>
                    {/* Accidental count badge */}
                    {(k.sharps > 0 || k.flats > 0) && !isSelected && (
                      <text x={x + 15} y={y - 13} fontSize={7} fill={ink(0.3)}
                            textAnchor="middle">
                        {k.flats > 0 ? `${k.flats}b` : `${k.sharps}#`}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Center info */}
              <text x={CX} y={CY - 12} textAnchor="middle" fontSize={26} fontWeight="800"
                    fill="#60a5fa">
                {displayData.label}
              </text>
              <text x={CX} y={CY + 8} textAnchor="middle" fontSize={9}
                    fill={ink(0.4)}>
                {displayData.flats > 0
                  ? `${displayData.flats} bemol${displayData.flats > 1 ? 'is' : ''}`
                  : displayData.sharps > 0
                  ? `${displayData.sharps} sustenido${displayData.sharps > 1 ? 's' : ''}`
                  : 'sem acidentes'}
              </text>
              <text x={CX} y={CY + 22} textAnchor="middle" fontSize={8}
                    fill={ink(0.28)}>
                rel: {displayData.rel}
              </text>
            </svg>
          </div>

          {/* Info panel */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Selected key header */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-2xl font-extrabold" style={{ color: '#60a5fa' }}>
                    {kData.label} Maior
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-ultra)' }}>
                    Relativa menor: <b style={{ color: '#a78bfa' }}>{kData.rel}</b>
                  </div>
                </div>
                <button
                  className="btn btn-primary text-sm"
                  onClick={() => playSequence(scalePitches, 0.22)}
                >
                  ▶ Tocar
                </button>
              </div>

              {/* Scale notes */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {noteNames.map((n, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-sm font-bold"
                    style={{
                      background: i === 0 ? 'rgba(244,114,182,0.2)' : 'rgba(99,102,241,0.14)',
                      color: i === 0 ? '#f472b6' : '#a78bfa',
                      border: `1px solid ${i === 0 ? '#f472b640' : '#a78bfa30'}`,
                    }}
                  >
                    {n}
                    {i === 0 && <span className="ml-1 text-[10px] opacity-60">T</span>}
                  </span>
                ))}
              </div>

              {/* Accidentals */}
              {kData.acc.length > 0 ? (
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold mb-1.5"
                       style={{ color: 'var(--text-ultra)' }}>
                    {kData.flats > 0 ? 'Bemóis' : 'Sustenidos'}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {kData.acc.map((a, i) => (
                      <AccidentalChip
                        key={a}
                        label={a}
                        isNew={i === kData.acc.length - 1}
                      />
                    ))}
                  </div>
                  {kData.newAcc && (
                    <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                      Novo acidente: <b style={{ color: '#f472b6' }}>{kData.newAcc}</b>
                      {' '}—{' '}
                      {kData.flats > 0
                        ? `4ª justa de ${kData.label}`
                        : `7ª maior de ${kData.label}`}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Dó maior não tem acidentes — a tonalidade de referência.
                </div>
              )}
            </div>

            {/* Guitar tip card */}
            <div className="card p-4" style={{ borderLeft: '2px solid #818cf850' }}>
              <div className="text-xs font-semibold mb-1" style={{ color: '#818cf8' }}>
                No braço do violão/guitarra
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Uma <b>quinta</b> sobe 2 cordas e 2 casas (mesmo dedo). Uma <b>quarta</b> sobe
                1 corda e recua 2 casas.
              </div>
            </div>

            {/* Mark complete buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                className={`btn text-sm ${isComplete('ciclo_quintas', 'quintas') ? 'btn-ghost' : 'btn-primary'}`}
                onClick={() => markLesson('ciclo_quintas', 'quintas')}
              >
                {isComplete('ciclo_quintas', 'quintas') ? '✓ Quintas concluído' : 'Marcar: Ciclo das Quintas'}
              </button>
              <button
                className={`btn text-sm ${isComplete('ciclo_quintas', 'quartas') ? 'btn-ghost' : 'btn-primary'}`}
                onClick={() => markLesson('ciclo_quintas', 'quartas')}
              >
                {isComplete('ciclo_quintas', 'quartas') ? '✓ Quartas concluído' : 'Marcar: Ciclo das Quartas'}
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Fretboard ───────────────────────────────────────────────────── */}
      <Section title={`2. ${kData.label} Maior no Braço`}>
        <Fretboard
          frets={15}
          highlightedNotes={scaleNotes}
          rootNote={selectedKey}
          interactive={false}
          showNoteNames={true}
        />
      </Section>

      {/* ── Theory: Rules ───────────────────────────────────────────────── */}
      <Section title="3. A Lógica por Trás do Círculo">
        <TheoryBlock>
          <Step n={1}>
            <p>
              <b>Regra dos sustenidos</b> — cada passo de 5ª <em>acrescenta 1 sustenido</em>.
              O novo # é sempre a <b>7ª maior</b> da nova tonalidade.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { from: 'C', to: 'G', newSharp: 'F#', rule: '7M de G' },
                { from: 'G', to: 'D', newSharp: 'C#', rule: '7M de D' },
                { from: 'D', to: 'A', newSharp: 'G#', rule: '7M de A' },
              ].map((r, i) => (
                <div key={i} className="card px-3 py-2 text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>{r.from} → {r.to}: </span>
                  <span style={{ color: '#f472b6' }}>{r.newSharp}</span>
                  <span style={{ color: 'var(--text-ultra)' }}> ({r.rule})</span>
                </div>
              ))}
            </div>
          </Step>
          <Step n={2}>
            <p>
              <b>Regra dos bemóis</b> — cada passo de 4ª (= sentido anti-horário) <em>acrescenta 1 bemol</em>.
              O novo b é sempre a <b>4ª justa</b> da nova tonalidade.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { from: 'C', to: 'F',  newFlat: 'Bb', rule: '4J de F' },
                { from: 'F', to: 'Bb', newFlat: 'Eb', rule: '4J de Bb' },
                { from: 'Bb', to: 'Eb', newFlat: 'Ab', rule: '4J de Eb' },
              ].map((r, i) => (
                <div key={i} className="card px-3 py-2 text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>{r.from} → {r.to}: </span>
                  <span style={{ color: '#a78bfa' }}>{r.newFlat}</span>
                  <span style={{ color: 'var(--text-ultra)' }}> ({r.rule})</span>
                </div>
              ))}
            </div>
          </Step>
          <Step n={3}>
            <p>
              <b>Relativa menor</b> — cada tonalidade maior tem uma menor natural com as mesmas notas.
              A relativa menor está sempre 3 semitônios <em>abaixo</em> da tônica maior (ou 9 acima).
              Por isso C maior e Lá menor compartilham as mesmas teclas/trastes.
            </p>
          </Step>
          <Step n={4}>
            <p>
              <b>Progressões famosas</b> usam o círculo instintivamente: I–IV–V (quintas e quartas),
              ii–V–I (jazz), I–V–vi–IV (pop). Sabendo o círculo, você navega entre tonalidades
              sem memorizar notas uma a uma.
            </p>
          </Step>
        </TheoryBlock>
      </Section>

      {/* ── All keys table ──────────────────────────────────────────────── */}
      <Section title="4. Tabela Completa">
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                  {['Tom','Rel. Menor','Acidentes','Novo acidente'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: 'var(--text-ultra)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CIRCLE_KEYS.map((k) => (
                  <tr
                    key={k.key}
                    onClick={() => handleKeyClick(k)}
                    style={{
                      borderBottom: '1px solid var(--border-card)',
                      background: selectedKey === k.key ? 'rgba(59,130,246,0.07)' : 'transparent',
                      cursor: 'pointer',
                    }}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-2.5 font-bold" style={{ color: selectedKey === k.key ? '#60a5fa' : 'var(--text-base)' }}>
                      {k.label} {k.sharps > 0 ? `(${k.sharps}#)` : k.flats > 0 ? `(${k.flats}b)` : ''}
                    </td>
                    <td className="px-4 py-2.5" style={{ color: '#a78bfa' }}>{k.rel}</td>
                    <td className="px-4 py-2.5">
                      {k.acc.length === 0 ? (
                        <span style={{ color: 'var(--text-ultra)' }}>—</span>
                      ) : (
                        <span style={{ color: k.flats > 0 ? '#a78bfa' : '#818cf8' }}>
                          {k.acc.join(', ')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5" style={{ color: '#f472b6' }}>
                      {k.newAcc ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
      <LessonFooter moduleId="ciclo_quintas" />
    </div>
  )
}
