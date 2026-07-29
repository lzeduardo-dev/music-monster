import { useMemo, useState } from 'react'
import { PageHeader, Section, NotePicker, TheoryBlock, Step, Pill } from '../components/Common.jsx'
import Fretboard from '../components/Fretboard.jsx'
import { buildScale, buildChord, chordWithOctaves, indexesToNames, SCALE_LABELS } from '../lib/theory.js'
import { playChord, playNote } from '../lib/audio.js'
import { useProgress } from '../context/ProgressContext.jsx'

import LessonFooter from '../components/LessonFooter.jsx'
import CompleteToggle from '../components/CompleteToggle.jsx'
// 12-bar progressions in Nashville (scale-degree) notation
const PROGRESSIONS = {
  texas: {
    label: 'Texas Blues',
    chip: 'chip-amber',
    desc: 'O estilo de Stevie Ray Vaughan, Albert Collins e T-Bone Walker. Progressão direta, dominantes cruas, vibrato pesado e bends dramáticos.',
    artists: ['Stevie Ray Vaughan', 'Albert Collins', 'T-Bone Walker', 'Johnny Winter'],
    bars: [
      'I7','I7','I7','I7',
      'IV7','IV7','I7','I7',
      'V7','IV7','I7','V7'
    ],
    scaleKey: 'pentatonicMinor',
    theory: 'Texas Blues usa acordes dominantes I7–IV7–V7 sem substituições. O som ácido vem de strings pesadas (0.12–0.54), amplificador saturado e vibrato de pulso. A escala blues e a pentatônica menor são o vocabulário base. O turnaround no compasso 12 cria movimento de V7 → I7 para repetir o chorus.'
  },
  chicago: {
    label: 'Chicago Blues',
    chip: 'chip-coral',
    desc: 'Muddy Waters, Buddy Guy e Howlin\' Wolf definiram este estilo. Mais estruturado, com call-and-response típico, uso de slide e banda completa.',
    artists: ['Muddy Waters', 'Buddy Guy', 'Howlin\' Wolf', 'Little Walter'],
    bars: [
      'I7','I7','I7','I7',
      'IV7','IV7','I7','I7',
      'V7','IV7','I7','I7'
    ],
    scaleKey: 'blues',
    theory: 'Chicago Blues popularizou o blues amplificado com banda. A grande diferença para o Texas é a ausência do turnaround agressivo e o uso mais constante da escala blues hexatônica. Riffs de duas notas (double-stops) e slides entre frases são marcas registradas. Os vocais geralmente se encaixam nos compassos I7 e IV7.'
  },
  majorBlues: {
    label: 'Blues Maior',
    chip: 'chip',
    desc: 'Sonoridade feliz, country-flavored, gospel. B.B. King e T-Bone Walker misturavam muito blues maior com menor para criar tensão vocal.',
    artists: ['B.B. King', 'T-Bone Walker', 'Chuck Berry', 'Little Richard'],
    bars: [
      'I7','IV7','I7','I7',
      'IV7','IV7','I7','I7',
      'V7','IV7','I7','V7'
    ],
    scaleKey: 'bluesMajor',
    theory: 'A escala de Blues Maior (1–2–b3–3–5–6) cria a ambiguidade maior/menor que é a assinatura do R&B clássico. O I7 no segundo compasso (quick-change) é característico do estilo de Chicago e jump blues. A tensão entre a 3ª bemol e a 3ª natural é o coração da expressividade vocal do blues.'
  },
  minorBlues: {
    label: 'Blues Menor',
    chip: 'chip-coral',
    desc: 'Mais sombrio e dramático. John Lee Hooker, Freddie King e Gary Moore usavam isso. Muito presente no blues britânico e hard blues.',
    artists: ['John Lee Hooker', 'Freddie King', 'Gary Moore', 'Peter Green'],
    bars: [
      'Im7','Im7','Im7','Im7',
      'IVm7','IVm7','Im7','Im7',
      'V7(b9)','IVm7','Im7','V7(b9)'
    ],
    scaleKey: 'pentatonicMinor',
    theory: 'O Blues Menor usa a progressão em acorde menor ao longo de todo o chorus. O V7(b9) no compasso 9 cria tensão extra — a b9 adiciona dissonância antes da resolução. A escala menor melódica e a pentatônica menor funcionam bem aqui. Artistas como Gary Moore usavam o V7(b9) com vibrato dramático para criar tensão máxima antes do retorno ao Im.'
  },
  jazzBlues: {
    label: 'Jazz Blues',
    chip: 'chip-indigo',
    desc: 'Charlie Parker, Wes Montgomery e Grant Green. A progressão de blues com substituições bebop: ii–V sobre o IV, tritone sub no turnaround.',
    artists: ['Charlie Parker', 'Wes Montgomery', 'Grant Green', 'Pat Metheny'],
    bars: [
      'I7','IV7','I7','I7',
      'IV7','IVm7','I7','VI7',
      'ii7','V7','I7 – VI7','ii7 – V7'
    ],
    scaleKey: 'lydianDominant',
    theory: 'O Jazz Blues expande cada dominante com substitutos de ii-V. O IVm7 no compasso 6 (IVm7 em vez de IV7) é o "back-cycling" clássico. O turnaround I7–VI7–ii7–V7 (compassos 9–12) permite modulação e diálogo entre os músicos. Sobre o V7, a escala alterada ou lídio dominante são as escolhas de bebop.'
  }
}

const BAR_COLORS = {
  'I7': '#60a5fa', 'Im7': '#60a5fa',
  'IV7': '#c084fc', 'IVm7': '#c084fc',
  'V7': '#f472b6', 'V7(b9)': '#f472b6',
  'VI7': '#818cf8', 'ii7': '#818cf8',
  'I7 – VI7': '#60a5fa', 'ii7 – V7': '#818cf8'
}

const CHORD_ROOTS = {
  'C': {
    'I7': ['C7','C'], 'Im7': ['Cm7','C'], 'IV7': ['F7','F'], 'IVm7': ['Fm7','F'],
    'V7': ['G7','G'], 'V7(b9)': ['G7','G'], 'VI7': ['A7','A'],
    'ii7': ['Dm7','D'], 'I7 – VI7': ['C7','C'], 'ii7 – V7': ['Dm7','D']
  }
}

export default function JazzBlues() {
  const [styleKey, setStyleKey] = useState('texas')
  const [root, setRoot] = useState('A')
  const { markLesson, isComplete } = useProgress()

  const style = PROGRESSIONS[styleKey]

  const scaleNotes = useMemo(() => buildScale(root, style.scaleKey), [root, style.scaleKey])

  const playBarChord = async (barLabel, rootNote) => {
    // Derive a chord to play from bar label
    let chordKey = '7'
    if (barLabel.includes('m7b5')) chordKey = 'm7b5'
    else if (barLabel.startsWith('IVm') || barLabel.startsWith('Im')) chordKey = 'min7'
    else if (barLabel.includes('ii7') || barLabel.endsWith('ii7')) chordKey = 'min7'
    else if (barLabel.includes('V7')) chordKey = '7'
    else if (barLabel.includes('VI7')) chordKey = '7'
    const pitches = chordWithOctaves(rootNote || root, chordKey, 4)
    await playChord(pitches, 1.0)
  }

  // Map roman numeral offsets to actual notes from root
  const OFFSETS = { 'I': 0, 'II': 2, 'III': 4, 'IV': 5, 'V': 7, 'VI': 9, 'VII': 11 }
  const PITCH_ORDER = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
  const rootIdx = PITCH_ORDER.indexOf(root)

  function barToNote(bar) {
    const m = bar.match(/^(I{1,3}|IV|V{1,2}I{0,1}|VI{0,1}|VII|ii)/)
    if (!m) return root
    const roman = m[1].toUpperCase()
    const off = OFFSETS[roman] ?? 0
    return PITCH_ORDER[(rootIdx + off) % 12]
  }

  return (
    <div>
      <PageHeader
        chip="Jazz & Blues"
        title="Harmonia de Jazz & Blues"
        description="Dos 12 compassos do Delta ao chorus bebop do Bird. Todos os estilos, com a progressão visual, a escala recomendada e a teoria por trás."
      />

      <Section title="1. A progressão de 12 compassos">
        <TheoryBlock>
          <Step n={1}>
            <p>
              O <b>12-bar blues</b> é a forma mais influente da música popular ocidental.
              I, IV e V: três acordes, 12 compassos, infinitas interpretações.
              De Robert Johnson ao bebop de Charlie Parker, a forma é a mesma — o que muda é a harmonia interior.
            </p>
          </Step>
          <Step n={2}>
            <p>
              No blues clássico, todos os acordes são <b>dominantes (X7)</b> — isso cria tensão constante
              e é o que dá o "sabor" característico. No jazz, cada acorde é expandido com ii-V e substituições.
            </p>
          </Step>
          <Step n={3}>
            <p>
              Selecione um estilo abaixo, clique em cada compasso para ouvir o acorde, e use a escala recomendada sobre o braço do violão.
            </p>
          </Step>
        </TheoryBlock>
      </Section>

      {/* Style selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(PROGRESSIONS).map(([key, val]) => (
          <Pill
            key={key}
            active={styleKey === key}
            tone={key === 'jazzBlues' ? 'emerald' : key === 'texas' ? 'amber' : key === 'minorBlues' ? 'coral' : 'emerald'}
            onClick={() => setStyleKey(key)}
          >
            {val.label}
          </Pill>
        ))}
      </div>

      <Section
        title={style.label}
        action={
          <CompleteToggle
            done={isComplete('jazz-blues', styleKey)}
            onClick={() => markLesson('jazz-blues', styleKey)}
          />
        }
      >
        <div className="card p-4 mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {style.artists.map((a) => (
              <span key={a} className={`chip ${style.chip}`}>{a}</span>
            ))}
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{style.desc}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <NotePicker value={root} onChange={setRoot} label="Tonalidade" />
        </div>

        {/* 12-bar grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {style.bars.map((bar, i) => {
            const noteForBar = barToNote(bar)
            const bgColor = bar.includes('I7') || bar.includes('Im7')
              ? '#60a5fa'
              : bar.includes('IV')
              ? '#c084fc'
              : bar.includes('V7') || bar.includes('ii7 – V7')
              ? '#f472b6'
              : '#818cf8'

            return (
              <button
                key={i}
                onClick={() => playBarChord(bar, noteForBar)}
                className="bar-cell p-3 text-center"
                style={{
                  background: `${bgColor}18`,
                  border: `1px solid ${bgColor}35`,
                  color: bgColor
                }}
                title={`Compasso ${i + 1}: ${bar} (${noteForBar})`}
              >
                <div className="text-xs opacity-60 mb-0.5">C.{i + 1}</div>
                <div className="font-bold text-sm">{bar}</div>
                <div className="text-xs opacity-70 mt-0.5">{noteForBar}</div>
              </button>
            )
          })}
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--text-subtle)' }}>Clique em cada compasso para ouvir o acorde.</p>

        {/* Scale on fretboard */}
        <div>
          <h4 className="text-sm uppercase tracking-wider mb-2" style={{ color: 'var(--text-subtle)' }}>
            Escala recomendada: {root} {SCALE_LABELS[style.scaleKey]}
          </h4>
          <Fretboard frets={15} highlightedNotes={scaleNotes} rootNote={root} />
        </div>
      </Section>

      {/* Theory deep-dive */}
      <Section title={`Teoria: ${style.label}`}>
        <TheoryBlock>
          <p>{style.theory}</p>
        </TheoryBlock>
      </Section>

      <Section title="2. Conceitos avançados de jazz harmony">
        <TheoryBlock>
          <div className="space-y-4">
            <div>
              <div className="font-bold text-accent-emerald mb-1">ii–V–I — A cadência fundamental</div>
              <p>
                O movimento Xm7 → X7 → XM7 resolve por quartas. O ii prepara, o V tensiona, o I resolve.
                Em Dó: Dm7 → G7 → CM7. É a frase gramatical básica do jazz. 80% das músicas de jazz
                são compostas quase inteiramente de ii-V-Is em diferentes tonalidades.
              </p>
            </div>
            <div>
              <div className="font-bold text-accent-amber mb-1">Tritone Substitution — Substituição de trítono</div>
              <p>
                O G7 pode ser substituído por Db7 — a distância entre eles é um trítono (6 semitons).
                Eles compartilham as mesmas notas de tensão (3ª e 7ª trocam de posição).
                O Db7 resolve para Dó com movimento cromático no baixo (Db → C), criando suavidade.
              </p>
            </div>
            <div>
              <div className="font-bold text-accent-coral mb-1">Back-cycling — Preparando dominantes</div>
              <p>
                Para chegar ao G7 com mais tensão, adicione D7 antes (pois D7 → G7 é um ii-V).
                Você pode continuar: A7 → D7 → G7 → C. Isso é "back-cycling" — uma cadeia de
                dominantes secundários, cada um resolvendo uma quarta acima.
              </p>
            </div>
            <div>
              <div className="font-bold mb-1" style={{ color: '#c7d2fe' }}>Escala Alterada sobre V7</div>
              <p>
                O dominante com todas as alterações (b9, #9, #11, b13) pede a escala alterada.
                Atalho: toque a menor melódica um semitom acima da raiz do dominante.
                G7alt → escala Ab menor melódica. O cromatismo e as tensões criam a tensão máxima
                que o bebop precisa antes de resolver no I.
              </p>
            </div>
          </div>
        </TheoryBlock>
      </Section>
      <LessonFooter moduleId="jazz-blues" />
    </div>
  )
}
