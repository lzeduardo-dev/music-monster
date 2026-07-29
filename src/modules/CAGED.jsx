import { useMemo, useState } from "react";
import {
  PageHeader,
  Section,
  NotePicker,
  TheoryBlock,
  Step,
  ChordDiagram,
} from "../components/Common.jsx";
import Fretboard from "../components/Fretboard.jsx";
import { buildChord, noteIndex, noteName } from "../lib/theory.js";
import { playChord } from "../lib/audio.js";
import { useProgress } from "../context/ProgressContext.jsx";

import LessonFooter from '../components/LessonFooter.jsx'
import CompleteToggle from '../components/CompleteToggle.jsx'
// CAGED shapes for C major as reference.
// positions: [E6, A5, D4, G3, B2, e1] — -1=muted, 0=open, n=absolute fret
const CAGED_SHAPES_C = [
  {
    id: "C",
    label: "Forma C",
    color: "#3b82f6",
    rootString: "A (5ª corda)",
    neckZone: "Casa 0–3",
    desc: "A forma aberta do acorde de C. A tônica fica na corda A (3ª casa).",
    positions: [-1, 3, 2, 0, 1, 0],
    startFret: 1,
    openStrings: [3, 5], // G e e strings (index 3 and 5) são abertas
    tip: "Difícil de barre, mas perfeita para voicings abertos e improvisação nas casas 1–4.",
  },
  {
    id: "A",
    label: "Forma A",
    color: "#c084fc",
    rootString: "A (5ª corda)",
    neckZone: "Casa 3–5",
    desc: "A forma A em barre. Tônica continua na corda A, agora na 3ª casa.",
    positions: [-1, 3, 5, 5, 5, 3],
    startFret: 3,
    barre: { fret: 3, from: 1, to: 5 },
    tip: "Barre mais fácil que o formato E. Dedilhar as três cordas do meio (D, G, B) na 5ª casa.",
  },
  {
    id: "G",
    label: "Forma G",
    color: "#818cf8",
    rootString: "E (6ª e 1ª corda)",
    neckZone: "Casa 5–8",
    desc: "Forma do acorde G aberto transposto. Tônica nas cordas E baixa e E alta.",
    positions: [8, 7, 5, 5, 5, 8],
    startFret: 5,
    tip: "A forma G é esticada (3 casas de stretch). Muito usada em fragmentos parciais no blues.",
  },
  {
    id: "E",
    label: "Forma E",
    color: "#a78bfa",
    rootString: "E (6ª corda)",
    neckZone: "Casa 7–10",
    desc: "O barre chord mais famoso. Forma do acorde E aberto em com pestana. Tônica na corda mais grave.",
    positions: [8, 10, 10, 9, 8, 8],
    startFret: 8,
    barre: { fret: 8, from: 0, to: 5 },
    tip: "O barre chord clássico. Dedos 2, 3, 4 nas cordas A, D, G na 10ª casa.",
  },
  {
    id: "D",
    label: "Forma D",
    color: "#f472b6",
    rootString: "D (4ª corda)",
    neckZone: "Casa 10–13",
    desc: "Forma do D aberto transposto. Tônica na corda D (10ª casa).",
    positions: [-1, -1, 10, 12, 13, 12],
    startFret: 10,
    tip: "Menos usada como acorde completo, mas muito útil para solos e voicings de 4 cordas.",
  },
];

// Compute CAGED positions for a given root
function transposeShape(shape, rootNote) {
  const cOffset = noteIndex("C");
  const targetOffset = noteIndex(rootNote);
  const semitones = (targetOffset - cOffset + 12) % 12;

  const newPositions = shape.positions.map((p) => {
    if (p === -1 || p === 0) return p;
    return p + semitones;
  });
  const newStartFret = Math.max(1, shape.startFret + semitones);
  const newBarre = shape.barre
    ? { ...shape.barre, fret: shape.barre.fret + semitones }
    : undefined;

  return {
    ...shape,
    positions: newPositions,
    startFret: newStartFret,
    barre: newBarre,
  };
}

export default function CAGED() {
  const [root, setRoot] = useState("C");
  const [activeShape, setActiveShape] = useState("C");
  const { markLesson, isComplete } = useProgress();

  const shapes = useMemo(
    () => CAGED_SHAPES_C.map((s) => transposeShape(s, root)),
    [root]
  );

  const currentShape = shapes.find((s) => s.id === activeShape) ?? shapes[0];
  const chordNotes = useMemo(() => buildChord(root, "maj"), [root]);

  return (
    <div>
      <PageHeader
        chip="Sistema CAGED"
        title="O Sistema CAGED"
        description="As cinco formas de acorde maior que cobrem todo o braço — o mapa completo do violão e da guitarra."
      />

      {/* ── O que é o CAGED ───────────────────────────────────────────── */}
      <Section title="O que é o sistema CAGED?">
        <TheoryBlock>
          <Step n={1}>
            <p>
              <b>CAGED</b> é um sistema que mostra como qualquer acorde maior
              pode ser tocado em <b>5 posições diferentes</b>
              ao longo do braço, cada uma derivada de uma das 5 formas abertas:{" "}
              <b>C, A, G, E e D</b>.
            </p>
          </Step>
          <Step n={2}>
            <p>
              Cada forma tem a <b>tônica (raiz) em uma corda diferente</b>: a
              forma E e G têm raiz na corda E baixa; a forma C e A têm raiz na
              corda A; a forma D tem raiz na corda D.
            </p>
          </Step>
          <Step n={3}>
            <p>
              As 5 formas se encadeiam pelo braço — a última casa de uma forma é
              a primeira casa da próxima. Dominando esse mapa, você nunca fica
              "perdido" no braço.
            </p>
          </Step>
          <Step n={4}>
            <p>
              Além de acordes, o CAGED define as{" "}
              <b>regiões de escala e arpejo</b> para improvisação — cada forma
              tem uma "caixa" de pentatônica e de escala maior associada.
            </p>
          </Step>
        </TheoryBlock>

        <div className="flex justify-end mt-3">
          <CompleteToggle
            done={isComplete("caged", "concept")}
            onClick={() => markLesson("caged", "concept")}
          />
        </div>
      </Section>

      {/* ── Seletor de tônica ─────────────────────────────────────────── */}
      <div className="card p-4 mb-8 flex flex-wrap items-center gap-4">
        <NotePicker value={root} onChange={setRoot} label="Tônica" />
        <div className="text-sm" style={{ color: "var(--text-muted)" }}>
          Notas de <b style={{ color: "var(--text-base)" }}>{root} maior</b>:{" "}
          <span style={{ color: "#60a5fa", fontWeight: 600 }}>
            {buildChord(root, "maj")
              .map((i) => noteName(i))
              .join(" – ")}
          </span>
        </div>
      </div>

      {/* ── As 5 formas ───────────────────────────────────────────────── */}
      <Section title="As 5 formas">
        {/* Shape selector tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CAGED_SHAPES_C.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveShape(s.id)}
              className="px-4 py-2 rounded-xl text-sm font-bold transition"
              style={{
                background:
                  activeShape === s.id ? s.color : "var(--ink-05)",
                color:
                  activeShape === s.id
                    ? s.id === "C" || s.id === "E"
                      ? "#fff"
                      : "#1a0628"
                    : "var(--text-muted)",
                border: `1px solid ${
                  activeShape === s.id ? s.color : "transparent"
                }`,
              }}
            >
              Forma {s.id}
            </button>
          ))}
        </div>

        {/* Active shape detail */}
        <div className="card p-6">
          <div className="flex flex-wrap gap-8 items-start">
            {/* Diagram */}
            <div>
              <ChordDiagram
                name={`${root} — Forma ${currentShape.id}`}
                subtitle={currentShape.neckZone}
                positions={currentShape.positions}
                startFret={currentShape.startFret}
                barre={currentShape.barre}
              />
              <button
                className="btn btn-primary mt-4 w-full text-xs"
                onClick={() => {
                  const openNotes = [4, 9, 2, 7, 11, 4];
                  const notes = currentShape.positions
                    .map((p, i) => {
                      if (p === -1) return null;
                      const fret = p === 0 ? 0 : p;
                      const oct = fret >= 12 ? 5 : 4;
                      return `${noteName((openNotes[i] + fret) % 12)}${oct}`;
                    })
                    .filter(Boolean);
                  playChord(notes, 1.6);
                }}
              >
                ▶ Tocar forma {currentShape.id}
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-[200px] space-y-4">
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                  style={{
                    background: `${currentShape.color}20`,
                    color: currentShape.color,
                  }}
                >
                  {currentShape.label}
                </span>
              </div>
              <p style={{ color: "var(--text-muted)" }}>{currentShape.desc}</p>
              <div className="space-y-1">
                <div
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-ultra)" }}
                >
                  Raiz na corda
                </div>
                <div
                  className="font-semibold"
                  style={{ color: "var(--text-base)" }}
                >
                  {currentShape.rootString}
                </div>
              </div>
              <div
                className="p-3 rounded-xl text-sm"
                style={{
                  background: `${currentShape.color}10`,
                  border: `1px solid ${currentShape.color}30`,
                  color: "var(--text-muted)",
                }}
              >
                💡 {currentShape.tip}
              </div>
              <button
                className={`btn ${
                  isComplete("caged", currentShape.id.toLowerCase() + "_shape")
                    ? "btn-ghost"
                    : "btn-primary"
                }`}
                onClick={() =>
                  markLesson("caged", currentShape.id.toLowerCase() + "_shape")
                }
              >
                {isComplete("caged", currentShape.id.toLowerCase() + "_shape")
                  ? `✓ Forma ${currentShape.id} concluída`
                  : `Marcar Forma ${currentShape.id} concluída`}
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Todas as 5 formas juntas ────────────────────────────────── */}
      <Section title="As 5 formas em sequência">
        <TheoryBlock>
          <p>
            As formas se encadeiam ao longo do braço. Para <b>{root} maior</b>,
            elas cobrem o braço do início ao fim. Note como o fim de uma forma
            "toca" o início da seguinte:
          </p>
        </TheoryBlock>
        <div className="mt-4 flex flex-wrap gap-6 justify-start">
          {shapes.map((s) => (
            <div
              key={s.id}
              onClick={() => setActiveShape(s.id)}
              className="cursor-pointer hover:scale-105 transition-transform"
              style={{ opacity: activeShape === s.id ? 1 : 0.65 }}
            >
              <ChordDiagram
                name={`Forma ${s.id}`}
                positions={s.positions}
                startFret={s.startFret}
                barre={s.barre}
              />
              <div
                className="text-center text-xs mt-2 font-bold"
                style={{ color: s.color }}
              >
                {s.neckZone}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Notas do acorde no braço ──────────────────────────────────── */}
      <Section title={`Mapa completo de ${root} maior no braço`}>
        <TheoryBlock>
          <p>
            O braço abaixo mostra <b>todas as posições das notas</b> do acorde
            de {root} maior. As regiões CAGED são as "ilhas" de concentração
            dessas notas — é onde você toca cada forma.
          </p>
        </TheoryBlock>
        <div className="mt-4">
          <Fretboard frets={17} highlightedNotes={chordNotes} rootNote={root} />
        </div>
      </Section>

      {/* ── Como usar na prática ──────────────────────────────────────── */}
      <Section title="Como usar o CAGED na prática">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "Improvise por regiões",
              text: 'Cada forma CAGED define uma "caixa" de escala pentatônica. Aprenda a pentatônica em cada forma e você terá 5 caixas de improvisação conectadas.',
              color: "#3b82f6",
            },
            {
              title: "Mude de posição suavemente",
              text: 'Em vez de saltar aleatoriamente pelo braço, use o CAGED para "escoregar" de uma forma para a próxima. O mapa se torna intuitivo.',
              color: "#c084fc",
            },
            {
              title: "Arpejos seguem o mesmo mapa",
              text: "Os arpejos (tocar as notas do acorde individualmente) seguem exatamente o formato CAGED. Aprenda os 5 arpejos e você tem um vocabulário solo completo.",
              color: "#818cf8",
            },
            {
              title: "Aplique em todos os acordes",
              text: "O mesmo sistema vale para acordes menores (forma Em, Am, Dm, Gm, Cm), dominantes e qualquer qualidade — só mudam alguns dedos.",
              color: "#f472b6",
            },
          ].map((tip) => (
            <div
              key={tip.title}
              className="card p-5"
              style={{ borderLeft: `3px solid ${tip.color}` }}
            >
              <div className="font-bold mb-2" style={{ color: tip.color }}>
                {tip.title}
              </div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {tip.text}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <LessonFooter moduleId="caged" />
    </div>
  );
}
