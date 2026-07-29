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
  needsFlats,
  SCALE_LABELS,
} from "../lib/theory.js";
import { playSequence } from "../lib/audio.js";
import { useProgress } from "../context/ProgressContext.jsx";

import LessonFooter from "../components/LessonFooter.jsx";
// ── Menor Harmônica ────────────────────────────────────────────────────────
const HARMONIC_MODES = [
  {
    key: "harmonicMinor",
    label: "Menor Harmônica",
    degree: "I",
    formula: "1 – 2 – b3 – 4 – 5 – b6 – 7",
    char: "Sombria e tensa — a 7ª maior cria o leading tone e o intervalo aumentado característico (b6→7).",
    use: "Tônica menor com sensível. V7b9 resolve para im. Base do flamenco, metal e música árabe.",
    color: "#a78bfa",
  },
  {
    key: "locrianNat6",
    label: "Lócrio ♮6",
    degree: "II",
    formula: "1 – b2 – b3 – 4 – b5 – 6 – b7",
    char: "Meio-diminuto com 6ª natural — menos tenso que o Lócrio padrão.",
    use: "Sobre acordes Xm7b5 no jazz. Mais melódico que o Lócrio comum.",
    color: "#818cf8",
  },
  {
    key: "ionianSharp5",
    label: "Jônico #5",
    degree: "III",
    formula: "1 – 2 – 3 – 4 – #5 – 6 – 7",
    char: "Maior com a quinta aumentada — eufórico e ligeiramente tenso.",
    use: "Sobre acordes Xaug(M7). Alternativa ao Lídio Aumentado.",
    color: "#60a5fa",
  },
  {
    key: "dorianSharp4",
    label: "Dórico #4 (Romeno)",
    degree: "IV",
    formula: "1 – 2 – b3 – #4 – 5 – 6 – b7",
    char: "Exótico e dançante — a #4 dá sabor balcânico/oriental.",
    use: "Música romena, klezmer, jazz modal. Muito característico geograficamente.",
    color: "#38bdf8",
  },
  {
    key: "phrygianDominant",
    label: "Frígio Dominante",
    degree: "V",
    formula: "1 – b2 – 3 – 4 – 5 – b6 – b7",
    char: "O mais importante! Dominante com a b2 — sabor espanhol/árabe imenso.",
    use: "O modo V da menor harmônica. Sobre V7b9 em progressões menores. Flamenco, metal, jazz.",
    color: "#f472b6",
  },
  {
    key: "lydianSharp2",
    label: "Lídio #2",
    degree: "VI",
    formula: "1 – #2 – 3 – #4 – 5 – 6 – 7",
    char: "Lídio com a 2ª aumentada — dupla tensão cromática, som quase etéreo.",
    use: "Raramente usado sozinho; aparece em improvisação sobre contextos tonais ambíguos.",
    color: "#c084fc",
  },
  {
    key: "superLocrianBb7",
    label: "Super Lócrio bb7",
    degree: "VII",
    formula: "1 – b2 – b3 – b4 – b5 – b6 – bb7",
    char: "A escala mais dissonante — apenas para efeito. Quase atonal.",
    use: "Contextos experimentais e free jazz. Sobre acordes dim7 em resolução.",
    color: "#e879f9",
  },
];

// ── Menor Melódica resumo ──────────────────────────────────────────────────
const MELODIC_HIGHLIGHTS = [
  {
    key: "melodicMinor",
    label: "Menor Melódica",
    formula: "1–2–b3–4–5–6–7",
    use: "Sobre Xm(M7) e tônicas menores no jazz.",
  },
  {
    key: "lydianDominant",
    label: "Lídio Dominante (IV)",
    formula: "1–2–3–#4–5–6–b7",
    use: "Dominante não-resolvente. Brilhante e moderno.",
  },
  {
    key: "altered",
    label: "Alterada (VII)",
    formula: "1–b2–b3–b4–b5–b6–b7",
    use: "Sobre V7alt — máxima tensão cromática.",
  },
];

export default function EscalasAvancadas() {
  const [root, setRoot] = useState("A");
  const [activeMode, setActiveMode] = useState("harmonicMinor");
  const [section, setSection] = useState("harmonica"); // 'harmonica' | 'melodica'
  const { markLesson, isComplete } = useProgress();

  const scaleNotes = useMemo(
    () => buildScale(root, activeMode),
    [root, activeMode]
  );
  const scalePitches = useMemo(
    () => scaleWithOctaves(root, activeMode, 4),
    [root, activeMode]
  );

  const currentMode =
    [
      ...HARMONIC_MODES,
      ...MELODIC_HIGHLIGHTS.map((m) => ({
        ...m,
        color: "#60a5fa",
        char: m.use,
        degree: "",
      })),
    ].find((m) => m.key === activeMode) ?? HARMONIC_MODES[0];

  return (
    <div>
      <PageHeader
        chip="Avançado"
        title="Escalas Avançadas"
        description="Menor Harmônica e Menor Melódica — as duas escalas menores mais ricas do jazz, do metal e da música erudita, com todos os seus modos."
      />

      {/* Section tabs */}
      <div className="flex gap-2 mb-8">
        {[
          { key: "harmonica", label: "Menor Harmônica" },
          { key: "melodica", label: "Menor Melódica" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => {
              setSection(s.key);
              setActiveMode(
                s.key === "harmonica" ? "harmonicMinor" : "melodicMinor"
              );
            }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition"
            style={{
              background:
                section === s.key
                  ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                  : "var(--ink-05)",
              color: section === s.key ? "#fff" : "var(--text-muted)",
              border:
                section === s.key ? "none" : "1px solid var(--border-card)",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── MENOR HARMÔNICA ────────────────────────────────────────────── */}
      {section === "harmonica" && (
        <>
          <Section title="O que é a Menor Harmônica?">
            <TheoryBlock>
              <Step n={1}>
                <p>
                  A escala <b>menor natural</b> (eólio) tem um problema: a 7ª
                  está a 1 tom da tônica, e não a meio tom — isso enfraquece a
                  sensação de resolução. A <b>menor harmônica</b> resolve isso
                  elevando a 7ª em meio tom.
                </p>
              </Step>
              <Step n={2}>
                <p>
                  Resultado: <b>b6 → 7</b> cria um intervalo de segunda
                  aumentada (3 semitons) — o som mais característico da escala,
                  evocando flamenco, música árabe e o modal clássico.
                </p>
              </Step>
              <Step n={3}>
                <p>
                  O <b>acorde V7</b> da tonalidade menor agora é verdadeiramente
                  dominante (tem a 3ª maior) e resolve com força para o im. O
                  modo V da menor harmônica é o <b>Frígio Dominante</b> — o mais
                  usado na prática.
                </p>
              </Step>
            </TheoryBlock>
          </Section>

          <Section title="Os 7 modos da Menor Harmônica">
            <div className="grid md:grid-cols-2 gap-3 mb-5">
              {HARMONIC_MODES.map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setActiveMode(mode.key)}
                  className="card p-4 text-left transition hover:-translate-y-0.5"
                  style={{
                    borderLeft: `3px solid ${
                      activeMode === mode.key ? mode.color : "transparent"
                    }`,
                    background:
                      activeMode === mode.key ? `${mode.color}12` : undefined,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: `${mode.color}20`,
                        color: mode.color,
                      }}
                    >
                      Grau {mode.degree}
                    </span>
                    <span
                      className="font-bold text-sm"
                      style={{ color: "var(--text-base)" }}
                    >
                      {mode.label}
                    </span>
                  </div>
                  <div
                    className="font-mono text-xs mb-1.5"
                    style={{ color: mode.color }}
                  >
                    {mode.formula}
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {mode.char}
                  </p>
                  <p
                    className="text-xs mt-1 italic"
                    style={{ color: "var(--text-ultra)" }}
                  >
                    {mode.use}
                  </p>
                </button>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* ── MENOR MELÓDICA ─────────────────────────────────────────────── */}
      {section === "melodica" && (
        <>
          <Section title="O que é a Menor Melódica?">
            <TheoryBlock>
              <Step n={1}>
                <p>
                  A <b>menor melódica</b> (jazz) eleva tanto a 6ª quanto a 7ª da
                  menor natural:{" "}
                  <b>b3 é a única diferença em relação à escala maior</b>.
                  Resultado: um som menor que "flui" melhor melodicamente.
                </p>
              </Step>
              <Step n={2}>
                <p>
                  No jazz, ela é usada <em>igual ascendente e descendente</em>{" "}
                  (diferente da versão clássica que desce como menor natural).
                  Seus modos — especialmente o <b>Lídio Dominante</b> e a{" "}
                  <b>Alterada</b> — são fundamentais no jazz moderno.
                </p>
              </Step>
            </TheoryBlock>
          </Section>

          <Section title="Modos destaque da Menor Melódica">
            <div className="grid md:grid-cols-3 gap-3 mb-5">
              {MELODIC_HIGHLIGHTS.map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setActiveMode(mode.key)}
                  className="card p-4 text-left transition hover:-translate-y-0.5"
                  style={{
                    borderLeft: `3px solid ${
                      activeMode === mode.key ? "#3b82f6" : "transparent"
                    }`,
                    background:
                      activeMode === mode.key
                        ? "rgba(59,130,246,0.08)"
                        : undefined,
                  }}
                >
                  <div
                    className="font-bold text-sm mb-1"
                    style={{ color: "var(--text-base)" }}
                  >
                    {mode.label}
                  </div>
                  <div
                    className="font-mono text-xs mb-2"
                    style={{ color: "#60a5fa" }}
                  >
                    {mode.formula}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {mode.use}
                  </p>
                </button>
              ))}
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Para a listagem completa dos 7 modos da menor melódica, acesse o
              módulo{" "}
              <a
                href="/menor-melodica"
                className="font-semibold"
                style={{ color: "#60a5fa" }}
              >
                Menor Melódica
              </a>
              .
            </p>
          </Section>
        </>
      )}

      {/* ── Visualização interativa ────────────────────────────────────── */}
      <Section
        title={`Visualização — ${root} ${
          SCALE_LABELS[activeMode] ?? activeMode
        }`}
        action={
          <div className="flex gap-2 flex-wrap">
            <button
              className="btn btn-primary"
              onClick={() => playSequence(scalePitches, 0.35)}
            >
              ▶ Tocar escala
            </button>
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <NotePicker value={root} onChange={setRoot} />
        </div>

        <div className="card p-4 mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {buildScaleNotes(root, activeMode).map((n, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-lg text-sm font-bold"
                style={{
                  background:
                    i === 0
                      ? "rgba(244,114,182,0.15)"
                      : "rgba(167,139,250,0.1)",
                  color: i === 0 ? "#f472b6" : "#a78bfa",
                  border: `1px solid ${i === 0 ? "#f472b680" : "#a78bfa40"}`,
                }}
              >
                {n}
              </div>
            ))}
          </div>
          <div
            className="text-sm font-mono"
            style={{ color: "var(--text-ultra)" }}
          >
            {SCALE_LABELS[activeMode]} · {currentMode?.formula ?? ""}
          </div>
        </div>

        <div>
          <Fretboard
            frets={15}
            highlightedNotes={scaleNotes}
            rootNote={root}
            useFlats={needsFlats(root)}
          />
        </div>
      </Section>

      {/* ── Comparativo ───────────────────────────────────────────────── */}
      <Section title="Comparativo das três escalas menores">
        <div className="card p-5 overflow-x-auto">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: "separate", borderSpacing: "0 4px" }}
          >
            <thead>
              <tr>
                {[
                  "Escala",
                  "Graus",
                  "Diferença da menor natural",
                  "Uso principal",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold"
                    style={{ color: "var(--text-ultra)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Menor Natural (Eólio)",
                  formula: "1–2–b3–4–5–b6–b7",
                  diff: "—",
                  use: "Pop, rock, tônica menor simples",
                  color: "#818cf8",
                },
                {
                  name: "Menor Harmônica",
                  formula: "1–2–b3–4–5–b6–7",
                  diff: "7ª elevada ½ tom",
                  use: "Clássico, flamenco, metal, V7b9",
                  color: "#a78bfa",
                },
                {
                  name: "Menor Melódica (Jazz)",
                  formula: "1–2–b3–4–5–6–7",
                  diff: "6ª e 7ª elevadas ½ tom",
                  use: "Jazz, bossa, música moderna",
                  color: "#60a5fa",
                },
              ].map((row) => (
                <tr key={row.name}>
                  <td
                    className="px-3 py-2 font-bold"
                    style={{ color: row.color }}
                  >
                    {row.name}
                  </td>
                  <td
                    className="px-3 py-2 font-mono text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {row.formula}
                  </td>
                  <td
                    className="px-3 py-2 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {row.diff}
                  </td>
                  <td
                    className="px-3 py-2 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {row.use}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-3"></div>
      </Section>
      <LessonFooter moduleId="escalas_avancadas" />
    </div>
  );
}
