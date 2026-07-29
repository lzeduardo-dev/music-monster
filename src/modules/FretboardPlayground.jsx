import { useMemo, useState, useRef, useEffect } from 'react'
import { PageHeader, Section, NotePicker, Pill, TheoryBlock } from '../components/Common.jsx'
import Fretboard from '../components/Fretboard.jsx'
import { buildScale, buildChord, SCALE_LABELS, CHORDS } from '../lib/theory.js'

const COLORS = [
  { value: '#3b82f6', label: 'Azul' },
  { value: '#60a5fa', label: 'Céu' },
  { value: '#818cf8', label: 'Índigo' },
  { value: '#a78bfa', label: 'Violeta' },
  { value: '#c084fc', label: 'Lavanda' },
  { value: '#f472b6', label: 'Rosa' },
  { value: '#FFFFFF', label: 'Branco' }
]

const OVERLAYS = [
  { kind: 'none', label: 'Vazio' },
  { kind: 'scale', scaleKey: 'major', label: 'Escala Maior' },
  { kind: 'scale', scaleKey: 'minorNatural', label: 'Menor Natural' },
  { kind: 'scale', scaleKey: 'pentatonicMajor', label: 'Pent. Maior' },
  { kind: 'scale', scaleKey: 'pentatonicMinor', label: 'Pent. Menor' },
  { kind: 'scale', scaleKey: 'blues', label: 'Blues' },
  { kind: 'chord', chordKey: 'maj', label: 'Acorde Maior' },
  { kind: 'chord', chordKey: 'min', label: 'Acorde Menor' },
  { kind: 'chord', chordKey: 'maj7', label: 'M7' }
]

const BPM_LABELS = [
  { bpm: 40,  label: 'Grave' },
  { bpm: 60,  label: 'Largo' },
  { bpm: 76,  label: 'Andante' },
  { bpm: 108, label: 'Moderato' },
  { bpm: 132, label: 'Allegro' },
  { bpm: 168, label: 'Presto' },
  { bpm: 200, label: 'Prestissimo' },
]

function getBpmLabel(bpm) {
  let last = BPM_LABELS[0]
  for (const entry of BPM_LABELS) {
    if (bpm >= entry.bpm) last = entry
  }
  return last.label
}

function Metronome() {
  const [bpm, setBpm] = useState(120)
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState(false)
  const [beatCount, setBeatCount] = useState(0)
  const ctxRef = useRef(null)
  const intervalRef = useRef(null)

  function playClick(accent = false) {
    try {
      if (!ctxRef.current) ctxRef.current = new AudioContext()
      const ctx = ctxRef.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = accent ? 1100 : 660
      gain.gain.setValueAtTime(accent ? 0.5 : 0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.06)
    } catch {}
  }

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current)
      return
    }
    let count = 0
    const fire = () => {
      playClick(count % 4 === 0)
      setBeat(true)
      setBeatCount(c => c + 1)
      setTimeout(() => setBeat(false), 80)
      count++
    }
    fire()
    intervalRef.current = setInterval(fire, (60 / bpm) * 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, bpm])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-bold" style={{ color: 'var(--text-base)' }}>Metrônomo</div>
        <div className="text-xs font-semibold px-2 py-0.5 rounded-full"
             style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa' }}>
          {getBpmLabel(bpm)}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 items-center">
        {/* Beat indicator — 4 dots */}
        <div className="flex gap-2 shrink-0">
          {[0, 1, 2, 3].map((i) => {
            const isActive = running && beat && beatCount % 4 === i
            const isAccent = i === 0
            return (
              <div
                key={i}
                className="w-5 h-5 rounded-full transition-all duration-75"
                style={{
                  background: isActive
                    ? isAccent ? '#3b82f6' : '#60a5fa'
                    : 'var(--ink-08)',
                  boxShadow: isActive && isAccent ? '0 0 12px rgba(59,130,246,0.6)' : 'none',
                  transform: isActive ? 'scale(1.25)' : 'scale(1)',
                }}
              />
            )
          })}
        </div>

        {/* BPM slider + controls */}
        <div className="flex-1 space-y-3 w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBpm(v => Math.max(40, v - 5))}
              className="w-8 h-8 rounded-lg text-base font-bold flex items-center justify-center transition"
              style={{ background: 'var(--ink-05)', color: 'var(--text-muted)' }}
            >−</button>
            <div className="flex-1 text-center">
              <div className="text-2xl font-extrabold leading-none" style={{ color: '#3b82f6' }}>{bpm}</div>
              <div className="text-[10px] uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-ultra)' }}>BPM</div>
            </div>
            <button
              onClick={() => setBpm(v => Math.min(240, v + 5))}
              className="w-8 h-8 rounded-lg text-base font-bold flex items-center justify-center transition"
              style={{ background: 'var(--ink-05)', color: 'var(--text-muted)' }}
            >+</button>
          </div>

          <input
            type="range" min={40} max={240} step={1} value={bpm}
            onChange={e => setBpm(parseInt(e.target.value, 10))}
            className="w-full"
            style={{ accentColor: '#3b82f6' }}
          />

          {/* BPM presets */}
          <div className="flex flex-wrap gap-1">
            {BPM_LABELS.map(({ bpm: b, label }) => (
              <button
                key={b}
                onClick={() => setBpm(b)}
                className="px-2 py-0.5 rounded text-[10px] font-semibold transition"
                style={{
                  background: bpm === b ? 'rgba(59,130,246,0.18)' : 'var(--ink-05)',
                  color: bpm === b ? '#60a5fa' : 'var(--text-ultra)',
                  border: `1px solid ${bpm === b ? '#3b82f640' : 'transparent'}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Start / Stop */}
        <button
          onClick={() => setRunning(v => !v)}
          className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold transition"
          style={{
            background: running ? 'rgba(244,114,182,0.15)' : 'rgba(59,130,246,0.15)',
            border: `2px solid ${running ? '#f472b660' : '#3b82f660'}`,
            color: running ? '#f472b6' : '#60a5fa',
          }}
          title={running ? 'Parar' : 'Iniciar'}
        >
          {running ? '⏹' : '▶'}
        </button>
      </div>
    </div>
  )
}

export default function FretboardPlayground() {
  const [root, setRoot] = useState('E')
  const [overlayIdx, setOverlayIdx] = useState(3) // pentatonic minor
  const [color, setColor] = useState('#60a5fa')
  const [marks, setMarks] = useState({})
  const [frets, setFrets] = useState(15)
  const [showNoteNames, setShowNoteNames] = useState(true)
  const [interactive, setInteractive] = useState(true)

  const overlay = OVERLAYS[overlayIdx]
  const highlighted = useMemo(() => {
    if (overlay.kind === 'scale') return buildScale(root, overlay.scaleKey)
    if (overlay.kind === 'chord') return buildChord(root, overlay.chordKey)
    return []
  }, [overlay, root])

  const overlayLabel = useMemo(() => {
    if (overlay.kind === 'scale') return `${root} ${SCALE_LABELS[overlay.scaleKey]}`
    if (overlay.kind === 'chord') return `${root} ${CHORDS[overlay.chordKey].name}`
    return 'Braço livre'
  }, [overlay, root])

  const onToggleMark = (sIdx, fret) => {
    const k = `${sIdx}_${fret}`
    setMarks((m) => {
      const next = { ...m }
      if (next[k] && next[k].color === color) {
        delete next[k]
      } else {
        next[k] = { color }
      }
      return next
    })
  }

  const clearMarks = () => setMarks({})

  return (
    <div>
      <PageHeader
        chip="Ferramenta"
        title="Braço do Violão"
        description="Explore o braço livremente. Marque casas, troque cores, sobreponha escalas e acordes — uma prancheta digital para a sua prática."
      />

      <Section title="Configuração">
        <div className="card p-5 grid md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/50 mb-2">Tônica</div>
              <NotePicker value={root} onChange={setRoot} label="" />
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-white/50 mb-2">Sobreposição</div>
              <div className="flex flex-wrap gap-1">
                {OVERLAYS.map((o, i) => (
                  <Pill key={i} active={overlayIdx === i} onClick={() => setOverlayIdx(i)}>
                    {o.label}
                  </Pill>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/50 mb-2">Cor da marcação</div>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    className={`w-9 h-9 rounded-full border-2 transition ${color === c.value ? 'border-white scale-110' : 'border-white/20'}`}
                    style={{ background: c.value }}
                    aria-label={c.label}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <label className="text-sm text-white/70 flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-white/50">Casas</span>
                <input
                  type="range" min={5} max={24} value={frets}
                  onChange={(e) => setFrets(parseInt(e.target.value, 10))}
                  className="accent-accent-emerald"
                />
                <span className="font-bold w-7 text-right">{frets}</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-accent-emerald" checked={showNoteNames} onChange={(e) => setShowNoteNames(e.target.checked)} />
                Exibir nomes das notas
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-accent-emerald" checked={interactive} onChange={(e) => setInteractive(e.target.checked)} />
                Tocar áudio ao clicar
              </label>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button className="btn btn-ghost" onClick={clearMarks}>Limpar marcações</button>
            </div>
          </div>
        </div>
      </Section>

      <Section title={overlayLabel}>
        <Fretboard
          frets={frets}
          highlightedNotes={highlighted}
          rootNote={root}
          userMarks={marks}
          onToggleMark={onToggleMark}
          markColor={color}
          interactive={interactive}
          showNoteNames={showNoteNames}
        />
        <div className="text-xs text-white/55 mt-3">
          Clique em qualquer casa para marcá-la com a cor selecionada. Clique novamente na mesma cor para apagar a marcação.
          Suas marcações ficam por cima das notas da escala/acorde.
        </div>
      </Section>

      <Section title="Metrônomo">
        <Metronome />
      </Section>

      <TheoryBlock>
        <p>
          <b>Dicas de uso:</b>
        </p>
        <ul className="list-disc list-inside space-y-1 text-white/75">
          <li>Use cores diferentes para separar <i>shapes</i> (ex: azul para o shape 1 da pentatônica, âmbar para o shape 2).</li>
          <li>Marque <i>tônicas</i> em coral para enxergar rapidamente os pontos de "casa" em qualquer região do braço.</li>
          <li>Sobreponha uma escala e marque os arpejos de I, IV e V em cores distintas para visualizar as "ilhas seguras" dentro de um solo.</li>
        </ul>
      </TheoryBlock>
    </div>
  )
}
