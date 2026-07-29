import { useMemo, useState } from 'react'
import { PageHeader, Section, NotePicker, TheoryBlock, Step, Pill } from '../components/Common.jsx'
import Fretboard from '../components/Fretboard.jsx'
import { buildScale, buildScaleNotes, scaleWithOctaves, needsFlats, SCALE_LABELS } from '../lib/theory.js'
import { playSequence } from '../lib/audio.js'
import { useProgress } from '../context/ProgressContext.jsx'

import LessonFooter from '../components/LessonFooter.jsx'
import CompleteToggle from '../components/CompleteToggle.jsx'
const MODES = [
  {
    key: 'melodicMinor',
    label: 'Menor Melódica',
    degree: 'I',
    formula: '1 – 2 – b3 – 4 – 5 – 6 – 7',
    char: 'Escura mas com a 6ª e 7ª abertas — tensão elegante.',
    use: 'Sobre acordes Xm(M7) e Xm6. Muito usada no jazz contemporâneo sobre tônicas menores.',
    color: 'emerald'
  },
  {
    key: 'dorianB2',
    label: 'Dórico b2',
    degree: 'II',
    formula: '1 – b2 – b3 – 4 – 5 – 6 – b7',
    char: 'Frigio com 6ª natural — ambíguo, tenso, exótico.',
    use: 'Sobre acordes sus(b9). Muito usada em jazz modal e música árabe/flamenca fusionada.',
    color: 'amber'
  },
  {
    key: 'lydianAugmented',
    label: 'Lídio Aumentado',
    degree: 'III',
    formula: '1 – 2 – 3 – #4 – #5 – 6 – 7',
    char: 'Eufórico, flutuante — a mais "alienígena" dos modos.',
    use: 'Sobre acordes Xaug(M7). Herbie Hancock e Wayne Shorter usaram em contextos modais.',
    color: 'emerald'
  },
  {
    key: 'lydianDominant',
    label: 'Lídio Dominante',
    degree: 'IV',
    formula: '1 – 2 – 3 – #4 – 5 – 6 – b7',
    char: 'Brilhante e dominante. O Mixolídio com a 4ª aumentada.',
    use: 'A escala mais usada no jazz sobre dominantes não-resolventes (dominante substituta, tritone sub). Joe Satriani a usa muito em fusion.',
    color: 'amber'
  },
  {
    key: 'mixolydianB6',
    label: 'Mixolídio b6',
    degree: 'V',
    formula: '1 – 2 – 3 – 4 – 5 – b6 – b7',
    char: 'Dominante com uma sombra na 6ª — melancólico e unshaven.',
    use: 'Sobre V7 com b13. Dominante com resolução ambígua, muito usado em músicas modais hinduístas/mediterrâneas.',
    color: 'coral'
  },
  {
    key: 'locrianSharp2',
    label: 'Lócrio #2',
    degree: 'VI',
    formula: '1 – 2 – b3 – 4 – b5 – b6 – b7',
    char: 'Meio-diminuto com a 2ª natural — menos tenso que o Lócrio padrão.',
    use: 'A escala padrão do jazz sobre acordes m7b5 (meio-diminuto). Leva bem à resolução do V7alt.',
    color: 'coral'
  },
  {
    key: 'altered',
    label: 'Escala Alterada',
    degree: 'VII',
    formula: '1 – b2 – b3 – b4(3) – b5 – b6 – b7',
    char: 'Caos organizado — todas as alterações possíveis (#9, b9, #11, b13).',
    use: 'A escala de dominante mais usada no jazz sobre V7alt antes de uma resolução de Imaj7. Charlie Parker, Coltrane e Pat Metheny a dominavam.',
    color: 'amber'
  }
]

const COLOR_CHIP = { emerald: '', amber: 'chip-amber', coral: 'chip-coral' }

export default function MelodicMinor() {
  const [root, setRoot] = useState('D')
  const [modeKey, setModeKey] = useState('melodicMinor')
  const { markLesson, isComplete } = useProgress()

  const mode = MODES.find((m) => m.key === modeKey)
  const notes = useMemo(() => buildScale(root, modeKey), [root, modeKey])
  const pitches = useMemo(() => scaleWithOctaves(root, modeKey, 4), [root, modeKey])

  return (
    <div>
      <PageHeader
        chip="Escala Menor Melódica"
        title="Menor Melódica & seus 7 modos"
        description="A escala que separa músicos intermediários de avançados. Seus modos são o vocabulário do jazz moderno, fusion e composição contemporânea."
      />

      <Section title="1. O que é a escala menor melódica?">
        <TheoryBlock>
          <Step n={1}>
            <p>
              Na teoria clássica, a menor melódica sobe com a 6ª e 7ª maiores (para evitar o salto
              aumentado) e <i>desce</i> como a menor natural. No <b>jazz</b>, convenciona-se usar a forma
              ascendente nos dois sentidos — isso se chama "jazz minor" ou "menor melódica de jazz".
            </p>
          </Step>
          <Step n={2}>
            <p>
              Fórmula: <span className="font-mono text-accent-emerald">1 – 2 – b3 – 4 – 5 – 6 – 7</span><br/>
              É exatamente a escala maior com a 3ª bemolizada. Resultado: soa menor na 3ª
              mas tem a luminosidade da 6ª e 7ª maiores — uma dualidade única.
            </p>
          </Step>
          <Step n={3}>
            <p>
              Seus 7 modos geram cada escala a partir de um grau diferente.
              O mais famoso é o <b>VII grau</b> — a <b>Escala Alterada</b> —
              que é a preferida dos músicos de jazz sobre dominantes.
            </p>
          </Step>
        </TheoryBlock>
      </Section>

      <Section
        title={`${root} ${mode.label} — ${mode.formula}`}
        action={
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={() => playSequence(pitches, 0.28, true)}>▶ Tocar</button>
            <CompleteToggle
              done={isComplete('melodic-minor', modeKey)}
              onClick={() => markLesson('melodic-minor', modeKey)}
            />
          </div>
        }
      >
        {/* Mode selector */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {MODES.map((m) => (
            <Pill
              key={m.key}
              active={modeKey === m.key}
              tone={m.color === 'amber' ? 'amber' : m.color === 'coral' ? 'coral' : 'emerald'}
              onClick={() => setModeKey(m.key)}
            >
              <span className="opacity-60 mr-1">{m.degree}</span> {m.label}
            </Pill>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <NotePicker value={root} onChange={setRoot} />
        </div>

        {/* Notes */}
        <div className="card p-4 mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {buildScaleNotes(root, modeKey).map((n, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-lg text-sm font-bold"
                style={{
                  background: i === 0 ? 'rgba(37,99,235,0.18)' : 'rgba(226,232,240,0.07)',
                  color: i === 0 ? '#3b82f6' : '#cbd5e1',
                  border: `1px solid ${i === 0 ? 'rgba(37,99,235,0.3)' : 'rgba(226,232,240,0.1)'}`,
                }}
              >
                {n}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-3 mt-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-subtle)' }}>Caráter sonoro</div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{mode.char}</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-subtle)' }}>Quando usar</div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{mode.use}</p>
            </div>
          </div>
        </div>

        <div>
          <Fretboard frets={15} highlightedNotes={notes} rootNote={root} useFlats={needsFlats(root)} />
        </div>
      </Section>

      <Section title="2. A Escala Alterada — o coração do jazz moderno">
        <TheoryBlock>
          <p>
            O VII modo da menor melódica — chamado de <b>Escala Alterada</b> ou <b>Super Lócrio</b> —
            é a escala mais importante do vocabulário jazz sobre dominantes. Ela contém <i>todas</i>
            as alterações possíveis da escala dominante: b9, #9, #11 (trítono) e b13.
          </p>
          <p>
            Fórmula: <span className="font-mono text-accent-amber">1 – b2(b9) – b3(#9) – 3 – b5(#11) – b6(b13) – b7</span>
          </p>
          <p>
            <b>Regra de ouro:</b> quando um acorde dominante <b>resolve</b> uma quarta acima
            (ex: G7 → C), toque a escala alterada de G. Isso significa tocar a menor melódica
            de Ab — um semitom acima da raiz do dominante.
          </p>
          <div className="card p-4 mt-2" style={{ background: 'rgba(192,132,252,0.07)', borderColor: 'rgba(192,132,252,0.2)' }}>
            <div className="font-bold text-accent-amber mb-1">Atalho prático</div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              G7 alterada → toque a escala de <b>Ab menor melódica</b> (um semitom acima).<br />
              C7 alterada → toque a escala de <b>Db menor melódica</b>.
            </p>
          </div>
        </TheoryBlock>
      </Section>

      <Section title="3. Tabela de referência dos 7 modos">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-card)' }}>
                <th className="text-left py-2 px-3" style={{ color: 'var(--text-subtle)' }}>Grau</th>
                <th className="text-left py-2 px-3" style={{ color: 'var(--text-subtle)' }}>Nome</th>
                <th className="text-left py-2 px-3" style={{ color: 'var(--text-subtle)' }}>Acorde alvo</th>
                <th className="text-left py-2 px-3" style={{ color: 'var(--text-subtle)' }}>Fórmula</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['I',   'Menor Melódica',   'Xm(M7), Xm6',         '1 2 b3 4 5 6 7'],
                ['II',  'Dórico b2',        'Xsus(b9)',             '1 b2 b3 4 5 6 b7'],
                ['III', 'Lídio Aumentado',  'XaugM7',               '1 2 3 #4 #5 6 7'],
                ['IV',  'Lídio Dominante',  'X7(#11), X7(#4)',      '1 2 3 #4 5 6 b7'],
                ['V',   'Mixolídio b6',     'X7(b13)',              '1 2 3 4 5 b6 b7'],
                ['VI',  'Lócrio #2',        'Xm7b5, Xø',           '1 2 b3 4 b5 b6 b7'],
                ['VII', 'Escala Alterada',  'X7alt, X7(b9#9)',      '1 b2 b3 3 b5 b6 b7'],
              ].map(([deg, name, chord, form]) => (
                <tr
                  key={deg}
                  onClick={() => setModeKey(MODES.find((m) => m.degree === deg)?.key || modeKey)}
                  className="border-b cursor-pointer hover:opacity-90 transition"
                  style={{ borderColor: 'var(--border-card)' }}
                >
                  <td className="py-2.5 px-3 font-bold text-accent-emerald">{deg}</td>
                  <td className="py-2.5 px-3 font-medium" style={{ color: 'var(--text-base)' }}>{name}</td>
                  <td className="py-2.5 px-3 font-mono text-xs text-accent-amber">{chord}</td>
                  <td className="py-2.5 px-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{form}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-subtle)' }}>Clique em uma linha para carregar aquele modo no visualizador acima.</p>
      </Section>
      <LessonFooter moduleId="melodic-minor" />
    </div>
  )
}
