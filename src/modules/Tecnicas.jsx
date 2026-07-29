import { useMemo, useState } from 'react'
import { PageHeader, Section, NotePicker, TheoryBlock, Step, Pill } from '../components/Common.jsx'
import Fretboard from '../components/Fretboard.jsx'
import { buildChord, buildScale, noteIndex, noteName, NOTES_SHARP } from '../lib/theory.js'
import { playChord, playSequence } from '../lib/audio.js'
import { useProgress } from '../context/ProgressContext.jsx'

import LessonFooter from '../components/LessonFooter.jsx'
import CompleteToggle from '../components/CompleteToggle.jsx'
// ── Avoid notes por qualidade de acorde ───────────────────────────────────
const AVOID_NOTES = [
  {
    chord: 'Maior (X)',
    symbol: 'X',
    avoid: ['4ª justa (F em C)'],
    reason: 'A 4ª fica a meio tom acima da 3ª maior — cria choque de 2ª menor com o harmônico mais importante do acorde.',
    safe: ['1', '2', '3', '5', '6', '7M'],
    color: '#3b82f6',
  },
  {
    chord: 'Dominante (X7)',
    symbol: 'X7',
    avoid: ['7ª maior (B em C7)'],
    reason: 'A 7ª maior contradiz a b7 do acorde dominante — tensão que não resolve bem.',
    safe: ['1', '2/9', '3', '5', '6/13', 'b7', 'b9', '#9', 'b5/#11'],
    color: '#c084fc',
  },
  {
    chord: 'Menor (Xm7)',
    symbol: 'Xm7',
    avoid: ['6ª maior se usar Eólio'],
    reason: 'Sobre Dórico a 6ª é uma das notas mais bonitas. Sobre Eólio/Frígio ela pode soar fora do contexto.',
    safe: ['1', 'b3', '4', '5', 'b7', '9'],
    color: '#f472b6',
  },
]

// ── Escalas relativas ─────────────────────────────────────────────────────
const RELATIVE_SCALES = [
  {
    over: 'Acorde Maior (ex: Cmaj)',
    scales: [
      { name: 'Pentatônica maior de C', key: 'pentatonicMajor', shift: 0, why: 'As 5 notas mais seguras do acorde maior.' },
      { name: 'Pentatônica menor de Am', key: 'pentatonicMinor', shift: 9, why: 'Am é a relativa menor de C — soa blues/rock sobre Cmaj.' },
      { name: 'Dórico de D', key: 'dorian', shift: 2, why: 'Traz a 9ª e a 6ª — som mais colorido sobre CMaj.' },
    ],
    color: '#3b82f6',
    root: 'C',
  },
  {
    over: 'Acorde Dominante (ex: G7)',
    scales: [
      { name: 'Mixolídio de G', key: 'mixolydian', shift: 0, why: 'A escala do dominante por excelência — mesma que a maior mas com b7.' },
      { name: 'Pentatônica menor de G', key: 'pentatonicMinor', shift: 0, why: 'Traz o b3 e b7 — o som blues no dominante.' },
      { name: 'Alterada de G', key: 'altered', shift: 0, why: 'Máxima tensão jazz: b9, #9, b5, b13 sobre V7alt.' },
    ],
    color: '#c084fc',
    root: 'G',
  },
  {
    over: 'Acorde Menor (ex: Am)',
    scales: [
      { name: 'Pentatônica menor de A', key: 'pentatonicMinor', shift: 0, why: 'As 5 notas mais seguras do acorde menor — sempre funciona.' },
      { name: 'Dórico de A', key: 'dorian', shift: 0, why: 'Adiciona a 6ª natural — som mais suave e jazzístico.' },
      { name: 'Eólio de A', key: 'aeolian', shift: 0, why: 'Menor natural — mais escuro, ideal para baladas e rock.' },
    ],
    color: '#f472b6',
    root: 'A',
  },
]

// ── Approach notes ─────────────────────────────────────────────────────────
const APPROACH_TYPES = [
  { name: 'Cromática de baixo', desc: 'Toque a nota meio tom ABAIXO da nota alvo e resolva nela imediatamente.', example: 'Para chegar em E: toque Eb → E', symbol: '⬆' },
  { name: 'Cromática de cima', desc: 'Toque a nota meio tom ACIMA da nota alvo e desça para ela.', example: 'Para chegar em E: toque F → E', symbol: '⬇' },
  { name: 'Approach dupla', desc: 'Dois passos cromáticos: meio tom acima + resolução.', example: 'Para chegar em E: F → Eb → E', symbol: '↕' },
  { name: 'Approach diatônico', desc: 'Use a nota diatônica um tom acima ou abaixo e resolva por grau.', example: 'Para chegar em E: D → E (na escala de C)', symbol: '↗' },
]

export default function Tecnicas() {
  const [root, setRoot] = useState('C')
  const [scaleContext, setScaleContext] = useState(0)
  const { markLesson, isComplete } = useProgress()

  const contextData = RELATIVE_SCALES[scaleContext]
  const rootNote = contextData.root

  const scaleNotes0 = useMemo(() => {
    const r = noteIndex(rootNote)
    const s = contextData.scales[0]
    const formula = { pentatonicMajor: [0,2,4,7,9], pentatonicMinor: [0,3,5,7,10], dorian: [0,2,3,5,7,9,10], mixolydian: [0,2,4,5,7,9,10], altered: [0,1,3,4,6,8,10], aeolian: [0,2,3,5,7,8,10] }
    const f = formula[s.key] ?? [0,2,4,5,7,9,11]
    const shiftedRoot = (r + s.shift) % 12
    return f.map(st => (shiftedRoot + st) % 12)
  }, [rootNote, scaleContext])

  const chordNotesForContext = useMemo(() => {
    const chordsMap = { 0: 'maj', 1: '7', 2: 'min' }
    return buildChord(rootNote, chordsMap[scaleContext])
  }, [rootNote, scaleContext])

  return (
    <div>
      <PageHeader
        chip="Técnicas"
        title="Técnicas de Guitarra & Improviso"
        description="Notas de repouso, notas a evitar, approach notes e o mapa de escalas sobre acordes — o guia prático para improvisar com inteligência."
      />

      {/* ── 1. Notas de repouso ────────────────────────────────────────── */}
      <Section title="1. Notas de repouso (Chord Tones)">
        <TheoryBlock>
          <Step n={1}>
            <p>
              <b>Notas de repouso</b> (ou <em>chord tones</em>) são as notas do próprio acorde: <b>1ª, 3ª, 5ª e 7ª</b>.
              Pousar nelas nos tempos fortes (1 e 3) cria a sensação de que você está "tocando as notas certas".
            </p>
          </Step>
          <Step n={2}>
            <p>
              O conceito de <b>target note</b> (nota alvo) é central no jazz: você não impõe a escala ao acorde —
              você encaminha cada frase <em>em direção</em> à nota alvo (geralmente a 3ª ou 7ª) no momento exato da batida.
            </p>
          </Step>
          <Step n={3}>
            <p>
              <b>Hierarquia:</b> Tônica (mais estável) › 5ª › 3ª › 7ª (mais colorida, menos repouso puro).
              Notas de passagem da escala (2ª, 4ª, 6ª) conectam as notas de repouso — mas <em>não parem nelas</em> nos tempos fortes.
            </p>
          </Step>
        </TheoryBlock>

        <div className="mt-5 card p-5">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <NotePicker value={root} onChange={setRoot} label="Acorde" />
          </div>
          <div className="mb-3">
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-ultra)' }}>
              Notas de repouso de {root} Maior
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { interval: '1ª (tônica)', note: root, color: '#3b82f6', weight: 'Mais estável' },
                { interval: '3ª maior', note: noteName((noteIndex(root) + 4) % 12), color: '#c084fc', weight: 'Caráter maior' },
                { interval: '5ª justa', note: noteName((noteIndex(root) + 7) % 12), color: '#818cf8', weight: 'Estável' },
                { interval: '7ª maior', note: noteName((noteIndex(root) + 11) % 12), color: '#f472b6', weight: 'Cor jazzística' },
              ].map((item) => (
                <div key={item.interval} className="card px-4 py-3 flex flex-col items-center"
                  style={{ border: `1px solid ${item.color}40` }}>
                  <div className="text-2xl font-extrabold mb-1" style={{ color: item.color }}>{item.note}</div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{item.interval}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-ultra)' }}>{item.weight}</div>
                </div>
              ))}
            </div>
          </div>
          <Fretboard frets={15} highlightedNotes={buildChord(root, 'maj')} rootNote={root} />
        </div>

        <div className="flex justify-end mt-3">
          <CompleteToggle
            done={isComplete('tecnicas', 'chord_tones')}
            onClick={() => markLesson('tecnicas', 'chord_tones')}
          />
        </div>
      </Section>

      {/* ── 2. Notas a evitar ──────────────────────────────────────────── */}
      <Section title="2. Notas a evitar (Avoid Notes)">
        <TheoryBlock>
          <p>
            <b>Notas a evitar</b> são graus da escala que ficam a meio tom de uma nota importante do acorde,
            criando um choque dissonante. Elas não são <em>proibidas</em> — são perigosas como <em>notas de repouso</em>,
            mas perfeitas como notas de passagem ou de tensão intencional.
          </p>
        </TheoryBlock>

        <div className="mt-4 space-y-4">
          {AVOID_NOTES.map((item) => (
            <div key={item.chord} className="card p-5" style={{ borderLeft: `3px solid ${item.color}` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono font-bold text-lg" style={{ color: item.color }}>{item.symbol}</span>
                <span className="font-bold" style={{ color: 'var(--text-base)' }}>{item.chord}</span>
              </div>
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-ultra)' }}>Nota(s) a evitar: </span>
                <span className="font-semibold" style={{ color: '#f472b6' }}>{item.avoid.join(', ')}</span>
              </div>
              <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{item.reason}</p>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-ultra)' }}>Notas seguras: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.safe.map((n) => (
                    <span key={n} className="text-xs px-2 py-0.5 rounded-full font-mono font-bold"
                      style={{ background: `${item.color}15`, color: item.color }}>{n}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-3">
          <CompleteToggle
            done={isComplete('tecnicas', 'avoid_notes')}
            onClick={() => markLesson('tecnicas', 'avoid_notes')}
          />
        </div>
      </Section>

      {/* ── 3. Approach notes ─────────────────────────────────────────── */}
      <Section title="3. Approach Notes — Como encaminhar frases">
        <TheoryBlock>
          <p>
            Uma <b>approach note</b> é uma nota que antecipa a nota alvo por meio tom (ou tom) e cria a sensação
            de <em>encaminhamento melódico</em>. É o principal recurso para fazer o improviso soar "bebop" e intencional.
          </p>
        </TheoryBlock>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          {APPROACH_TYPES.map((a) => (
            <div key={a.name} className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{a.symbol}</span>
                <span className="font-bold" style={{ color: 'var(--text-base)' }}>{a.name}</span>
              </div>
              <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>{a.desc}</p>
              <div className="text-xs font-mono px-3 py-2 rounded-lg" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
                {a.example}
              </div>
            </div>
          ))}
        </div>

        <div className="card p-5 mt-4">
          <div className="font-bold mb-2" style={{ color: '#60a5fa' }}>Dica prática</div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Escolha uma nota alvo (ex: a 3ª do acorde). Pratique chegar nela de 4 formas:
            meio tom abaixo, meio tom acima, dois meios tons acima/abaixo, e por grau da escala.
            Isso desenvolve o vocabulary de frases. <b>Bebop é 80% approach notes.</b>
          </p>
        </div>

        <div className="flex justify-end mt-3">
          <CompleteToggle
            done={isComplete('tecnicas', 'approach')}
            onClick={() => markLesson('tecnicas', 'approach')}
          />
        </div>
      </Section>

      {/* ── 4. Escalas menores relativas ─────────────────────────────── */}
      <Section title="4. Escalas relativas por tipo de acorde">
        <TheoryBlock>
          <p>
            Existe um mapa de <b>qual escala usar sobre qual acorde</b>. O ponto de partida são as três situações
            harmônicas mais comuns: acorde maior, dominante e menor. Clique no contexto para ver o braço.
          </p>
        </TheoryBlock>

        {/* Context selector */}
        <div className="flex gap-2 flex-wrap mt-4 mb-5">
          {RELATIVE_SCALES.map((ctx, i) => (
            <button
              key={i}
              onClick={() => setScaleContext(i)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition"
              style={{
                background: scaleContext === i ? ctx.color : 'var(--ink-05)',
                color: scaleContext === i ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${scaleContext === i ? ctx.color : 'transparent'}`,
              }}
            >
              {ctx.over}
            </button>
          ))}
        </div>

        <div className="card p-5 mb-4">
          <div className="font-bold text-lg mb-1" style={{ color: contextData.color }}>{contextData.over}</div>
          <div className="space-y-4 mt-3">
            {contextData.scales.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--ink-03)' }}>
                <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: `${contextData.color}20`, color: contextData.color }}>
                  {i + 1}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-base)' }}>{s.name}</div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-ultra)' }}>
              Notas da escala ({contextData.scales[0].name})
            </h4>
            <Fretboard frets={15} highlightedNotes={scaleNotes0} rootNote={contextData.root} />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-ultra)' }}>
              Notas do acorde ({contextData.over.replace(/\(.*\)/, '').trim()})
            </h4>
            <Fretboard frets={15} highlightedNotes={chordNotesForContext} rootNote={contextData.root} />
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <CompleteToggle
            done={isComplete('tecnicas', 'relative_minor')}
            onClick={() => markLesson('tecnicas', 'relative_minor')}
          />
        </div>
      </Section>

      {/* ── 5. Pentatônica sobre acordes ─────────────────────────────── */}
      <Section title="5. Mapa rápido: pentatônica sobre acordes">
        <div className="card p-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {['Acorde', 'Pentatônica recomendada', 'Som resultante'].map(h => (
                  <th key={h} className="text-left px-3 py-2 text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--text-ultra)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-1">
              {[
                { chord: 'CMaj / CMaj7', penta: 'C maior (= A menor)', result: 'Limpo, brilhante, sem tensão' },
                { chord: 'CMaj7', penta: 'E menor (sobre C)', result: 'Adiciona a 9ª e 6ª — sound Dorian-esque' },
                { chord: 'G7 (dominante)', penta: 'G menor (blues sobre G7)', result: 'Som blues direto e cru' },
                { chord: 'G7 (jazz)', penta: 'Bb maior (= G Dórico up)', result: 'Mais sofisticado — traz b7 e 9' },
                { chord: 'Am / Am7', penta: 'A menor (raiz)', result: 'O mais direto — seguro' },
                { chord: 'Am7 (Dorian)', penta: 'E menor (5ª acima)', result: 'Traz a 9ª e 13ª do Dórico' },
                { chord: 'Dm7b5', penta: 'F menor', result: 'Meio-diminuto — traz b5 e b7' },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'var(--ink-03)' : 'transparent' }}>
                  <td className="px-3 py-2 font-mono font-bold" style={{ color: '#60a5fa' }}>{row.chord}</td>
                  <td className="px-3 py-2 font-semibold" style={{ color: '#c084fc' }}>{row.penta}</td>
                  <td className="px-3 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <LessonFooter moduleId="tecnicas" />
    </div>
  )
}
