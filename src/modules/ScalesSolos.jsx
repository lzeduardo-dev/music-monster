import { useMemo, useState } from "react";
import {
  PageHeader,
  Section,
  NotePicker,
  TheoryBlock,
  Step,
  Pill,
} from "../components/Common.jsx";
import Fretboard from "../components/Fretboard.jsx";
import {
  buildScale,
  buildScaleNotes,
  scaleWithOctaves,
  indexesToNames,
  needsFlats,
  noteIndex,
  SCALE_LABELS,
} from "../lib/theory.js";
import { playSequence } from "../lib/audio.js";
import { useProgress } from "../context/ProgressContext.jsx";

import LessonFooter from "../components/LessonFooter.jsx";
import CompleteToggle from '../components/CompleteToggle.jsx'
const SCALES = [
  {
    key: "pentatonicMajor",
    label: "Pentatônica Maior",
    formula: "1 – 2 – 3 – 5 – 6",
    desc: 'Cinco notas, sem o 4º e 7º graus — quase sempre "soa certo". Usada em country, pop, rock melódico e blues feliz.',
    tips: [
      "Toque sobre progressões com I, IV e V maiores.",
      "Comece e termine na tônica para sentir a resolução.",
      "Experimente começar a melodia no 2º ou 6º grau para escapar do óbvio.",
    ],
  },
  {
    key: "pentatonicMinor",
    label: "Pentatônica Menor",
    formula: "1 – b3 – 4 – 5 – b7",
    desc: "A escala mais usada em rock e blues. Robusta, poderosa — pode tocar sobre I7, IV7 e V7 em blues sem errar.",
    tips: [
      "Toque com vibrato e bends na 4ª e 5ª casa do shape 1.",
      "Deslize entre dois shapes para criar frases maiores.",
      'Misture com a 3ª maior (fora da escala) para criar a "blue note vocal".',
    ],
  },
  {
    key: "blues",
    label: "Blues (Hexatônica)",
    formula: "1 – b3 – 4 – b5 – 5 – b7",
    desc: 'A pentatônica menor + a b5 (trítono / "blue note"). O b5 cria a tensão característica do blues. Eric Clapton, SRV e BB King usam esta escala como base de 90% dos solos.',
    tips: [
      "A b5 é uma nota de passagem — não fique nela por muito tempo.",
      "Toque a b5 antes da 5ª justa para um bend clássico de blues.",
      "Sobre o V7, acentue a b5 para reforçar a tensão antes da resolução.",
    ],
  },
  {
    key: "bluesMajor",
    label: "Blues Maior",
    formula: "1 – 2 – b3 – 3 – 5 – 6",
    desc: 'A versão feliz do blues. Tem a "blue note" (b3) mas também a 3ª maior — cria uma ambiguidade maior/menor que é a assinatura do R&B e soul clássico. T-Bone Walker e BB King a usavam muito.',
    tips: [
      "Alterne entre o b3 e o 3 natural com bends para criar tensão vocal.",
      "Perfeita sobre o I7 de um blues maior.",
      "Misture com a pentatônica menor para frases completas de blues.",
    ],
  },
];

// 5 shapes of A minor pentatonic (fret positions, strings E6=0..e1=5)
// Each string: [fret1, fret2]  — rootFrets: {stringIdx: fret}
const MINOR_PENTA_SHAPES = [
  {
    label: "Shape 1",
    fretLabel: "5ª–8ª casa",
    desc: "Posição raiz — origem de quase todo solo de rock e blues",
    tip: "Aprenda este shape de cor primeiro. A maioria dos solos clássicos começa aqui.",
    strings: [
      [5, 8],
      [5, 7],
      [5, 7],
      [5, 7],
      [5, 8],
      [5, 8],
    ],
    rootFrets: { 0: 5, 2: 7, 5: 5 },
  },
  {
    label: "Shape 2",
    fretLabel: "7ª–10ª casa",
    desc: "Conecta o Shape 1 ao Shape 3 — excelente para frases descendentes",
    tip: "Estenda um lick do Shape 1 deslizando para este shape na mesma corda.",
    strings: [
      [8, 10],
      [7, 10],
      [7, 10],
      [7, 9],
      [8, 10],
      [8, 10],
    ],
    rootFrets: { 2: 7, 4: 10 },
  },
  {
    label: "Shape 3",
    fretLabel: "9ª–13ª casa",
    desc: "Região do alto do braço — pouco explorada por iniciantes",
    tip: 'Misture com o Shape 4 para frases no "topo do braço".',
    strings: [
      [10, 12],
      [10, 12],
      [10, 12],
      [9, 12],
      [10, 13],
      [10, 12],
    ],
    rootFrets: { 1: 12, 4: 10 },
  },
  {
    label: "Shape 4",
    fretLabel: "12ª–15ª casa",
    desc: "Posição da oitava — a digitação é idêntica à do Shape 1",
    tip: "Note que este shape tem a mesma digitação que o Shape 1 — apenas uma oitava acima!",
    strings: [
      [12, 15],
      [12, 15],
      [12, 14],
      [12, 14],
      [13, 15],
      [12, 15],
    ],
    rootFrets: { 1: 12, 3: 14 },
  },
  {
    label: "Shape 5",
    fretLabel: "14ª–17ª casa",
    desc: "Fecha o ciclo e retorna ao Shape 1 uma oitava acima",
    tip: "O Shape 5 termina onde o Shape 1 começa (fret 17 = oitava do fret 5 para Am).",
    strings: [
      [15, 17],
      [15, 17],
      [14, 17],
      [14, 17],
      [15, 17],
      [15, 17],
    ],
    rootFrets: { 0: 17, 3: 14, 5: 17 },
  },
];

// Mini fretboard SVG for one pentatonic shape
function MiniShape({ shape }) {
  const { strings, rootFrets } = shape;
  const allFrets = strings.flat();
  const minF = Math.min(...allFrets);
  const maxF = Math.max(...allFrets);
  const numFrets = maxF - minF + 1;

  const CW = 26,
    CH = 14;
  const PL = 8,
    PR = 8,
    PT = 6,
    PB = 18;
  const svgW = numFrets * CW + PL + PR;
  const svgH = 6 * CH + PT + PB;

  // Display: top = e1 (str idx 5), bottom = E6 (str idx 0)
  const DISPLAY = [5, 4, 3, 2, 1, 0];
  const STRING_LABELS = ["e", "B", "G", "D", "A", "E"];

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      style={{ display: "block" }}
    >
      {/* String lines */}
      {DISPLAY.map((_, di) => {
        const y = PT + (di + 0.5) * CH;
        return (
          <line
            key={di}
            x1={PL}
            y1={y}
            x2={svgW - PR}
            y2={y}
            stroke="var(--ink-18)"
            strokeWidth={di === 0 ? 0.8 : di === 5 ? 1.8 : 1.1}
          />
        );
      })}
      {/* Fret numbers */}
      {Array.from({ length: numFrets }).map((_, fi) => (
        <text
          key={fi}
          x={PL + (fi + 0.5) * CW}
          y={svgH - 5}
          textAnchor="middle"
          fontSize={7.5}
          fill="var(--ink-25)"
          fontFamily="monospace"
        >
          {minF + fi}
        </text>
      ))}
      {/* Note dots */}
      {strings.map((frets, dataIdx) => {
        const di = DISPLAY.indexOf(dataIdx);
        const y = PT + (di + 0.5) * CH;
        return frets.map((fret) => {
          const isRoot = rootFrets[dataIdx] === fret;
          const x = PL + (fret - minF + 0.5) * CW;
          return (
            <g key={`${dataIdx}-${fret}`}>
              <circle
                cx={x}
                cy={y}
                r={6}
                fill={isRoot ? "#f472b6" : "#818cf8"}
                opacity={0.9}
              />
              {isRoot && (
                <circle
                  cx={x}
                  cy={y}
                  r={6}
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth={1.5}
                  opacity={0.6}
                />
              )}
            </g>
          );
        });
      })}
    </svg>
  );
}

export default function ScalesSolos() {
  const [root, setRoot] = useState("A");
  const [scaleIdx, setScaleIdx] = useState(1);
  const [shapeIdx, setShapeIdx] = useState(0);
  const [showBlueNote, setShowBlueNote] = useState(false);
  const { markLesson, isComplete } = useProgress();

  const sc = SCALES[scaleIdx];
  const scaleNotesBase = useMemo(
    () => buildScale(root, sc.key),
    [root, sc.key]
  );
  const scaleNotes = useMemo(() => {
    if (showBlueNote && sc.key === "pentatonicMinor") {
      const blueNote = (noteIndex(root) + 6) % 12;
      return [...new Set([...scaleNotesBase, blueNote])].sort((a, b) => a - b);
    }
    return scaleNotesBase;
  }, [scaleNotesBase, showBlueNote, sc.key, root]);

  const scalePitches = useMemo(
    () => scaleWithOctaves(root, sc.key, 4),
    [root, sc.key]
  );
  const noteNames = useMemo(() => {
    const base = buildScaleNotes(root, sc.key);
    if (showBlueNote && sc.key === "pentatonicMinor") {
      // Insert blue note (b5) into the spelled scale
      return indexesToNames(scaleNotes, needsFlats(root));
    }
    return base;
  }, [root, sc.key, scaleNotes, showBlueNote]);

  const canShowBlueNote = sc.key === "pentatonicMinor";

  return (
    <div>
      <PageHeader
        chip="Escalas"
        title="Pentatônicas & Blues"
        description="As ferramentas fundamentais para improvisar em rock, blues e pop. Dominar esses cinco shapes é suficiente para 80% dos solos."
      />

      {/* ── Section 1: Theory ───────────────────────────────────────────── */}
      <Section title="1. Por que as pentatônicas funcionam?">
        <TheoryBlock>
          <Step n={1}>
            <p>
              A escala maior tem 7 notas. A pentatônica retira as duas notas que
              geram mais tensão — a <b>4ª justa</b> e a <b>7ª maior</b>. O que
              sobra é um conjunto que encaixa suavemente sobre quase qualquer
              acorde do campo harmônico.
            </p>
          </Step>
          <Step n={2}>
            <p>
              A pentatônica <b>menor</b> retira a 2ª maior e a 6ª menor da
              escala menor natural. É mais escura e agressiva — por isso domina
              o rock e o blues elétrico.
            </p>
          </Step>
          <Step n={3}>
            <p>
              A <b>blue note</b> (b5) adicionada à pentatônica menor cria a
              escala blues — essa nota "errada" que soa certa é o coração da
              expressividade do blues.
            </p>
          </Step>
        </TheoryBlock>
      </Section>

      {/* ── Section 2: Scale explorer ────────────────────────────────────── */}
      <Section
        title={`${root} ${sc.label} — ${sc.formula}`}
        action={
          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              onClick={() => playSequence(scalePitches, 0.27)}
            >
              ▶ Tocar
            </button>
            <CompleteToggle
              done={isComplete("scales", sc.key)}
              onClick={() => markLesson("scales", sc.key)}
            />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3 mb-4">
          <NotePicker value={root} onChange={setRoot} />
          <div className="flex flex-wrap gap-1.5">
            {SCALES.map((s, i) => (
              <Pill
                key={s.key}
                active={scaleIdx === i}
                onClick={() => {
                  setScaleIdx(i);
                  setShowBlueNote(false);
                }}
              >
                {s.label}
              </Pill>
            ))}
          </div>
          {canShowBlueNote && (
            <button
              onClick={() => setShowBlueNote((v) => !v)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: showBlueNote
                  ? "rgba(244,114,182,0.2)"
                  : "var(--ink-05)",
                border: `1px solid ${
                  showBlueNote ? "#f472b660" : "var(--border-card)"
                }`,
                color: showBlueNote ? "#f472b6" : "var(--text-muted)",
              }}
            >
              {showBlueNote ? "● Blue Note ligada" : "○ + Blue Note"}
            </button>
          )}
        </div>

        <div className="card p-4 mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {noteNames.map((n, i) => {
              const blueNoteIdx =
                showBlueNote && canShowBlueNote
                  ? (noteIndex(root) + 6) % 12
                  : -1;
              const isBlue = blueNoteIdx >= 0 && scaleNotes[i] === blueNoteIdx;
              return (
                <div
                  key={i}
                  className="px-3 py-2 rounded-lg text-sm font-bold"
                  style={{
                    background: isBlue
                      ? "rgba(244,114,182,0.18)"
                      : i === 0
                      ? "rgba(37,99,235,0.18)"
                      : "rgba(226,232,240,0.07)",
                    color: isBlue ? "#f472b6" : i === 0 ? "#3b82f6" : "#cbd5e1",
                    border: `1px solid ${
                      isBlue
                        ? "#f472b640"
                        : i === 0
                        ? "rgba(37,99,235,0.3)"
                        : "rgba(226,232,240,0.1)"
                    }`,
                  }}
                >
                  {n}
                  {isBlue && (
                    <span className="ml-1 text-[10px] opacity-70">b5</span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {sc.desc}
          </p>
        </div>

        <div className="mb-4">
          <Fretboard
            frets={15}
            highlightedNotes={scaleNotes}
            rootNote={root}
            useFlats={needsFlats(root)}
          />
        </div>

        <div className="card p-4">
          <div
            className="text-sm font-semibold mb-2"
            style={{ color: "var(--text-base)" }}
          >
            Dicas práticas
          </div>
          <ul className="space-y-1.5">
            {sc.tips.map((t, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <span style={{ color: "#60a5fa" }}>→</span> {t}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Section 3: 5 Shapes ──────────────────────────────────────────── */}
      <Section
        title="2. Os 5 Shapes da Pentatônica Menor"
        action={
          <CompleteToggle
            done={isComplete("scales", "shapes_5")}
            onClick={() => markLesson("scales", "shapes_5")}
          />
        }
      >
        <TheoryBlock>
          <Step n={1}>
            <p>
              A pentatônica menor cobre o braço inteiro por meio de{" "}
              <b>5 shapes</b> (posições). Cada shape é um padrão de dedilhado
              que ocupa 3–4 trastes e se conecta ao próximo. Juntos, cobrem
              todas as 20 notas do braço padrão.
            </p>
          </Step>
          <Step n={2}>
            <p>
              Os diagramas abaixo usam <b>Am pentatônica</b> como referência
              (raiz no 5º traste da 6ª corda). Mude para qualquer raiz
              simplesmente deslocando o padrão.{" "}
              <span style={{ color: "#f472b6" }}>Rosa = raiz</span>,{" "}
              <span style={{ color: "#818cf8" }}>roxo = demais notas</span>.
            </p>
          </Step>
        </TheoryBlock>

        {/* Shape selector */}
        <div className="flex flex-wrap gap-2 mb-5">
          {MINOR_PENTA_SHAPES.map((s, i) => (
            <button
              key={i}
              onClick={() => setShapeIdx(i)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background:
                  shapeIdx === i ? "rgba(129,140,248,0.22)" : "var(--ink-05)",
                border: `1px solid ${
                  shapeIdx === i ? "#818cf860" : "var(--border-card)"
                }`,
                color: shapeIdx === i ? "#818cf8" : "var(--text-muted)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Shape detail */}
        {(() => {
          const shape = MINOR_PENTA_SHAPES[shapeIdx];
          return (
            <div className="card p-5 mb-4">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Mini diagram */}
                <div>
                  <div
                    className="text-[10px] uppercase tracking-wider font-semibold mb-2"
                    style={{ color: "var(--text-ultra)" }}
                  >
                    Am · {shape.fretLabel}
                  </div>
                  <MiniShape shape={shape} />
                </div>
                {/* Description */}
                <div className="flex-1">
                  <div
                    className="text-lg font-bold mb-1"
                    style={{ color: "#818cf8" }}
                  >
                    {shape.label}
                  </div>
                  <div
                    className="text-sm mb-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {shape.desc}
                  </div>
                  <div
                    className="card px-3 py-2 text-sm"
                    style={{ borderLeft: "2px solid #60a5fa50" }}
                  >
                    <span style={{ color: "#60a5fa" }}>Dica: </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      {shape.tip}
                    </span>
                  </div>
                  {shapeIdx < 4 && (
                    <button
                      className="mt-3 text-xs px-3 py-1.5 rounded-lg transition"
                      style={{
                        background: "var(--ink-05)",
                        color: "var(--text-ultra)",
                        border: "1px solid var(--border-card)",
                      }}
                      onClick={() => setShapeIdx((i) => i + 1)}
                    >
                      Próximo shape →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Connection map — text */}
        <div className="card p-4">
          <div
            className="text-sm font-semibold mb-2"
            style={{ color: "var(--text-base)" }}
          >
            Conectando os 5 shapes (para Am)
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {MINOR_PENTA_SHAPES.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  className="px-2.5 py-1 rounded-md text-xs font-bold transition"
                  style={{
                    background:
                      shapeIdx === i
                        ? "rgba(129,140,248,0.2)"
                        : "var(--ink-05)",
                    color: shapeIdx === i ? "#818cf8" : "var(--text-muted)",
                    border: `1px solid ${
                      shapeIdx === i ? "#818cf860" : "transparent"
                    }`,
                  }}
                  onClick={() => setShapeIdx(i)}
                >
                  {s.label}
                  <span className="ml-1.5 text-[10px] opacity-60">
                    {s.fretLabel.split("–")[0]}ª
                  </span>
                </button>
                {i < 4 && (
                  <span style={{ color: "var(--text-ultra)", fontSize: 12 }}>
                    →
                  </span>
                )}
              </div>
            ))}
            <span className="text-xs" style={{ color: "var(--text-ultra)" }}>
              → oitava
            </span>
          </div>
        </div>
      </Section>

      {/* ── Section 4: Horizontalidade ──────────────────────────────────── */}
      <Section
        title="3. Visão Horizontal — Todos os Shapes Juntos"
        action={
          <CompleteToggle
            done={isComplete("scales", "horizontalidade")}
            onClick={() => markLesson("scales", "horizontalidade")}
          />
        }
      >
        <TheoryBlock>
          <Step n={1}>
            <p>
              A <b>horizontalidade</b> é a técnica de unir os 5 shapes em uma
              única frase longa que percorre o braço de ponta a ponta. Em vez de
              ficar "preso" em uma posição, o guitarrista desliza entre shapes
              usando a mesma corda como trilho.
            </p>
          </Step>
          <Step n={2}>
            <p>
              O segredo do "sanduíche": escolha uma corda (ex: 4ª corda) e toque
              as notas da pentatônica nessa corda de baixo até cima. Você
              atravessa todos os 5 shapes sem sair da corda. Depois repita nas
              outras cordas.
            </p>
          </Step>
        </TheoryBlock>

        <div className="mb-3">
          <div
            className="text-sm font-semibold mb-2"
            style={{ color: "var(--text-base)" }}
          >
            {root} Pentatônica Menor — braço completo (15 trastes)
          </div>
          <Fretboard
            frets={17}
            highlightedNotes={buildScale(root, "pentatonicMinor")}
            rootNote={root}
            interactive={false}
            showNoteNames={true}
            useFlats={needsFlats(root)}
          />
        </div>

        <div className="card p-4">
          <div
            className="text-sm font-semibold mb-2"
            style={{ color: "var(--text-base)" }}
          >
            Exercício prático
          </div>
          <ol className="space-y-1.5">
            {[
              "Toque a pentatônica menor de ponta a ponta na 4ª corda (D). Você passa pelos 5 shapes.",
              "Repita subindo pela 3ª corda (G). Note que os padrões se repetem.",
              "Invente uma frase que começa no Shape 1 e termina no Shape 3 sem parar.",
              "Grave um backing track de blues em Lá e improvise usando frases horizontais.",
            ].map((step, i) => (
              <li
                key={i}
                className="flex gap-2 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <span
                  className="font-bold shrink-0"
                  style={{ color: "#60a5fa" }}
                >
                  {i + 1}.
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ── Próximos passos ──────────────────────────────────────────────── */}
      <Section title="Próximos passos">
        <div className="card p-5">
          <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
            Escala e arpejo juntos são o segredo dos solos mais expressivos. Vá
            para o módulo de <b>Arpejos</b> para aprender a destacar as notas
            dos acordes dentro dos seus solos.
          </p>
          <a href="/arpejos" className="btn btn-primary">
            Ir para Arpejos →
          </a>
        </div>
      </Section>
      <LessonFooter moduleId="scales" />
    </div>
  );
}
