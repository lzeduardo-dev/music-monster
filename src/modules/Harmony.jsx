import { useMemo, useState } from "react";
import {
  PageHeader,
  Section,
  NotePicker,
  TheoryBlock,
  Step,
  Pill,
} from "../components/Common.jsx";
import GuitarChordDiagram from "../components/GuitarChordDiagram.jsx";
import Fretboard from "../components/Fretboard.jsx";
import {
  buildChord,
  buildChordNotes,
  chordWithOctaves,
  diatonicTriads,
  needsFlats,
  CHORDS,
  noteIndex,
  noteName,
} from "../lib/theory.js";
import { playChord } from "../lib/audio.js";
import { useProgress } from "../context/ProgressContext.jsx";

import LessonFooter from '../components/LessonFooter.jsx'
import CompleteToggle from '../components/CompleteToggle.jsx'
const CHORD_KEYS = [
  "maj",
  "min",
  "dim",
  "aug",
  "maj7",
  "7",
  "min7",
  "m7b5",
  "dim7",
  "9",
  "maj9",
  "min9",
];

const CHORD_QUALITY_TABLE = [
  {
    key: "maj",
    symbol: "X",
    shortName: "Maior",
    formula: "1 – 3 – 5",
    example: "C – E – G",
    char: "Estável, brilhante. Base da tonalidade maior.",
  },
  {
    key: "min",
    symbol: "Xm",
    shortName: "Menor",
    formula: "1 – b3 – 5",
    example: "C – Eb – G",
    char: "Melancólico, escuro. Base da tonalidade menor.",
  },
  {
    key: "dim",
    symbol: "X°",
    shortName: "Diminuto",
    formula: "1 – b3 – b5",
    example: "C – Eb – Gb",
    char: "Tenso, instável. Quer resolver.",
  },
  {
    key: "aug",
    symbol: "X+",
    shortName: "Aumentado",
    formula: "1 – 3 – #5",
    example: "C – E – G#",
    char: "Misterioso, flutuante. Muito usado em jazz.",
  },
  {
    key: "maj7",
    symbol: "XM7",
    shortName: "7ª maior",
    formula: "1 – 3 – 5 – 7",
    example: "C – E – G – B",
    char: "Suave e rico. Tônica do jazz e bossa nova.",
  },
  {
    key: "7",
    symbol: "X7",
    shortName: "Dominante",
    formula: "1 – 3 – 5 – b7",
    example: "C – E – G – Bb",
    char: "Tenso, dominante. Resolve para a tônica.",
  },
  {
    key: "min7",
    symbol: "Xm7",
    shortName: "7ª menor",
    formula: "1 – b3 – 5 – b7",
    example: "C – Eb – G – Bb",
    char: "Suave e sombrio. Muito comum em funk e jazz.",
  },
  {
    key: "m7b5",
    symbol: "Xm7b5",
    shortName: "Meio-dim.",
    formula: "1 – b3 – b5 – b7",
    example: "C – Eb – Gb – Bb",
    char: "Meio-diminuto. Tensão jazz, ii de menor.",
  },
  {
    key: "dim7",
    symbol: "X°7",
    shortName: "Dim. 7ª",
    formula: "1 – b3 – b5 – bb7",
    example: "C – Eb – Gb – A",
    char: "Máxima tensão. Simétrico, passa-partout.",
  },
  {
    key: "9",
    symbol: "X9",
    shortName: "Nona dom.",
    formula: "1 – 3 – 5 – b7 – 9",
    example: "C – E – G – Bb – D",
    char: "Dominante com cor extra. Blues e jazz.",
  },
  {
    key: "maj9",
    symbol: "XM9",
    shortName: "Nona maior",
    formula: "1 – 3 – 5 – 7 – 9",
    example: "C – E – G – B – D",
    char: "Tônica exuberante. Jazz moderno, soul.",
  },
  {
    key: "min9",
    symbol: "Xm9",
    shortName: "Nona menor",
    formula: "1 – b3 – 5 – b7 – 9",
    example: "C – Eb – G – Bb – D",
    char: "Denso e velvety. Neo-soul, jazz fusão.",
  },
];

// Chord shapes: [E6, A5, D4, G3, B2, e1] — -1=muted, 0=open, n=absolute fret
// rootString: 6=E bass, 5=A, 4=D, 3=G — used for the string filter
const STRING_SHAPES = [
  {
    label: "Root na corda E (6ª)",
    rootString: 6,
    desc: 'Formato "E shape" — barre chord clássico. Tônica na corda mais grave.',
    shapes: [
      {
        name: "Maior (E shape)",
        subtitle: "Ex: barra na 5ª = A",
        positions: [5, 7, 7, 6, 5, 5],
        startFret: 5,
        barre: { fret: 5, from: 0, to: 5 },
      },
      {
        name: "Menor (Em shape)",
        subtitle: "Ex: barra na 5ª = Am",
        positions: [5, 7, 7, 5, 5, 5],
        startFret: 5,
        barre: { fret: 5, from: 0, to: 5 },
      },
      {
        name: "Dominante (E7 shape)",
        subtitle: "Ex: barra na 5ª = A7",
        positions: [5, 7, 5, 6, 5, 5],
        startFret: 5,
        barre: { fret: 5, from: 0, to: 5 },
      },
    ],
  },
  {
    label: "Root na corda A (5ª)",
    rootString: 5,
    desc: 'Formato "A shape" — o outro barre chord essencial. Tônica na 5ª corda.',
    shapes: [
      {
        name: "Maior (A shape)",
        subtitle: "Ex: barra na 3ª = C",
        positions: [-1, 3, 5, 5, 5, 3],
        startFret: 3,
        barre: { fret: 3, from: 1, to: 5 },
      },
      {
        name: "Menor (Am shape)",
        subtitle: "Ex: barra na 3ª = Cm",
        positions: [-1, 3, 5, 5, 4, 3],
        startFret: 3,
        barre: { fret: 3, from: 1, to: 5 },
      },
      {
        name: "Dominante (A7 shape)",
        subtitle: "Ex: barra na 3ª = C7",
        positions: [-1, 3, 5, 3, 5, 3],
        startFret: 3,
        barre: { fret: 3, from: 1, to: 5 },
      },
    ],
  },
  {
    label: "Root na corda D (4ª)",
    rootString: 4,
    desc: 'Formato "D shape" — acorde aberto movível. Tônica na 4ª corda.',
    shapes: [
      {
        name: "Maior (D shape)",
        subtitle: "D maior (corda solta)",
        positions: [-1, -1, 0, 2, 3, 2],
        startFret: 1,
      },
      {
        name: "Menor (Dm shape)",
        subtitle: "D menor (corda solta)",
        positions: [-1, -1, 0, 2, 3, 1],
        startFret: 1,
      },
      {
        name: "Dominante (D7 shape)",
        subtitle: "D7 (corda solta)",
        positions: [-1, -1, 0, 2, 1, 2],
        startFret: 1,
      },
    ],
  },
  {
    label: "Root na corda G (3ª)",
    rootString: 3,
    desc: "Shapes de 3 vozes nas cordas G-B-e. Ideais para chord melody e soloing com acordes embutidos.",
    shapes: [
      {
        name: "Maior (G shape)",
        subtitle: "Ex: 5ª casa = C",
        positions: [-1, -1, -1, 5, 5, 3],
        startFret: 3,
      },
      {
        name: "Menor (Gm shape)",
        subtitle: "Ex: 5ª casa = Cm",
        positions: [-1, -1, -1, 5, 4, 3],
        startFret: 3,
      },
      {
        name: "Dom. 7 (G7 shape)",
        subtitle: "Ex: 5ª casa = C7",
        positions: [-1, -1, -1, 5, 5, 6],
        startFret: 5,
      },
    ],
  },
];

export default function Harmony() {
  const [root, setRoot] = useState("C");
  const [chordKey, setChordKey] = useState("maj");
  const [inversion, setInversion] = useState(0);
  const [selectedString, setSelectedString] = useState(6);
  const { markLesson, isComplete } = useProgress();

  const chordNotes = useMemo(
    () => buildChord(root, chordKey),
    [root, chordKey]
  );
  const chordPitches = useMemo(
    () => chordWithOctaves(root, chordKey, 4),
    [root, chordKey]
  );

  const invertedPitches = useMemo(() => {
    const arr = [...chordPitches];
    for (let i = 0; i < inversion; i++) {
      const first = arr.shift();
      const m = first.match(/^([A-G][#b]?)(-?\d+)$/);
      arr.push(`${m[1]}${parseInt(m[2], 10) + 1}`);
    }
    return arr;
  }, [chordPitches, inversion]);

  const triads = useMemo(() => diatonicTriads(root), [root]);
  const bassNote = useMemo(() => {
    const m = invertedPitches[0]?.match(/^([A-G][#b]?)(-?\d+)$/);
    return m ? m[1] : root;
  }, [invertedPitches, root]);

  const qualityEntry = CHORD_QUALITY_TABLE.find((r) => r.key === chordKey);
  const chordSymbol = qualityEntry
    ? qualityEntry.symbol.replace("X", root)
    : root;
  const chordShortName = qualityEntry?.shortName ?? chordKey;
  const chordSymbolWithInv =
    inversion === 0 ? chordSymbol : `${chordSymbol}/${bassNote}`;
  const slashLabel = `${chordSymbolWithInv} - ${chordShortName}`;

  return (
    <div>
      <PageHeader
        chip="Harmonia"
        title="Tríades, Tétrades e Qualidades"
        description="Como notas se combinam em acordes, qualidades, inversões e como encontrar cada forma no braço."
      />

      {/* ── 1. Qualidades dos Acordes ──────────────────────────────────── */}
      <Section title="1. Qualidades dos Acordes">
        <TheoryBlock>
          <Step n={1}>
            <p>
              A <b>qualidade</b> de um acorde define o seu sabor harmônico —
              maior, menor, dominante, diminuto etc. Cada qualidade nasce de uma
              combinação específica de intervalos a partir da tônica.
            </p>
          </Step>
          <Step n={2}>
            <p>
              <b>Tríades</b> (3 notas) são o bloco fundamental; <b>tétrades</b>{" "}
              (4 notas) adicionam a 7ª e trazem cor jazzística. Extensões como a
              9ª enriquecem ainda mais sem mudar a função harmônica.
            </p>
          </Step>
        </TheoryBlock>

        <div className="mt-4 overflow-x-auto">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: "separate", borderSpacing: "0 4px" }}
          >
            <thead>
              <tr>
                {["Símbolo", "Nome", "Fórmula", "Ex. em C", "Caráter"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold"
                      style={{ color: "var(--text-ultra)" }}
                    >
                      {h}
                    </th>
                  )
                )}
                <th />
              </tr>
            </thead>
            <tbody>
              {CHORD_QUALITY_TABLE.map((row) => (
                <tr
                  key={row.key}
                  className="card"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setChordKey(row.key);
                    const pitches = chordWithOctaves("C", row.key, 4);
                    playChord(pitches, 1.2);
                  }}
                >
                  <td
                    className="px-3 py-2 rounded-l-xl font-mono font-bold"
                    style={{ color: "#60a5fa" }}
                  >
                    {row.symbol}
                  </td>
                  <td
                    className="px-3 py-2 font-semibold"
                    style={{ color: "var(--text-base)" }}
                  >
                    {CHORDS[row.key]?.name ?? row.key}
                  </td>
                  <td
                    className="px-3 py-2 font-mono text-xs"
                    style={{ color: "#c084fc" }}
                  >
                    {row.formula}
                  </td>
                  <td
                    className="px-3 py-2 font-mono text-xs"
                    style={{ color: "#f472b6" }}
                  >
                    {row.example}
                  </td>
                  <td
                    className="px-3 py-2 text-xs rounded-r-xl"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {row.char}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs mt-2" style={{ color: "var(--text-ultra)" }}>
            Clique em qualquer linha para ouvir o acorde em C.
          </p>
        </div>

        <div className="flex justify-end mt-3">
          <CompleteToggle
            done={isComplete("harmony", "chord_qualities")}
            onClick={() => markLesson("harmony", "chord_qualities")}
          />
        </div>
      </Section>

      {/* ── 2. Explorer de Acordes ─────────────────────────────────────── */}
      <Section
        title={`2. ${slashLabel}`}
        action={
          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              onClick={() => playChord(invertedPitches, 1.4)}
            >
              ▶ Tocar
            </button>
            <CompleteToggle
              done={isComplete("harmony", "triads")}
              onClick={() => markLesson("harmony", "triads")}
            />
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <NotePicker value={root} onChange={setRoot} />
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--text-subtle)" }}
            >
              Tipo
            </span>
            <div className="flex flex-wrap gap-1">
              {CHORD_KEYS.map((k) => (
                <button
                  key={k}
                  onClick={() => setChordKey(k)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold transition"
                  style={{
                    background:
                      chordKey === k ? "#c084fc" : "var(--ink-05)",
                    color: chordKey === k ? "#1a0628" : "var(--text-muted)",
                  }}
                >
                  {CHORDS[k]?.name ?? k}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--text-subtle)" }}
            >
              Inversão
            </span>
            <div className="flex gap-1">
              {[0, 1, 2, ...(chordNotes.length === 4 ? [3] : [])].map((i) => (
                <Pill
                  key={i}
                  active={inversion === i}
                  onClick={() => setInversion(i)}
                >
                  {i === 0 ? "Fund." : `${i}ª inv.`}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-4 mb-4">
          <div className="flex flex-wrap gap-6 items-start">
            {/* Chord diagram */}
            <div
              style={{
                border: "1px solid rgba(192,132,252,0.2)",
                borderRadius: 16,
                padding: "12px 10px",
                background: "rgba(192,132,252,0.04)",
              }}
            >
              <GuitarChordDiagram
                root={root}
                chordKey={chordKey}
                accentColor="#c084fc"
                width={130}
                height={168}
              />
            </div>

            {/* Note info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-3">
                {buildChordNotes(root, chordKey).map((n, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-lg text-sm font-bold"
                    style={{
                      background:
                        i === 0
                          ? "rgba(37,99,235,0.18)"
                          : "rgba(226,232,240,0.07)",
                      color: i === 0 ? "#3b82f6" : "#cbd5e1",
                      border: `1px solid ${
                        i === 0
                          ? "rgba(37,99,235,0.3)"
                          : "rgba(226,232,240,0.1)"
                      }`,
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>
              <div
                className="px-3 py-2 rounded-lg text-sm inline-block"
                style={{
                  background: "var(--ink-05)",
                  color: "var(--text-subtle)",
                }}
              >
                Baixo: <b style={{ color: "var(--text-base)" }}>{bassNote}</b> ·{" "}
                {inversion === 0
                  ? "estado fundamental"
                  : `${inversion}ª inversão`}
              </div>
              <div
                className="mt-3 text-[10px]"
                style={{ color: "var(--text-ultra)" }}
              >
                Os pontos indicam os dedos no braço. Cicle as posições pelos
                indicadores abaixo do diagrama.
              </div>
            </div>
          </div>
        </div>

        <Fretboard
          frets={15}
          highlightedNotes={chordNotes}
          rootNote={root}
          useFlats={needsFlats(root)}
        />
      </Section>
      <LessonFooter moduleId="harmony" />
    </div>
  );
}
