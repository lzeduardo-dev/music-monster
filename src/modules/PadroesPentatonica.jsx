import { useState, useRef, useEffect, useMemo } from "react";
import {
  PageHeader,
  Section,
  NotePicker,
  TheoryBlock,
  Step,
} from "../components/Common.jsx";
import Fretboard from "../components/Fretboard.jsx";
import { buildScale, needsFlats, noteIndex } from "../lib/theory.js";
import { playNote } from "../lib/audio.js";
import { useProgress } from "../context/ProgressContext.jsx";

import LessonFooter from "../components/LessonFooter.jsx";
import CompleteToggle from '../components/CompleteToggle.jsx'
// ─── Pentatonic box ──────────────────────────────────────────────────────────
// Box 1 (minor) at the root position. Returns array of pitches ascending.
// For a root at semitone R, box 1 spans 2 frets per string starting at R on the 6th string.
// Pentatonic minor degrees (semitone): 0, 3, 5, 7, 10

// We'll build pitches by computing the ascending pentatonic-minor sequence over ~2 octaves
function buildBoxPitches(root) {
  const r = noteIndex(root);
  const NAMES = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const DEGREES = [0, 3, 5, 7, 10];
  // 12 notes over 2 octaves of pentatonic minor: A C D E G A C D E G A C
  const pitches = [];
  for (let oct = 0; oct < 3; oct++) {
    for (const d of DEGREES) {
      pitches.push({
        semi: (r + d) % 12,
        octave: 3 + oct,
        name: `${NAMES[(r + d) % 12]}${3 + oct + (r + d >= 12 ? 1 : 0)}`,
      });
    }
  }
  return pitches.slice(0, 12);
}

// ─── Patterns (extracted from Daniel Bertamini — Padrões na Pentatônica) ──────
// Each pattern: name, description, subdivision (per beat), groupSize, sequence
// Sequence is an array of degree indices (0..11) from the box pitches array,
// where each index corresponds to a chronological note to play.

const PATTERNS = [
  {
    id: "col_4",
    name: "Colcheia/Semicolcheia — 4 notas",
    description:
      'Agrupamentos de 4 notas ascendentes (sequencial direto). É a base do "running scales" — corrida sobre os graus da pentatônica.',
    subdiv: 4,
    groupSize: 4,
    sequence: [0, 1, 2, 3, 1, 2, 3, 4, 2, 3, 4, 5, 3, 4, 5, 6],
  },
  {
    id: "col_3",
    name: "Colcheia/Semicolcheia — 3 notas",
    description:
      'Agrupamentos de 3 notas. Cria uma sensação de "rolo" e quebra o ritmo binário, ótimo para frases cíclicas.',
    subdiv: 4,
    groupSize: 3,
    sequence: [0, 1, 2, 1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6, 5, 6, 7],
  },
  {
    id: "tercina_3",
    name: "Tercina/Sextina — 3 notas",
    description:
      "Tercinas em grupos de 3 — cada grupo cabe exatamente em um tempo. Sextinas (6 sobre 1 tempo) intensificam o efeito.",
    subdiv: 3,
    groupSize: 3,
    sequence: [
      0, 1, 2, 1, 2, 3, 2, 3, 4, 3, 4, 5, 4, 5, 6, 5, 6, 7, 6, 7, 8, 7, 8, 9,
    ],
  },
  {
    id: "tercina_4",
    name: "Tercina — 4 notas",
    description:
      "Tercinas com agrupamento de 4 notas. O grupo de 4 sobre subdivisão de 3 gera deslocamento rítmico — sensação de polirritmia 4:3.",
    subdiv: 3,
    groupSize: 4,
    sequence: [0, 1, 2, 3, 1, 2, 3, 4, 2, 3, 4, 5, 3, 4, 5, 6],
  },
  {
    id: "nao_seq_4",
    name: "Não sequencial — 4 notas",
    description:
      'Em vez de subir 1-2-3-4, alterna ordem (ex: 1-3-2-4). Quebra a previsibilidade e soa mais "musical".',
    subdiv: 4,
    groupSize: 4,
    sequence: [0, 2, 1, 3, 1, 3, 2, 4, 2, 4, 3, 5, 3, 5, 4, 6],
  },
  {
    id: "col_6",
    name: "Colcheia — 6 notas",
    description:
      "Grupos de 6 notas em colcheias. Ideal para frases longas em tempos rápidos — pega 6 graus consecutivos da pentatônica.",
    subdiv: 4,
    groupSize: 6,
    sequence: [
      0, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6, 7, 3, 4, 5, 6, 7, 8,
    ],
  },
  {
    id: "cinco_sobre",
    name: "5 sobre ritmo",
    description:
      'Quintetos (5 notas por agrupamento) sobre qualquer subdivisão. Cria polirritmia 5:4 — soa "fora do compasso" mas resolve no próximo ciclo.',
    subdiv: 4,
    groupSize: 5,
    sequence: [0, 1, 2, 3, 4, 1, 2, 3, 4, 5, 2, 3, 4, 5, 6, 3, 4, 5, 6, 7],
  },
  {
    id: "salto",
    name: "Com salto (skip)",
    description:
      'Alterna entre graus distantes — pula 1 grau a cada nota. Cria intervalos maiores e fraseado mais "guitarrístico" (à la Eric Johnson).',
    subdiv: 4,
    groupSize: 4,
    sequence: [0, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7, 9],
  },
  {
    id: "tercina_6",
    name: "Tercina/Sextina — 6 notas",
    description:
      "Sextinas (6 notas por tempo) em grupos descendentes/ascendentes. Frases velozes que cobrem grande região do braço.",
    subdiv: 6,
    groupSize: 6,
    sequence: [
      0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1,
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function PadroesPentatonica() {
  const [root, setRoot] = useState("A");
  const [patternId, setPatternId] = useState("col_4");
  const [bpm, setBpm] = useState(80);
  const [playing, setPlaying] = useState(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState(null);
  const { markLesson, isComplete } = useProgress();

  const timerRef = useRef(null);
  const stepRef = useRef(0);

  const pattern = PATTERNS.find((p) => p.id === patternId);
  const boxPitches = useMemo(() => buildBoxPitches(root), [root]);
  const scaleNotes = useMemo(() => buildScale(root, "pentatonicMinor"), [root]);

  const stop = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setPlaying(false);
    setActiveNoteIdx(null);
    stepRef.current = 0;
  };

  const start = () => {
    setPlaying(true);
    stepRef.current = 0;
    const interval = (60 / bpm / pattern.subdiv) * 1000;
    timerRef.current = setInterval(() => {
      const step = stepRef.current % pattern.sequence.length;
      const noteIdx = pattern.sequence[step];
      const pitch = boxPitches[noteIdx];
      if (pitch) {
        try {
          playNote(pitch.name, 0.18);
        } catch {}
        setActiveNoteIdx(noteIdx);
      }
      stepRef.current++;
    }, interval);
  };

  useEffect(() => {
    if (playing) {
      stop();
      start();
    }
    // eslint-disable-next-line
  }, [bpm, patternId, root]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  return (
    <div>
      <PageHeader
        chip="Domínio"
        title="Padrões na Pentatônica"
        description="Os padrões são os pilares da improvisação criativa. Quando a parte mecânica (escalas) já está dominada, são os padrões e fraseado que transformam corridas de escala em música."
      />

      {/* ── Teoria base ────────────────────────────────────────────────── */}
      <Section title="1. Por que padrões importam?">
        <TheoryBlock>
          <Step>
            <p>
              Dividimos o improviso em duas partes: a <b>mecânica</b> (escalas e
              tonalidades) e a <b>criativa </b>
              (motivos, padrões e fraseado). A pentatônica é a fundação, mas
              tocá-la de cabo a rabo só sobe e desce — som de exercício. É o{" "}
              <b>padrão rítmico</b> aplicado sobre ela que vira frase musical.
            </p>
          </Step>
          <Step>
            <p>
              Um padrão é uma <b>fórmula de agrupamento</b>: pega N notas
              consecutivas da escala, toca-as com um agrupamento rítmico
              específico, depois "anda" 1 grau e repete. Variar o N (3, 4, 5, 6)
              e o ritmo (colcheia, tercina, sextina) gera as 9 famílias abaixo.
            </p>
          </Step>
          <Step>
            <p>
              <b>Como praticar</b>: pegue UM padrão por dia. Toque devagar
              (60–80 BPM) com metrônomo, suba na escala, desça invertendo, e
              quando dominar acelere. Em 2 semanas você tem 7 vocabulários novos
              para usar em qualquer solo.
            </p>
          </Step>
        </TheoryBlock>
      </Section>

      {/* ── Player ──────────────────────────────────────────────────────── */}
      <Section title={`2. ${pattern.name}`}>
        {/* Controls */}
        <div className="card p-4 mb-4">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <NotePicker value={root} onChange={setRoot} label="Tônica" />
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <button
                onClick={() => (playing ? stop() : start())}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: playing
                    ? "rgba(239,68,68,0.12)"
                    : "rgba(59,130,246,0.12)",
                  border: `1.5px solid ${
                    playing ? "rgba(239,68,68,0.35)" : "rgba(59,130,246,0.35)"
                  }`,
                  color: playing ? "#f87171" : "#60a5fa",
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {playing ? "■" : "▶"}
              </button>
              <div style={{ minWidth: 56 }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: "var(--text-base)",
                    lineHeight: 1,
                  }}
                >
                  {bpm}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-ultra)" }}>
                  BPM
                </div>
              </div>
              <input
                type="range"
                min={40}
                max={180}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                style={{
                  flex: 1,
                  minWidth: 100,
                  accentColor: "#3b82f6",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

          {/* Pattern selector */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPatternId(p.id)}
                style={{
                  padding: "5px 11px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  background:
                    patternId === p.id
                      ? "rgba(59,130,246,0.18)"
                      : "var(--ink-03)",
                  color: patternId === p.id ? "#60a5fa" : "var(--text-muted)",
                  border: `1px solid ${
                    patternId === p.id
                      ? "rgba(59,130,246,0.4)"
                      : "var(--ink-08)"
                  }`,
                  transition: "all 0.15s",
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern description */}
        <div
          className="card p-4 mb-4"
          style={{ borderLeft: "3px solid #3b82f6" }}
        >
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 250 }}>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {pattern.description}
              </p>
            </div>
            <div style={{ display: "flex", gap: 16, alignSelf: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{ fontSize: 22, fontWeight: 800, color: "#a78bfa" }}
                >
                  {pattern.groupSize}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "var(--text-ultra)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Notas/grupo
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{ fontSize: 22, fontWeight: 800, color: "#f472b6" }}
                >
                  {pattern.subdiv}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "var(--text-ultra)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Subdiv/tempo
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sequence visualization */}
        <div className="card p-4 mb-4 overflow-x-auto">
          <div
            style={{
              fontSize: 10,
              color: "var(--text-ultra)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 8,
            }}
          >
            Sequência ({pattern.sequence.length} notas)
          </div>
          <div
            style={{
              display: "flex",
              gap: 4,
              minWidth: "fit-content",
              flexWrap: "wrap",
            }}
          >
            {pattern.sequence.map((noteIdx, i) => {
              const isGroupStart = i % pattern.groupSize === 0;
              const isActive =
                playing &&
                noteIdx === activeNoteIdx &&
                (stepRef.current - 1) % pattern.sequence.length === i;
              return (
                <div
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    background: isActive ? "#3b82f6" : "rgba(59,130,246,0.08)",
                    color: isActive ? "#fff" : "#60a5fa",
                    border: `1px solid ${
                      isGroupStart
                        ? "rgba(167,139,250,0.5)"
                        : "rgba(59,130,246,0.15)"
                    }`,
                    marginLeft: isGroupStart && i > 0 ? 6 : 0,
                    transition: "background 0.05s",
                  }}
                >
                  {noteIdx + 1}
                </div>
              );
            })}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--text-ultra)" }}>
            Cada número = grau da pentatônica menor (1=tônica, 2=b3, 3=4ª, 4=5ª,
            5=b7, depois oitava). As bordas roxas marcam o início de cada grupo.
          </p>
        </div>

        {/* Fretboard */}
        <Fretboard
          frets={15}
          highlightedNotes={scaleNotes}
          rootNote={root}
          useFlats={needsFlats(root)}
          showNoteNames
        />

        <div className="flex justify-end mt-4">
          <CompleteToggle
            done={isComplete("penta_patterns", patternId)}
            onClick={() => markLesson("penta_patterns", patternId)}
          />
        </div>
      </Section>

      {/* ── Estratégia ──────────────────────────────────────────────────── */}
      <Section title="3. Estratégia de Estudo">
        <TheoryBlock>
          <Step>
            <p>
              <b>Semana 1–2</b>: Padrões 1, 2 e 6 (sequenciais). Constroem a
              base mecânica em colcheias e semicolcheias. Toque em 60 BPM,
              depois 80, depois 100.
            </p>
          </Step>
          <Step>
            <p>
              <b>Semana 3–4</b>: Padrões 3, 4 e 9 (tercinas). Trabalham a
              divisão ternária, fundamental para blues, shuffle e jazz. Atenção:
              a tercina precisa "respirar" — não acelere demais.
            </p>
          </Step>
          <Step>
            <p>
              <b>Semana 5+</b>: Padrões 5, 7 e 8 (não-sequenciais,
              polirrítmicos, com salto). Aqui você transforma o padrão em{" "}
              <b>frase musical</b>. Combine com a backing track no Laboratório
              de Improviso.
            </p>
          </Step>
        </TheoryBlock>
      </Section>
      <LessonFooter moduleId="penta_patterns" />
    </div>
  );
}
