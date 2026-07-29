import { useState, useRef, useEffect, useCallback } from "react";
import {
  PageHeader,
  Section,
  TheoryBlock,
  Step,
} from "../components/Common.jsx";
import { useProgress } from "../context/ProgressContext.jsx";

import LessonFooter from "../components/LessonFooter.jsx";
import CompleteToggle from '../components/CompleteToggle.jsx'
// ─── Constants ───────────────────────────────────────────────────────────────

const SUB_LABELS = ["1", "e", "+", "a"];

// Default: Pulsação on every beat head
const INITIAL_CELLS = Array.from({ length: 16 }, (_, i) =>
  i % 4 === 0 ? "P" : "empty"
);

const CYCLE = { empty: "P", P: "Q", Q: "empty" };

const CELL_CFG = {
  empty: {
    bg: "transparent",
    border: "var(--ink-08)",
    label: "",
    color: "transparent",
    heightFactor: 0.35,
  },
  P: {
    bg: "rgba(59,130,246,0.22)",
    border: "#3b82f6",
    label: ">",
    color: "#60a5fa",
    heightFactor: 1,
  },
  Q: {
    bg: "rgba(192,132,252,0.18)",
    border: "#c084fc",
    label: "X",
    color: "#e879f9",
    heightFactor: 0.6,
  },
};

const PRESETS = {
  default: Array.from({ length: 16 }, (_, i) => (i % 4 === 0 ? "P" : "empty")),
  funk: [
    "P",
    "empty",
    "Q",
    "empty",
    "P",
    "empty",
    "Q",
    "Q",
    "P",
    "empty",
    "Q",
    "empty",
    "P",
    "Q",
    "Q",
    "empty",
  ],
  bossa: [
    "P",
    "empty",
    "empty",
    "Q",
    "empty",
    "P",
    "empty",
    "empty",
    "P",
    "empty",
    "empty",
    "Q",
    "empty",
    "P",
    "empty",
    "empty",
  ],
  reggae: [
    "empty",
    "empty",
    "P",
    "empty",
    "empty",
    "empty",
    "P",
    "empty",
    "empty",
    "empty",
    "P",
    "empty",
    "empty",
    "empty",
    "P",
    "empty",
  ],
  samba: [
    "P",
    "empty",
    "Q",
    "empty",
    "Q",
    "empty",
    "P",
    "empty",
    "P",
    "empty",
    "Q",
    "empty",
    "Q",
    "P",
    "empty",
    "Q",
  ],
};

const BPM_MARKS = [
  { bpm: 60, label: "Largo" },
  { bpm: 80, label: "Andante" },
  { bpm: 100, label: "Moderato" },
  { bpm: 120, label: "Allegro" },
  { bpm: 160, label: "Presto" },
];

// ─── Audio ───────────────────────────────────────────────────────────────────

function getCtx(ref) {
  if (!ref.current) ref.current = new AudioContext();
  try {
    if (ref.current.state === "suspended") ref.current.resume();
  } catch {}
  return ref.current;
}

function scheduleClick(ctx, type, time) {
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    if (type === "P") {
      o.frequency.value = 1000;
      g.gain.setValueAtTime(0.55, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.07);
      o.start(time);
      o.stop(time + 0.08);
    } else if (type === "Q") {
      o.frequency.value = 280;
      o.type = "triangle";
      g.gain.setValueAtTime(0.18, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      o.start(time);
      o.stop(time + 0.05);
    } else {
      // motorzinho tick — barely audible
      o.frequency.value = 600;
      g.gain.setValueAtTime(0.03, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
      o.start(time);
      o.stop(time + 0.04);
    }
  } catch {}
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LaboratorioGroove() {
  const [cells, setCells] = useState(INITIAL_CELLS);
  const [bpm, setBpm] = useState(90);
  const [playing, setPlaying] = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);
  const [feel, setFeel] = useState({ legato: 50, pocket: 50 });
  const { markLesson, isComplete } = useProgress();

  const ctxRef = useRef(null);
  const timerRef = useRef(null);
  const stepRef = useRef(0);
  const nextRef = useRef(0);
  const bpmRef = useRef(bpm);
  const cellsRef = useRef(cells);

  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);
  useEffect(() => {
    cellsRef.current = cells;
  }, [cells]);

  const stopEngine = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const startEngine = useCallback(() => {
    const ctx = getCtx(ctxRef);
    stepRef.current = 0;
    nextRef.current = ctx.currentTime + 0.05;

    timerRef.current = setInterval(() => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      while (nextRef.current < ctx.currentTime + 0.12) {
        const step = stepRef.current % 16;
        const type = cellsRef.current[step];
        scheduleClick(ctx, type, nextRef.current);
        const ahead = Math.max(0, (nextRef.current - ctx.currentTime) * 1000);
        const s = step;
        setTimeout(() => setActiveIdx(s), ahead);
        nextRef.current += 60 / (bpmRef.current * 4);
        stepRef.current++;
      }
    }, 20);
  }, []);

  const toggle = useCallback(() => {
    if (playing) {
      stopEngine();
      setPlaying(false);
      setActiveIdx(null);
    } else {
      startEngine();
      setPlaying(true);
    }
  }, [playing, stopEngine, startEngine]);

  // Restart when BPM changes while playing
  useEffect(() => {
    if (playing) {
      stopEngine();
      startEngine();
    }
  }, [bpm]); // eslint-disable-line

  useEffect(
    () => () => {
      stopEngine();
      ctxRef.current?.close();
    },
    [stopEngine]
  );

  const toggleCell = (i) =>
    setCells((p) => {
      const n = [...p];
      n[i] = CYCLE[n[i]];
      return n;
    });

  const applyPreset = (key) => {
    setCells([...PRESETS[key]]);
    if (playing) {
      stopEngine();
      setTimeout(startEngine, 30);
    }
  };

  const bpmLabel = BPM_MARKS.reduce(
    (acc, m) => (bpm >= m.bpm ? m.label : acc),
    BPM_MARKS[0].label
  );

  const CELL_H_MAX = 52;

  return (
    <div>
      <PageHeader
        chip="Ferramentas"
        title="Laboratório do Groove"
        description="O sistema MPQ transforma o feel intuitivo dos músicos profissionais em algo visual, lógico e mecânico."
      />

      {/* ── MPQ Theory ─────────────────────────────────────────────────── */}
      <Section title="O Sistema MPQ">
        <TheoryBlock>
          <Step>
            <p>
              <b style={{ color: "#60a5fa" }}>M — Motorzinho</b>: a mão da
              palheta <b>nunca para</b>. Mantém 16 movimentos por compasso em
              semicolcheias (↓↑↓↑) como um pêndulo físico — mesmo nas pausas, a
              mão continua no ar, garantindo tempo matematicamente perfeito.
            </p>
          </Step>
          <Step>
            <p>
              <b style={{ color: "#60a5fa" }}>P — Pulsação</b>: os acentos
              principais que <b>travam com o bumbo e a caixa</b>. É onde a mão
              direita aplica mais pressão e o acorde soa com clareza — o que faz
              o ouvinte bater o pé.
            </p>
          </Step>
          <Step>
            <p>
              <b style={{ color: "#e879f9" }}>Q — Quebradinha</b>: a nota
              malandra. Ghost notes percussivas, síncopes e contratempos nas
              subdivisões fracas — o que <b>separa o robô do humano</b> e faz o
              ouvinte querer dançar.
            </p>
          </Step>
        </TheoryBlock>
      </Section>

      {/* ── Sequencer ──────────────────────────────────────────────────── */}
      <Section title="Grid MPQ Interativo">
        <div className="card p-5 mb-4">
          {/* BPM + Play */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button
              onClick={toggle}
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                flexShrink: 0,
                background: playing
                  ? "rgba(239,68,68,0.12)"
                  : "rgba(59,130,246,0.12)",
                border: `1.5px solid ${
                  playing ? "rgba(239,68,68,0.35)" : "rgba(59,130,246,0.35)"
                }`,
                color: playing ? "#f87171" : "#60a5fa",
                fontSize: 17,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s",
              }}
            >
              {playing ? "■" : "▶"}
            </button>

            <div style={{ minWidth: 52 }}>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: "var(--text-base)",
                  lineHeight: 1,
                }}
              >
                {bpm}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--text-ultra)",
                  letterSpacing: "0.06em",
                }}
              >
                {bpmLabel}
              </div>
            </div>

            <input
              type="range"
              min={40}
              max={200}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              style={{
                flex: 1,
                minWidth: 120,
                accentColor: "#3b82f6",
                cursor: "pointer",
              }}
            />

            {/* Motorzinho indicator */}
            {playing && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--text-ultra)",
                    letterSpacing: "0.06em",
                  }}
                >
                  MOTORZINHO
                </div>
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background:
                          activeIdx !== null && Math.floor(activeIdx / 2) === i
                            ? "#60a5fa"
                            : "var(--ink-10)",
                        transition: "background 0.05s",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Beat headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 3,
              marginBottom: 2,
            }}
          >
            {[1, 2, 3, 4].map((b) => (
              <div
                key={b}
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#818cf8",
                  letterSpacing: "0.04em",
                }}
              >
                {b}
              </div>
            ))}
          </div>

          {/* Sub-beat labels */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(16, 1fr)",
              gap: 3,
              marginBottom: 6,
            }}
          >
            {Array.from({ length: 16 }, (_, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  fontSize: 9,
                  color: i % 4 === 0 ? "#818cf8" : "var(--ink-20)",
                  fontWeight: i % 4 === 0 ? 700 : 400,
                }}
              >
                {SUB_LABELS[i % 4]}
              </div>
            ))}
          </div>

          {/* Grid — bottom-aligned cells of different heights */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(16, 1fr)",
              gap: 3,
              alignItems: "flex-end",
              height: CELL_H_MAX + 4,
            }}
          >
            {cells.map((type, i) => {
              const cfg = CELL_CFG[type];
              const isActive = activeIdx === i;
              const h = Math.round(CELL_H_MAX * cfg.heightFactor);
              const beatBoundary = i % 4 === 0 && i > 0;

              return (
                <button
                  key={i}
                  onClick={() => toggleCell(i)}
                  title={
                    type === "empty"
                      ? "Clique: Pulsação (P)"
                      : type === "P"
                      ? "Clique: Quebradinha (Q)"
                      : "Clique: Remover"
                  }
                  style={{
                    height: h,
                    borderRadius: 5,
                    border: `1px solid ${
                      isActive ? "var(--ink-60)" : cfg.border
                    }`,
                    background: isActive
                      ? type === "P"
                        ? "rgba(59,130,246,0.5)"
                        : type === "Q"
                        ? "rgba(192,132,252,0.45)"
                        : "var(--ink-10)"
                      : cfg.bg,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: type === "P" ? 13 : 11,
                    fontWeight: 900,
                    color: cfg.color,
                    transition: "background 0.06s, border-color 0.06s",
                    boxShadow: isActive
                      ? `0 0 10px ${
                          type === "P"
                            ? "#3b82f680"
                            : type === "Q"
                            ? "#c084fc80"
                            : "#ffffff30"
                        }`
                      : "none",
                    marginLeft: beatBoundary ? 4 : 0,
                  }}
                >
                  {type !== "empty" && cfg.label}
                </button>
              );
            })}
          </div>

          {/* Sweeper bar */}
          <div
            style={{
              marginTop: 8,
              height: 3,
              borderRadius: 999,
              background: "var(--ink-05)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: `${((activeIdx ?? 0) / 16) * 100}%`,
                width: `${100 / 16}%`,
                height: "100%",
                background: "linear-gradient(90deg, #3b82f6, #818cf8)",
                borderRadius: 999,
                opacity: playing ? 1 : 0,
                transition: "left 0.04s linear, opacity 0.3s",
              }}
            />
          </div>
        </div>

        {/* Presets + Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Presets */}
          <div className="card p-3 flex flex-wrap items-center gap-2 flex-1">
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--text-ultra)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginRight: 2,
              }}
            >
              Grooves
            </span>
            {Object.keys(PRESETS).map((key) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                style={{
                  padding: "4px 11px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "var(--ink-05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text-muted)",
                  textTransform: "capitalize",
                  transition: "background 0.15s",
                }}
              >
                {key === "default"
                  ? "Básico"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="card p-3 flex flex-col gap-1.5 justify-center">
            {[
              { type: "P", label: "Pulsação — acento forte" },
              { type: "Q", label: "Quebradinha — ghost / síncope" },
              { type: "empty", label: "Motorzinho — sem ataque" },
            ].map(({ type, label }) => {
              const cfg = CELL_CFG[type];
              return (
                <div
                  key={type}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 14,
                      borderRadius: 3,
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 900,
                      color: cfg.color,
                    }}
                  >
                    {type !== "empty" && cfg.label}
                  </div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feel sliders */}
        <div className="card p-4 grid sm:grid-cols-2 gap-5 mb-4">
          {[
            {
              key: "legato",
              label: "Articulação",
              left: "Staccato",
              right: "Legato",
              color: "#a78bfa",
            },
            {
              key: "pocket",
              label: "Feel / Timing",
              left: "Behind the beat",
              right: "On top",
              color: "#f472b6",
            },
          ].map(({ key, label, left, right, color }) => (
            <div key={key}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-ultra)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 10,
                  color: "var(--text-ultra)",
                  marginBottom: 5,
                }}
              >
                <span>{left}</span>
                <span>{right}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={feel[key]}
                onChange={(e) =>
                  setFeel((f) => ({ ...f, [key]: Number(e.target.value) }))
                }
                style={{ width: "100%", accentColor: color, cursor: "pointer" }}
              />
            </div>
          ))}
        </div>

        {/* MPQ Quick Reference */}
        <div className="card p-4">
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--text-ultra)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 10,
            }}
          >
            Resumo MPQ
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 10,
            }}
          >
            {[
              {
                letter: "M",
                color: "#60a5fa",
                title: "Motorzinho",
                rule: "Não pare a mão direita.",
              },
              {
                letter: "P",
                color: "#60a5fa",
                title: "Pulsação",
                rule: "Toque firme nos acentos principais para travar com a bateria.",
              },
              {
                letter: "Q",
                color: "#e879f9",
                title: "Quebradinha",
                rule: "Solte a mão esquerda nos contratempos para criar sons percussivos.",
              },
            ].map(({ letter, color, title, rule }) => (
              <div
                key={letter}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: `${color}0d`,
                  border: `1px solid ${color}25`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color,
                      lineHeight: 1,
                    }}
                  >
                    {letter}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--text-base)",
                    }}
                  >
                    {title}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <CompleteToggle
            done={isComplete("groove", "mpq")}
            onClick={() => markLesson("groove", "mpq")}
          />
        </div>
      </Section>
      <LessonFooter moduleId="groove" />
    </div>
  );
}
