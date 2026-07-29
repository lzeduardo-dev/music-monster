import { useState, useMemo, useEffect } from 'react'
import { PageHeader, Section, TheoryBlock } from '../components/Common.jsx'
import GuitarChordDiagram from '../components/GuitarChordDiagram.jsx'
import Fretboard from '../components/Fretboard.jsx'
import { COMMON_ROOTS, noteIndex, buildChordNotes, needsFlats, CHORDS, chordWithOctaves } from '../lib/theory.js'
import { playChord } from '../lib/audio.js'
import { useProgress } from '../context/ProgressContext.jsx'

import LessonFooter from '../components/LessonFooter.jsx'
// ── Chord quality groups ────────────────────────────────────────────────────

const QUALITY_GROUPS = [
  {
    label: 'Tríades',
    color: '#60a5fa',
    qualities: [
      { key: 'maj',    label: 'X',       name: 'Maior',           formula: '1–3–5' },
      { key: 'min',    label: 'Xm',      name: 'Menor',           formula: '1–b3–5' },
      { key: 'dim',    label: 'X°',      name: 'Diminuto',        formula: '1–b3–b5' },
      { key: 'aug',    label: 'X+',      name: 'Aumentado',       formula: '1–3–#5' },
      { key: 'sus2',   label: 'Xsus2',   name: 'Sus2',            formula: '1–2–5' },
      { key: 'sus4',   label: 'Xsus4',   name: 'Sus4',            formula: '1–4–5' },
      { key: 'add9',   label: 'Xadd9',   name: 'Add9',            formula: '1–3–5–9' },
    ],
  },
  {
    label: 'Tétrades',
    color: '#a78bfa',
    qualities: [
      { key: 'maj7',   label: 'XM7',     name: '7ª Maior',        formula: '1–3–5–7' },
      { key: '7',      label: 'X7',      name: 'Dominante',       formula: '1–3–5–b7' },
      { key: 'min7',   label: 'Xm7',     name: '7ª Menor',        formula: '1–b3–5–b7' },
      { key: 'm7b5',   label: 'Xm7b5',   name: 'Meio-Dim.',       formula: '1–b3–b5–b7' },
      { key: 'dim7',   label: 'X°7',     name: 'Dim. 7ª',         formula: '1–b3–b5–bb7' },
      { key: '7sus4',  label: 'X7sus4',  name: 'Dom. Sus4',       formula: '1–4–5–b7' },
    ],
  },
  {
    label: 'Extensões',
    color: '#f472b6',
    qualities: [
      { key: '9',      label: 'X9',      name: 'Nona Dom.',       formula: '1–3–5–b7–9' },
      { key: 'maj9',   label: 'XM9',     name: 'Nona Maior',      formula: '1–3–5–7–9' },
      { key: 'min9',   label: 'Xm9',     name: 'Nona Menor',      formula: '1–b3–5–b7–9' },
      { key: '7b9',    label: 'X7b9',    name: 'Dom. b9',         formula: '1–3–5–b7–b9' },
      { key: '7#9',    label: 'X7#9',    name: 'Dom. #9',         formula: '1–3–5–b7–#9' },
      { key: '7#11',   label: 'X7#11',   name: 'Lídio Dom.',      formula: '1–3–5–b7–#11' },
      { key: 'min11',  label: 'Xm11',    name: 'Menor 11ª',       formula: '1–b3–5–b7–9–11' },
      { key: '13',     label: 'X13',     name: '13ª Dom.',         formula: '1–3–5–b7–9–13' },
      { key: 'maj13',  label: 'XM13',    name: '13ª Maior',       formula: '1–3–5–7–9–13' },
    ],
  },
]

const QUALITIES = QUALITY_GROUPS.flatMap(g => g.qualities)

// ── Main component ──────────────────────────────────────────────────────────

export default function MaquinaAcordes() {
  const [root, setRoot]       = useState('C')
  const [quality, setQuality] = useState('maj7')
  const [inversion, setInversion] = useState(0)
  const { markLesson, isComplete } = useProgress()
  const doneTheory = isComplete('maquina_acordes', 'teoria')
  const doneMaq    = isComplete('maquina_acordes', 'maquina')

  useEffect(() => { setInversion(0) }, [quality])

  const qualityObj = QUALITIES.find(q => q.key === quality) ?? QUALITY_GROUPS[0].qualities[0]
  const groupColor = QUALITY_GROUPS.find(g => g.qualities.some(q => q.key === quality))?.color ?? '#60a5fa'

  const chordSemitones = useMemo(() => {
    const r = noteIndex(root)
    return (CHORDS[quality]?.intervals ?? [0, 4, 7, 11]).map(s => (r + s) % 12)
  }, [root, quality])

  const chordNoteNames = useMemo(() => buildChordNotes(root, quality), [root, quality])
  const numNotes = chordNoteNames.length
  const inv = Math.min(inversion, numNotes - 1)
  const bassNote = chordNoteNames[inv]

  const chordSymbol = qualityObj.label.replace('X', root)
  const displaySymbol = inv > 0 ? `${chordSymbol}/${bassNote}` : chordSymbol

  const chordPitches = useMemo(() => {
    try { return chordWithOctaves(root, quality, 4) } catch { return [] }
  }, [root, quality])

  const handlePlay = () => { if (chordPitches.length) playChord(chordPitches) }

  return (
    <div>
      <PageHeader
        chip="Tétrades & Voicings"
        title="Máquina de Acordes"
        description="Explore qualquer acorde — de tríades simples a extensões com 13ª — no braço inteiro."
      />

      {/* ── Theory ─────────────────────────────────────────────────────── */}
      <Section title="A Teoria: Tétrades, Extensões e Drops">
        <TheoryBlock>
          <p>
            <strong style={{ color: 'var(--text-base)' }}>Tríades a Extensões</strong>
            {' '}— acordes crescem por sobreposição de terças a partir da tônica. Tríades (3 notas)
            formam o esqueleto; tétrades (4 notas, com a 7ª) adicionam identidade funcional;
            extensões (9ª, 11ª, 13ª) acrescentam cor sem mudar a função harmônica.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 12 }}>
            {QUALITY_GROUPS.map(group => (
              <div key={group.label} className="card p-3">
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: group.color, marginBottom: 8 }}>
                  {group.label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {group.qualities.map(q => (
                    <div key={q.key} style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      <span style={{ fontWeight: 700, color: group.color }}>{q.label.replace('X', 'C')}</span>
                      {' '}
                      <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text-ultra)' }}>({q.formula})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p>
            <strong style={{ color: 'var(--text-base)' }}>Drop 2 e Drop 3</strong>
            {' '}— voicings redistribuem as vozes pelo braço para tornar posições fechadas tocáveis.
            <strong>Drop 2</strong>: a 2ª nota mais aguda desce uma oitava (D-G-B-e).
            <strong>Drop 3</strong>: a 3ª nota mais aguda desce uma oitava (E-A-D-G).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="card p-4">
              <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: 6, fontSize: 14 }}>Drop 2</div>
              <div style={{ padding: '8px 12px', background: 'rgba(59,130,246,0.06)', borderRadius: 8, fontSize: 11, fontFamily: 'monospace', lineHeight: 1.9, color: 'var(--text-subtle)', borderLeft: '3px solid #3b82f6' }}>
                Fechado:   C4 – E4 – G4 – B4<br />
                Drop 2:    G4 ↓ → G3<br />
                Resultado: G3 – C4 – E4 – B4
              </div>
            </div>
            <div className="card p-4">
              <div style={{ fontWeight: 700, color: '#a78bfa', marginBottom: 6, fontSize: 14 }}>Drop 3</div>
              <div style={{ padding: '8px 12px', background: 'rgba(167,139,250,0.06)', borderRadius: 8, fontSize: 11, fontFamily: 'monospace', lineHeight: 1.9, color: 'var(--text-subtle)', borderLeft: '3px solid #a78bfa' }}>
                Fechado:   C4 – E4 – G4 – B4<br />
                Drop 3:    E4 ↓ → E3<br />
                Resultado: E3 – C4 – G4 – B4
              </div>
            </div>
          </div>
        </TheoryBlock>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => markLesson('maquina_acordes', 'teoria')}
            disabled={doneTheory}
            style={{
              padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700,
              cursor: doneTheory ? 'default' : 'pointer',
              background: doneTheory ? 'rgba(59,130,246,0.1)' : '#2563eb',
              color: doneTheory ? '#60a5fa' : '#fff',
              border: doneTheory ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
            }}
          >
            {doneTheory ? '✓ Teoria concluída' : 'Concluir teoria'}
          </button>
        </div>
      </Section>

      {/* ── Chord Machine ───────────────────────────────────────────────── */}
      <Section title="Máquina de Acordes">
        {/* Controls */}
        <div className="card p-4 md:p-5 mb-5 space-y-5">

          {/* Root */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-ultra)', marginBottom: 6 }}>Tônica</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {COMMON_ROOTS.map(n => (
                <button
                  key={n}
                  onClick={() => setRoot(n)}
                  style={{
                    padding: '5px 12px', borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    background: root === n ? '#2563eb' : 'var(--ink-05)',
                    color: root === n ? '#fff' : 'var(--text-muted)',
                    border: root === n ? '1px solid #2563eb' : '1px solid transparent',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Quality — grouped */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-ultra)', marginBottom: 8 }}>Qualidade</div>
            <div className="space-y-3">
              {QUALITY_GROUPS.map(group => (
                <div key={group.label}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: group.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                    {group.label}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {group.qualities.map(q => {
                      const active = quality === q.key
                      return (
                        <button
                          key={q.key}
                          onClick={() => setQuality(q.key)}
                          title={`${q.name} — ${q.formula}`}
                          style={{
                            padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            background: active ? `${group.color}22` : 'var(--ink-03)',
                            color: active ? group.color : 'var(--text-muted)',
                            border: active ? `1px solid ${group.color}80` : '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          {q.label.replace('X', root)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inversion */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-ultra)', marginBottom: 6 }}>Inversão</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {chordNoteNames.map((note, i) => {
                const active = inv === i
                return (
                  <button
                    key={i}
                    onClick={() => setInversion(i)}
                    style={{
                      padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                      background: active ? 'rgba(99,102,241,0.15)' : 'var(--ink-03)',
                      color: active ? '#818cf8' : 'var(--text-muted)',
                      border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {i === 0 ? 'Fund.' : `${i}ª inv.`}
                    <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.7 }}>/{note}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Chord display */}
        <div className="card p-5 mb-4">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
            {/* Guitar chord diagram */}
            <div style={{
              border: `1px solid ${groupColor}30`,
              borderRadius: 16,
              padding: '12px 10px',
              background: `${groupColor}06`,
              flexShrink: 0,
            }}>
              <GuitarChordDiagram
                root={root}
                chordKey={quality}
                accentColor={groupColor}
                width={136}
                height={175}
              />
            </div>

            {/* Chord info + play */}
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1, color: groupColor }}>
                {displaySymbol}
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                {qualityObj.name}
                <span style={{ marginLeft: 10, fontFamily: 'monospace', fontSize: 11, color: 'var(--text-ultra)' }}>
                  {qualityObj.formula}
                </span>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {chordNoteNames.map((note, i) => (
                  <span key={i} style={{
                    padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                    background: i === inv ? '#f472b620' : `${groupColor}15`,
                    color: i === inv ? '#f472b6' : groupColor,
                    border: `1px solid ${i === inv ? '#f472b640' : groupColor + '30'}`,
                  }}>
                    {note}
                  </span>
                ))}
              </div>
              <button
                onClick={handlePlay}
                style={{
                  marginTop: 16,
                  padding: '10px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  background: 'rgba(59,130,246,0.12)', color: '#60a5fa',
                  border: '1px solid rgba(59,130,246,0.25)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                ▶ Tocar
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 11, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f472b6' }} />
            <span style={{ color: 'var(--text-ultra)' }}>nota no baixo (inversão)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#a78bfa' }} />
            <span style={{ color: 'var(--text-ultra)' }}>demais notas do acorde</span>
          </div>
        </div>

        {/* Full fretboard */}
        <Fretboard
          frets={15}
          highlightedNotes={chordSemitones}
          rootNote={bassNote}
          interactive={true}
          showNoteNames={true}
          useFlats={needsFlats(root)}
        />

        <p className="mt-3 text-xs" style={{ color: 'var(--text-ultra)' }}>
          Clique em qualquer nota para ouvir. Rosa = nota no baixo da inversão selecionada. Roxo = demais notas do acorde.
        </p>

        <div className="mt-5 flex justify-end">
          <button
            onClick={() => markLesson('maquina_acordes', 'maquina')}
            disabled={doneMaq}
            style={{
              padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700,
              cursor: doneMaq ? 'default' : 'pointer',
              background: doneMaq ? 'rgba(59,130,246,0.1)' : '#2563eb',
              color: doneMaq ? '#60a5fa' : '#fff',
              border: doneMaq ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
            }}
          >
            {doneMaq ? '✓ Prática concluída' : 'Concluir prática'}
          </button>
        </div>
      </Section>
      <LessonFooter moduleId="maquina_acordes" />
    </div>
  )
}
