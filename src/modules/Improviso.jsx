import { useState, useRef, useEffect } from 'react'
import { PageHeader, Section, TheoryBlock, Step } from '../components/Common.jsx'
import Fretboard from '../components/Fretboard.jsx'
import { buildScale, buildScaleNotes, needsFlats } from '../lib/theory.js'
import { useProgress } from '../context/ProgressContext.jsx'

import LessonFooter from '../components/LessonFooter.jsx'
import CompleteToggle from '../components/CompleteToggle.jsx'
// ─── Tracks ──────────────────────────────────────────────────────────────────

const TRACKS = [
  {
    id: 'blues_g',
    title: 'Blues Shuffle em G',
    style: 'Blues',
    key: 'G',
    bpm: 96,
    file: '/audio/blues-shuffle-g.mp3',
    color: '#f59e0b',
    chords: ['G7', 'C7', 'D7'],
    scales: [
      { key: 'pentatonicMinor', label: 'G Pentatônica Menor', notes: 'G – Bb – C – D – F' },
      { key: 'blues',           label: 'G Blues (com a blue note)', notes: 'G – Bb – C – Db – D – F' },
      { key: 'pentatonicMajor', label: 'G Pentatônica Maior', notes: 'G – A – B – D – E' },
    ],
    tips: [
      'Padrão I7–IV7–V7 — qualquer arpejo dominante funciona em cima de qualquer um dos três.',
      'Toque a pentatônica menor em G mas adicione a 3ª maior (B) em momentos chave para o "swing" do blues.',
      'Use a blue note (Db) como nota de passagem rápida — nunca pare nela por muito tempo.',
    ],
  },
  {
    id: 'neo_soul_am',
    title: 'Neo-Soul em Am',
    style: 'Neo-Soul / R&B',
    key: 'A',
    bpm: 75,
    file: '/audio/neo-soul-am.mp3',
    color: '#a78bfa',
    chords: ['Am7', 'Dm7', 'Em7', 'FM7'],
    scales: [
      { key: 'minorNatural',    label: 'A Menor Natural',     notes: 'A – B – C – D – E – F – G' },
      { key: 'dorian',          label: 'A Dórico',            notes: 'A – B – C – D – E – F# – G' },
      { key: 'pentatonicMinor', label: 'A Pentatônica Menor', notes: 'A – C – D – E – G' },
    ],
    tips: [
      'O Dórico (com F# no lugar de F) acrescenta cor jazzística — use sobre o Am7 para soar mais sofisticado.',
      'Em cima do Dm7, pense em D dórico (mesmas notas de A menor natural). Sobre Em7, E frígio.',
      'Neo-soul ama síncopes e ghost notes. Aplique os padrões 5 (não-sequencial) e 8 (com salto) da pentatônica.',
    ],
  },
  {
    id: 'ciclo_quartas',
    title: 'Ciclo de Quartas',
    style: 'Jazz / Estudo',
    key: 'C',
    bpm: 88,
    file: '/audio/ciclo-quartas.mp3',
    color: '#60a5fa',
    chords: ['Cmaj7', 'Fmaj7', 'Bbmaj7', 'Ebmaj7', 'Abmaj7', 'Dbmaj7', 'Gbmaj7', 'Bmaj7', 'Emaj7', 'Amaj7', 'Dmaj7', 'Gmaj7'],
    scales: [
      { key: 'major',  label: 'Maior (Jônico) — siga a tônica', notes: 'Mude a escala a cada acorde.' },
      { key: 'lydian', label: 'Lídio — todos os maj7', notes: 'Lídio funciona como cor extra em qualquer maj7.' },
    ],
    tips: [
      'Backing track para PRATICAR mudança de tonalidade — cada acorde dura ~2 compassos.',
      'Comece tocando apenas tônica + 3ª maior + 7ª maior de cada acorde — vai treinando o ouvido para a mudança.',
      'Quando dominar a tônica, adicione a 9ª e a 13ª. Quando dominar essas, troque o jônico pelo lídio.',
    ],
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtTime(s) {
  if (!s || !isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function Improviso() {
  const [trackId, setTrackId] = useState(TRACKS[0].id)
  const [scaleIdx, setScaleIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [loop, setLoop] = useState(true)
  const audioRef = useRef(null)
  const { markLesson, isComplete } = useProgress()

  const track = TRACKS.find(t => t.id === trackId)
  const scale = track.scales[scaleIdx] ?? track.scales[0]
  const scaleNotes = buildScale(track.key, scale.key)
  const scaleNames = buildScaleNotes(track.key, scale.key)

  // Reset scale index when track changes
  useEffect(() => { setScaleIdx(0) }, [trackId])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration)
    const onEnd  = () => { if (!loop) setPlaying(false) }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
    }
  }, [trackId, loop])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = volume
  }, [volume])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play()
      setPlaying(true)
    }
  }

  const seek = (e) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * duration
  }

  const changeTrack = (id) => {
    if (id === trackId) return
    setPlaying(false)
    audioRef.current?.pause()
    setTrackId(id)
    setCurrentTime(0)
  }

  return (
    <div>
      <PageHeader
        chip="Treino"
        title="Laboratório de Improviso"
        description="Backing tracks reais para você aplicar tudo que aprendeu. Cada track tem o tom, os acordes, as escalas que funcionam e dicas de fraseado."
      />

      {/* ── Track selector ─────────────────────────────────────────────── */}
      <Section title="1. Escolha sua base">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {TRACKS.map(t => {
            const isActive = t.id === trackId
            return (
              <button
                key={t.id}
                onClick={() => changeTrack(t.id)}
                className="card text-left"
                style={{
                  padding: 14,
                  cursor: 'pointer',
                  borderLeft: `3px solid ${isActive ? t.color : 'transparent'}`,
                  background: isActive ? `${t.color}10` : 'var(--bg-card)',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, color: t.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {t.style}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-base)', marginBottom: 6 }}>
                  {t.title}
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-ultra)' }}>
                  <span>Tom: <b style={{ color: 'var(--text-muted)' }}>{t.key}</b></span>
                  <span>{t.bpm} BPM</span>
                </div>
              </button>
            )
          })}
        </div>
      </Section>

      {/* ── Player ─────────────────────────────────────────────────────── */}
      <Section title={`2. ${track.title}`}>
        <audio ref={audioRef} src={track.file} loop={loop} preload="metadata" />

        <div className="card p-5 mb-4" style={{ borderTop: `2px solid ${track.color}` }}>

          {/* Top: Play button + info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <button
              onClick={togglePlay}
              style={{
                width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                background: playing ? `${track.color}25` : track.color,
                border: 'none',
                color: playing ? track.color : '#fff',
                fontSize: 20, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >
              {playing ? '■' : '▶'}
            </button>

            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-base)', lineHeight: 1.2 }}>{track.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-ultra)', marginTop: 2 }}>
                {track.style} · {track.key} · {track.bpm} BPM
              </div>
            </div>

            {/* Volume + Loop */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--text-ultra)' }}>VOL</span>
                <input
                  type="range" min={0} max={1} step={0.05} value={volume}
                  onChange={e => setVolume(Number(e.target.value))}
                  style={{ width: 80, accentColor: track.color, cursor: 'pointer' }}
                />
              </div>
              <button
                onClick={() => setLoop(l => !l)}
                style={{
                  padding: '4px 10px', borderRadius: 999,
                  fontSize: 10, fontWeight: 700, cursor: 'pointer',
                  background: loop ? `${track.color}25` : 'var(--ink-03)',
                  border: `1px solid ${loop ? `${track.color}60` : 'var(--ink-10)'}`,
                  color: loop ? track.color : 'var(--text-muted)',
                  letterSpacing: '0.06em',
                }}
              >
                ↻ LOOP
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div onClick={seek} style={{ position: 'relative', height: 6, borderRadius: 999, background: 'var(--ink-05)', cursor: 'pointer', marginBottom: 6 }}>
            <div
              style={{
                position: 'absolute', top: 0, left: 0,
                width: duration ? `${(currentTime / duration) * 100}%` : '0%',
                height: '100%',
                background: track.color,
                borderRadius: 999,
                transition: 'width 0.15s linear',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-ultra)', fontVariantNumeric: 'tabular-nums' }}>
            <span>{fmtTime(currentTime)}</span>
            <span>{fmtTime(duration)}</span>
          </div>

          {/* Chord progression */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-card)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-ultra)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Acordes da progressão
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {track.chords.map((c, i) => (
                <span key={i} style={{
                  padding: '4px 11px', borderRadius: 8,
                  fontSize: 12, fontWeight: 700, fontFamily: 'monospace',
                  background: `${track.color}12`,
                  color: track.color,
                  border: `1px solid ${track.color}30`,
                }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Scales for soloing ─────────────────────────────────────────── */}
      <Section title="3. Escalas que funcionam">
        <div className="flex flex-wrap gap-2 mb-4">
          {track.scales.map((s, i) => (
            <button
              key={i}
              onClick={() => setScaleIdx(i)}
              style={{
                padding: '7px 14px', borderRadius: 10,
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: scaleIdx === i ? `${track.color}20` : 'var(--ink-03)',
                color: scaleIdx === i ? track.color : 'var(--text-muted)',
                border: `1px solid ${scaleIdx === i ? `${track.color}50` : 'var(--ink-08)'}`,
                transition: 'all 0.15s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="card p-4 mb-4" style={{ borderLeft: `3px solid ${track.color}` }}>
          <div style={{ fontSize: 11, color: 'var(--text-ultra)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            {scale.label}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
            {scaleNames.map((n, i) => (
              <span key={i} style={{
                padding: '3px 10px', borderRadius: 999,
                fontSize: 12, fontWeight: 700,
                background: i === 0 ? `${track.color}22` : 'var(--ink-03)',
                color: i === 0 ? track.color : 'var(--text-muted)',
                border: `1px solid ${i === 0 ? `${track.color}40` : 'var(--ink-08)'}`,
              }}>
                {n}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-ultra)' }}>{scale.notes}</div>
        </div>

        <Fretboard
          frets={15}
          highlightedNotes={scaleNotes}
          rootNote={track.key}
          useFlats={needsFlats(track.key)}
          showNoteNames
        />
      </Section>

      {/* ── Tips ───────────────────────────────────────────────────────── */}
      <Section title="4. Dicas de Fraseado">
        <TheoryBlock>
          {track.tips.map((tip, i) => (
            <Step key={i}><p>{tip}</p></Step>
          ))}
        </TheoryBlock>

        <div className="flex justify-end mt-4">
          <CompleteToggle
            done={isComplete('improviso', track.id)}
            onClick={() => markLesson('improviso', track.id)}
          />
        </div>
      </Section>
      <LessonFooter moduleId="improviso" />
    </div>
  )
}
