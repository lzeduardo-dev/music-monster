import { useState, useRef, useEffect } from "react";
import {
  PageHeader,
  Section,
  TheoryBlock,
  Step,
} from "../components/Common.jsx";
import { useProgress } from "../context/ProgressContext.jsx";

import LessonFooter from "../components/LessonFooter.jsx";
import CompleteToggle from '../components/CompleteToggle.jsx'
// ─── Data ────────────────────────────────────────────────────────────────────

const FIGURES = [
  {
    id: "semibreve",
    name: "Semibreve",
    beats: 4,
    fraction: "1",
    filled: false,
    stem: false,
    flags: 0,
    syllables: ["U", "—", "—", "—"],
    perMeasure: 1,
  },
  {
    id: "minima",
    name: "Mínima",
    beats: 2,
    fraction: "½",
    filled: false,
    stem: true,
    flags: 0,
    syllables: ["U", "—", "U", "—"],
    perMeasure: 2,
  },
  {
    id: "seminima",
    name: "Semínima",
    beats: 1,
    fraction: "¼",
    filled: true,
    stem: true,
    flags: 0,
    syllables: ["1", "2", "3", "4"],
    perMeasure: 4,
  },
  {
    id: "colcheia",
    name: "Colcheia",
    beats: 0.5,
    fraction: "⅛",
    filled: true,
    stem: true,
    flags: 1,
    syllables: ["1", "e", "2", "e", "3", "e", "4", "e"],
    perMeasure: 8,
  },
  {
    id: "semicolcheia",
    name: "Semicolcheia",
    beats: 0.25,
    fraction: "¹⁄₁₆",
    filled: true,
    stem: true,
    flags: 2,
    syllables: [
      "1",
      "e",
      "+",
      "a",
      "2",
      "e",
      "+",
      "a",
      "3",
      "e",
      "+",
      "a",
      "4",
      "e",
      "+",
      "a",
    ],
    perMeasure: 16,
  },
  {
    id: "fusa",
    name: "Fusa",
    beats: 0.125,
    fraction: "¹⁄₃₂",
    filled: true,
    stem: true,
    flags: 3,
    syllables: null,
    perMeasure: 32,
  },
];

const SUBDIVISIONS = [
  {
    id: "quarter",
    label: "Semínima",
    perBeat: 1,
    color: "#3b82f6",
    desc: "1 por tempo",
  },
  {
    id: "eighth",
    label: "Colcheia",
    perBeat: 2,
    color: "#60a5fa",
    desc: "2 por tempo",
  },
  {
    id: "sixteenth",
    label: "Semicolcheia",
    perBeat: 4,
    color: "#818cf8",
    desc: "4 por tempo",
  },
  {
    id: "triplet",
    label: "Tercina",
    perBeat: 3,
    color: "#a78bfa",
    desc: "3 por tempo",
  },
  {
    id: "sextuplet",
    label: "Sextina",
    perBeat: 6,
    color: "#c084fc",
    desc: "6 por tempo",
  },
];

const BPM_LABELS = [
  { bpm: 40, label: "Grave" },
  { bpm: 60, label: "Largo" },
  { bpm: 76, label: "Andante" },
  { bpm: 108, label: "Moderato" },
  { bpm: 132, label: "Allegro" },
  { bpm: 168, label: "Presto" },
  { bpm: 200, label: "Prestissimo" },
];

function getBpmLabel(bpm) {
  let last = BPM_LABELS[0];
  for (const e of BPM_LABELS) {
    if (bpm >= e.bpm) last = e;
  }
  return last.label;
}

// ─── Audio ───────────────────────────────────────────────────────────────────

function getCtx(ref) {
  if (!ref.current) ref.current = new AudioContext();
  try {
    if (ref.current.state === "suspended") ref.current.resume();
  } catch {}
  return ref.current;
}

function scheduleClick(ctx, freq, vol, time) {
  try {
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, time);
    g.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    o.start(time);
    o.stop(time + 0.06);
  } catch {}
}

// ─── SVG Note Symbol ─────────────────────────────────────────────────────────

function NoteSymbol({
  filled = true,
  stem = true,
  flags = 0,
  color = "#e2e8f0",
  size = 1,
}) {
  const W = 34,
    H = 70;
  const cx = 13,
    cy = 58,
    rx = 10,
    ry = 6.5;
  const sx = cx + rx - 1.5,
    sBot = cy - 3,
    sTop = 14;
  return (
    <svg
      width={W * size}
      height={H * size}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={filled ? color : "none"}
        stroke={color}
        strokeWidth="2"
        transform={`rotate(-15 ${cx} ${cy})`}
      />
      {stem && (
        <line
          x1={sx}
          y1={sBot}
          x2={sx}
          y2={sTop}
          stroke={color}
          strokeWidth="1.8"
        />
      )}
      {Array.from({ length: flags }, (_, i) => (
        <path
          key={i}
          d={`M${sx},${sTop + i * 12} C${sx + 14},${sTop + i * 12 + 7} ${
            sx + 10
          },${sTop + i * 12 + 15} ${sx},${sTop + i * 12 + 18}`}
          stroke={color}
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

// ─── SVG Rest Symbol ─────────────────────────────────────────────────────────

function RestShape({ id, color }) {
  if (id === "semibreve")
    return <rect x="8" y="29" width="18" height="9" rx="1.5" fill={color} />;
  if (id === "minima")
    return <rect x="8" y="41" width="18" height="9" rx="1.5" fill={color} />;
  if (id === "seminima")
    return (
      <path
        d="M18,13 L25,26 L13,36 L23,49 L16,58 L21,67"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    );
  if (id === "colcheia")
    return (
      <g>
        <circle cx="23" cy="21" r="5" fill={color} />
        <path
          d="M23,26 Q9,42 15,66"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  if (id === "semicolcheia")
    return (
      <g>
        <circle cx="23" cy="18" r="4.5" fill={color} />
        <circle cx="21" cy="32" r="4.5" fill={color} />
        <path
          d="M23,23 Q9,34 15,46 Q12,56 15,66"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  if (id === "fusa")
    return (
      <g>
        <circle cx="23" cy="15" r="4" fill={color} />
        <circle cx="21" cy="27" r="4" fill={color} />
        <circle cx="21" cy="39" r="4" fill={color} />
        <path
          d="M23,19 Q9,28 15,38 Q10,49 15,59 Q12,63 15,68"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  if (id === "semifusa")
    return (
      <g>
        <circle cx="23" cy="13" r="3.5" fill={color} />
        <circle cx="21" cy="24" r="3.5" fill={color} />
        <circle cx="21" cy="35" r="3.5" fill={color} />
        <circle cx="21" cy="46" r="3.5" fill={color} />
        <path
          d="M23,17 Q9,26 15,35 Q10,43 15,52 Q10,57 15,65"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    );
  return null;
}

function RestSymbol({ figureId, color = "#e2e8f0", size = 1 }) {
  const W = 34,
    H = 70;
  return (
    <svg
      width={W * size}
      height={H * size}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[34, 43, 52, 61].map((y) => (
        <line
          key={y}
          x1="3"
          y1={y}
          x2="31"
          y2={y}
          stroke={color}
          strokeWidth="0.7"
          opacity="0.2"
        />
      ))}
      <RestShape id={figureId} color={color} />
    </svg>
  );
}

// ─── Duration Tree ───────────────────────────────────────────────────────────

function DurationTree() {
  const rows = [
    {
      id: "semibreve",
      label: "Semibreve",
      count: 1,
      color: "#3b82f6",
      filled: false,
      stem: false,
      flags: 0,
    },
    {
      id: "minima",
      label: "Mínima",
      count: 2,
      color: "#60a5fa",
      filled: false,
      stem: true,
      flags: 0,
    },
    {
      id: "seminima",
      label: "Semínima",
      count: 4,
      color: "#818cf8",
      filled: true,
      stem: true,
      flags: 0,
    },
    {
      id: "colcheia",
      label: "Colcheia",
      count: 8,
      color: "#a78bfa",
      filled: true,
      stem: true,
      flags: 1,
    },
    {
      id: "semicolcheia",
      label: "Semicolcheia",
      count: 16,
      color: "#c084fc",
      filled: true,
      stem: true,
      flags: 2,
    },
  ];
  return (
    <div className="card p-4 space-y-1.5">
      <div className="text-[10px] uppercase tracking-wider text-white/40 mb-3">
        = 1 compasso (4/4)
      </div>
      {rows.map((r) => (
        <div key={r.id} className="flex items-center gap-2">
          <div className="w-28 shrink-0 flex items-center gap-1.5">
            <NoteSymbol
              filled={r.filled}
              stem={r.stem}
              flags={r.flags}
              color={r.color}
              size={0.55}
            />
            <span className="text-[11px]" style={{ color: r.color }}>
              {r.label}
            </span>
          </div>
          <div className="flex-1 flex gap-px">
            {Array.from({ length: r.count }, (_, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: 16,
                  background: i % 2 === 0 ? `${r.color}2a` : `${r.color}14`,
                  border: `1px solid ${r.color}35`,
                  minWidth: 2,
                }}
              />
            ))}
          </div>
          <div className="text-[10px] text-white/30 w-8 text-right">
            ×{r.count}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Pulse Demo ───────────────────────────────────────────────────────────────

function PulseDemo() {
  const [pulsing, setPulsing] = useState(false);
  const [beat, setBeat] = useState(false);
  const ctxRef = useRef(null);
  const intRef = useRef(null);

  useEffect(() => {
    if (!pulsing) {
      clearInterval(intRef.current);
      return;
    }
    const fire = () => {
      scheduleClick(getCtx(ctxRef), 880, 0.4, getCtx(ctxRef).currentTime);
      setBeat(true);
      setTimeout(() => setBeat(false), 100);
    };
    fire();
    intRef.current = setInterval(fire, 1000);
    return () => clearInterval(intRef.current);
  }, [pulsing]);

  useEffect(() => () => clearInterval(intRef.current), []);

  return (
    <div className="flex items-center gap-5">
      <button
        onClick={() => setPulsing((v) => !v)}
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shrink-0"
        style={{
          background: beat
            ? "#2563eb"
            : pulsing
            ? "rgba(37,99,235,0.18)"
            : "var(--ink-05)",
          border: `2px solid ${pulsing ? "#3b82f680" : "var(--ink-10)"}`,
          boxShadow: beat ? "0 0 22px rgba(59,130,246,0.55)" : "none",
          transform: beat ? "scale(1.15)" : "scale(1)",
          transition: "all 0.08s ease",
        }}
      >
        {pulsing ? "♥" : "▶"}
      </button>
      <div>
        <div
          className="font-semibold text-sm"
          style={{ color: "var(--text-base)" }}
        >
          {pulsing ? "Sentindo o pulso a 60 BPM" : "Clique para sentir o pulso"}
        </div>
        <div className="text-xs mt-1" style={{ color: "var(--text-ultra)" }}>
          Cada batida = 1 semínima = 1 tempo
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--text-ultra)" }}>
          Coloque a mão no peito — seu coração bate em pulso regular.
        </div>
      </div>
    </div>
  );
}

// ─── Figure Card ──────────────────────────────────────────────────────────────

function FigureCard({ fig, bpm = 72 }) {
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(-1);
  const ctxRef = useRef(null);

  const displayCount = Math.min(fig.perMeasure, 16);
  const noteMs = (60000 / bpm) * fig.beats;

  const play = () => {
    if (playing) return;
    setPlaying(true);
    const ctx = getCtx(ctxRef);
    const t0 = ctx.currentTime + 0.05;
    const noteSec = noteMs / 1000;
    const count = Math.min(fig.perMeasure, 32);

    for (let i = 0; i < count; i++) {
      const t = t0 + i * noteSec;
      scheduleClick(
        ctx,
        i === 0
          ? 1100
          : i % Math.max(1, Math.round(1 / fig.beats)) === 0
          ? 880
          : 660,
        i === 0 ? 0.5 : 0.3,
        t
      );
      if (i < displayCount) setTimeout(() => setActive(i), 50 + i * noteMs);
    }
    setTimeout(() => {
      setActive(-1);
      setPlaying(false);
    }, 50 + count * noteMs + 150);
  };

  return (
    <div className="card p-4">
      <div className="flex gap-4 items-start">
        <div className="shrink-0 flex flex-col items-center gap-1 pt-1">
          <NoteSymbol
            filled={fig.filled}
            stem={fig.stem}
            flags={fig.flags}
            color="#e2e8f0"
            size={1.05}
          />
          <div
            className="text-[11px] font-mono"
            style={{ color: "var(--text-ultra)" }}
          >
            {fig.fraction}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-bold text-sm"
            style={{ color: "var(--text-base)" }}
          >
            {fig.name}
          </div>
          <div
            className="text-xs mt-0.5"
            style={{ color: "var(--text-subtle)" }}
          >
            {fig.beats >= 1
              ? `${fig.beats} tempo${fig.beats > 1 ? "s" : ""}`
              : `${1 / fig.beats}× por tempo`}
            {" · "}
            {fig.perMeasure}× por compasso
          </div>

          {/* Beat grid */}
          <div className="flex gap-0.5 mt-3 flex-wrap">
            {Array.from({ length: displayCount }, (_, i) => (
              <div
                key={i}
                className="rounded-sm transition-all duration-75"
                style={{
                  width: Math.max(10, Math.floor(200 / displayCount)),
                  height: 14,
                  background:
                    active === i
                      ? "#3b82f6"
                      : i % Math.max(1, fig.perMeasure / 4) === 0
                      ? "rgba(59,130,246,0.2)"
                      : "var(--ink-08)",
                  boxShadow:
                    active === i ? "0 0 8px rgba(59,130,246,0.6)" : "none",
                  transform: active === i ? "scaleY(1.4)" : "scaleY(1)",
                }}
              />
            ))}
            {fig.perMeasure > 16 && (
              <span
                className="text-[10px] self-center ml-1"
                style={{ color: "var(--text-ultra)" }}
              >
                …×{fig.perMeasure}
              </span>
            )}
          </div>

          {fig.syllables && (
            <div className="flex gap-0.5 mt-1">
              {fig.syllables.map((s, i) => (
                <span
                  key={i}
                  className="text-[9px]"
                  style={{
                    color: "var(--text-ultra)",
                    // Distribui as sílabas sobre a mesma largura do beat grid
                    // (200px), independente de quantas figuras cabem no compasso.
                    width: Math.max(
                      10,
                      Math.floor(200 / fig.syllables.length)
                    ),
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          <button
            className="btn btn-primary text-xs px-3 py-1.5 mt-3"
            onClick={play}
            disabled={playing}
          >
            {playing ? "▶ Tocando…" : "▶"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Triplet Visual ───────────────────────────────────────────────────────────

function TripletVisual({ bpm = 72 }) {
  const [mode, setMode] = useState("normal");
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef(null);
  const beatMs = 60000 / bpm;

  const playDemo = (m) => {
    if (playing) return;
    setPlaying(true);
    const ctx = getCtx(ctxRef);
    const t0 = ctx.currentTime + 0.05;

    if (m === "normal") {
      // 2 colcheias × 2 beats = 4 notes
      const ms = beatMs / 2;
      for (let i = 0; i < 4; i++) {
        scheduleClick(ctx, i % 2 === 0 ? 880 : 660, 0.4, t0 + (i * ms) / 1000);
        setTimeout(() => setActive(i), 50 + i * ms);
      }
      setTimeout(() => {
        setActive(-1);
        setPlaying(false);
      }, 50 + 4 * ms + 150);
    } else {
      // 3 tercinas × 2 beats = 6 notes in same duration as 4 colcheias
      const ms = (beatMs * 2) / 6;
      for (let i = 0; i < 6; i++) {
        scheduleClick(
          ctx,
          i % 3 === 0 ? 1000 : 700,
          i % 3 === 0 ? 0.45 : 0.3,
          t0 + (i * ms) / 1000
        );
        setTimeout(() => setActive(i), 50 + i * ms);
      }
      setTimeout(() => {
        setActive(-1);
        setPlaying(false);
      }, 50 + 6 * ms + 150);
    }
  };

  return (
    <div className="card p-5 space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          className={`btn text-xs ${
            mode === "normal" ? "btn-primary" : "btn-ghost"
          }`}
          onClick={() => setMode("normal")}
        >
          2 Colcheias por tempo
        </button>
        <button
          className={`btn text-xs ${
            mode === "triplet" ? "btn-primary" : "btn-ghost"
          }`}
          onClick={() => setMode("triplet")}
        >
          Tercina (3 por tempo)
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex gap-1 text-[10px] text-white/40">
          <span className="w-16 shrink-0">Tempo:</span>
          {[1, 2].map((b) => (
            <span key={b} className="flex-1 text-center">
              {b}
            </span>
          ))}
        </div>

        {mode === "normal" ? (
          <>
            <div className="flex gap-1">
              {[0, 1, 0, 1].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded transition-all duration-75"
                  style={{
                    height: 26,
                    background:
                      active === i
                        ? "#3b82f6"
                        : i % 2 === 0
                        ? "rgba(59,130,246,0.2)"
                        : "var(--ink-08)",
                    boxShadow:
                      active === i ? "0 0 8px rgba(59,130,246,0.5)" : "none",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-1 text-[10px] text-white/35">
              {["1", "e", "2", "e"].map((s, i) => (
                <span key={i} className="flex-1 text-center">
                  {s}
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-0.5">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded transition-all duration-75"
                  style={{
                    height: 26,
                    background:
                      active === i
                        ? "#a78bfa"
                        : i % 3 === 0
                        ? "rgba(167,139,250,0.28)"
                        : "var(--ink-08)",
                    boxShadow:
                      active === i ? "0 0 8px rgba(167,139,250,0.6)" : "none",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-0.5">
              {[0, 1].map((beat) => (
                <div
                  key={beat}
                  className="flex-1 text-center text-[10px] border-t mt-1 pt-0.5"
                  style={{
                    borderColor: "rgba(167,139,250,0.35)",
                    color: "#a78bfa",
                  }}
                >
                  tri-po-let
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        className="btn btn-primary text-xs"
        onClick={() => playDemo(mode)}
        disabled={playing}
      >
        ▶ Ouvir {mode === "normal" ? "2 Colcheias" : "Tercina"}
      </button>

      <TheoryBlock>
        <p className="text-xs">
          {mode === "normal"
            ? 'Divisão binária: o tempo se divide em 2 colcheias iguais. Cante "1-e 2-e 3-e 4-e".'
            : 'Tercina: o tempo se divide em 3 partes iguais. Cada nota dura ²⁄₃ de uma colcheia. Cante "tri-po-let" por cada tempo.'}
        </p>
      </TheoryBlock>
    </div>
  );
}

// ─── Sextuplet Visual ─────────────────────────────────────────────────────────

function SextupletVisual({ bpm = 72 }) {
  const [grouping, setGrouping] = useState("3+3");
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef(null);
  const beatMs = 60000 / bpm;

  const play = () => {
    if (playing) return;
    setPlaying(true);
    const ctx = getCtx(ctxRef);
    const t0 = ctx.currentTime + 0.05;
    const ms = beatMs / 6;

    const accents = grouping === "3+3" ? [0, 3] : [0, 2, 4];
    for (let i = 0; i < 6; i++) {
      const isAccent = accents.includes(i);
      scheduleClick(
        ctx,
        isAccent ? 1000 : 700,
        isAccent ? 0.45 : 0.25,
        t0 + (i * ms) / 1000
      );
      setTimeout(() => setActive(i), 50 + i * ms);
    }
    setTimeout(() => {
      setActive(-1);
      setPlaying(false);
    }, 50 + 6 * ms + 150);
  };

  const colors33 = [0, 0, 0, 1, 1, 1];
  const colors222 = [0, 1, 2, 0, 1, 2];
  const colors = grouping === "3+3" ? colors33 : colors222;
  const palette = ["#a78bfa", "#c084fc", "#818cf8"];

  return (
    <div className="card p-5 space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          className={`btn text-xs ${
            grouping === "3+3" ? "btn-primary" : "btn-ghost"
          }`}
          onClick={() => setGrouping("3+3")}
        >
          Agrupamento 3+3 (= 2 tercinas)
        </button>
        <button
          className={`btn text-xs ${
            grouping === "2+2+2" ? "btn-primary" : "btn-ghost"
          }`}
          onClick={() => setGrouping("2+2+2")}
        >
          Agrupamento 2+2+2 (= 3 colcheias)
        </button>
      </div>

      <div>
        <div className="text-xs text-white/40 mb-2">
          6 notas iguais em 1 tempo
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="flex-1 rounded transition-all duration-75"
              style={{
                height: 26,
                background:
                  active === i
                    ? "#c084fc"
                    : `${palette[colors[i]]}${
                        grouping === "3+3" && i === 3 ? "28" : "18"
                      }`,
                boxShadow:
                  active === i ? "0 0 8px rgba(192,132,252,0.6)" : "none",
                borderLeft:
                  (grouping === "3+3" && i === 3) ||
                  (grouping === "2+2+2" && [0, 2, 4].includes(i))
                    ? "2px solid rgba(192,132,252,0.5)"
                    : "none",
              }}
            />
          ))}
        </div>
        <div className="flex gap-0.5 mt-1">
          {grouping === "3+3"
            ? [0, 1].map((g) => (
                <div
                  key={g}
                  className="flex-1 text-center text-[10px] border-t pt-0.5"
                  style={{
                    borderColor: "rgba(192,132,252,0.3)",
                    color: "#c084fc",
                  }}
                >
                  tri-po-let
                </div>
              ))
            : [0, 1, 2].map((g) => (
                <div
                  key={g}
                  className="flex-[2] text-center text-[10px] border-t pt-0.5"
                  style={{
                    borderColor: "rgba(192,132,252,0.3)",
                    color: "#c084fc",
                  }}
                >
                  la-ra
                </div>
              ))}
        </div>
      </div>

      <button
        className="btn btn-primary text-xs"
        onClick={play}
        disabled={playing}
      >
        ▶ Ouvir Sextina ({grouping})
      </button>

      <TheoryBlock>
        <p className="text-xs">
          A sextina divide cada tempo em 6 partes iguais. Pode ser sentida como{" "}
          <b>2 tercinas</b> (3+3) ou como <b>3 colcheias duplas</b> (2+2+2) — a
          escolha muda o fraseado e o groove.
        </p>
      </TheoryBlock>
    </div>
  );
}

// ─── Rhythm Metronome ─────────────────────────────────────────────────────────

function RhythmMetronome() {
  const [bpm, setBpm] = useState(80);
  const [running, setRunning] = useState(false);
  const [subdivIdx, setSubdivIdx] = useState(0);
  const [tick, setTick] = useState(-1);
  const ctxRef = useRef(null);
  const intRef = useRef(null);

  const subdiv = SUBDIVISIONS[subdivIdx];
  const totalTicks = 4 * subdiv.perBeat;
  const tickMs = 60000 / bpm / subdiv.perBeat;

  useEffect(() => {
    clearInterval(intRef.current);
    if (!running) return;
    let count = 0;
    const fire = () => {
      const ctx = getCtx(ctxRef);
      const isDownbeat = count % totalTicks === 0;
      const isBeat = count % subdiv.perBeat === 0;
      scheduleClick(
        ctx,
        isDownbeat ? 1100 : isBeat ? 880 : 660,
        isDownbeat ? 0.5 : isBeat ? 0.35 : 0.2,
        ctx.currentTime
      );
      setTick(count % totalTicks);
      count++;
    };
    fire();
    intRef.current = setInterval(fire, tickMs);
    return () => clearInterval(intRef.current);
  }, [running, bpm, subdivIdx]);

  useEffect(() => () => clearInterval(intRef.current), []);

  return (
    <div className="card p-5 space-y-5">
      {/* Subdivision selector */}
      <div>
        <div className="text-xs uppercase tracking-wider text-white/50 mb-2">
          Subdivisão ativa
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUBDIVISIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSubdivIdx(i)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              style={{
                background: subdivIdx === i ? `${s.color}22` : "var(--ink-05)",
                color: subdivIdx === i ? s.color : "var(--text-ultra)",
                border: `1px solid ${
                  subdivIdx === i ? s.color + "55" : "transparent"
                }`,
              }}
            >
              {s.label}
              <span className="ml-1 opacity-60 text-[10px]">({s.desc})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Measure grid */}
      <div>
        <div className="text-xs uppercase tracking-wider text-white/50 mb-2">
          Compasso 4/4 —{" "}
          {subdiv.perBeat === 3
            ? "tercinas"
            : subdiv.perBeat === 6
            ? "sextinas"
            : `${subdiv.perBeat}/${
                subdiv.perBeat === 1 ? "4" : subdiv.perBeat === 2 ? "8" : "16"
              }`}
        </div>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((beat) => (
            <div key={beat} className="flex-1">
              <div className="text-[10px] text-center text-white/30 mb-1">
                {beat + 1}
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: subdiv.perBeat }, (_, sub) => {
                  const g = beat * subdiv.perBeat + sub;
                  const isActive = tick === g && running;
                  return (
                    <div
                      key={sub}
                      className="flex-1 rounded-sm transition-all duration-75"
                      style={{
                        height: sub === 0 ? 26 : 18,
                        background: isActive
                          ? subdiv.color
                          : sub === 0
                          ? "rgba(59,130,246,0.15)"
                          : "var(--ink-05)",
                        boxShadow: isActive
                          ? `0 0 10px ${subdiv.color}90`
                          : "none",
                        transform: isActive ? "scaleY(1.25)" : "scaleY(1)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {(subdiv.perBeat === 3 || subdiv.perBeat === 6) && (
          <div className="mt-2 text-[10px] text-white/35">
            {subdiv.perBeat === 3
              ? 'Cante: "tri-po-let | tri-po-let | tri-po-let | tri-po-let"'
              : 'Cante: "la-ra-la-ra-la-ra" por tempo — ou agrupe 3+3 / 2+2+2'}
          </div>
        )}
      </div>

      {/* BPM controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setBpm((v) => Math.max(40, v - 5))}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold"
          style={{
            background: "var(--ink-05)",
            color: "var(--text-muted)",
          }}
        >
          −
        </button>
        <div className="flex-1 text-center">
          <div
            className="text-2xl font-extrabold leading-none"
            style={{ color: "#3b82f6" }}
          >
            {bpm}
          </div>
          <div
            className="text-[10px] uppercase tracking-widest mt-0.5"
            style={{ color: "var(--text-ultra)" }}
          >
            BPM — {getBpmLabel(bpm)}
          </div>
        </div>
        <button
          onClick={() => setBpm((v) => Math.min(240, v + 5))}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold"
          style={{
            background: "var(--ink-05)",
            color: "var(--text-muted)",
          }}
        >
          +
        </button>
        <button
          onClick={() => setRunning((v) => !v)}
          className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
          style={{
            background: running
              ? "rgba(244,114,182,0.15)"
              : "rgba(59,130,246,0.15)",
            border: `2px solid ${running ? "#f472b660" : "#3b82f660"}`,
            color: running ? "#f472b6" : "#60a5fa",
          }}
        >
          {running ? "⏹" : "▶"}
        </button>
      </div>

      <input
        type="range"
        min={40}
        max={240}
        step={1}
        value={bpm}
        onChange={(e) => setBpm(+e.target.value)}
        className="w-full"
        style={{ accentColor: "#3b82f6" }}
      />

      {/* BPM presets */}
      <div className="flex flex-wrap gap-1">
        {BPM_LABELS.map(({ bpm: b, label }) => (
          <button
            key={b}
            onClick={() => setBpm(b)}
            className="px-2 py-0.5 rounded text-[10px] font-semibold transition"
            style={{
              background: bpm === b ? "rgba(59,130,246,0.18)" : "var(--ink-05)",
              color: bpm === b ? "#60a5fa" : "var(--text-ultra)",
              border: `1px solid ${bpm === b ? "#3b82f640" : "transparent"}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FigurasRitmicas() {
  const [demoBpm, setDemoBpm] = useState(72);
  const { markLesson, isComplete } = useProgress();

  const MkBtn = ({ id }) => (
    <CompleteToggle
      done={isComplete("figuras_ritmicas", id)}
      onClick={() => markLesson("figuras_ritmicas", id)}
    />
  );

  return (
    <div>
      <PageHeader
        chip="Fundamentos"
        title="Figuras Rítmicas"
        description="Aprenda a ler, sentir e executar ritmo com precisão — de semibreves a sextinas, com áudio sincronizado e metrônomo integrado."
      />

      {/* ── 1. Introdução ─────────────────────────────────────────────── */}
      <Section
        title="1. Introdução ao Ritmo"
        action={<MkBtn id="introducao" />}
      >
        <TheoryBlock>
          <Step n={1}>
            <p>
              <b>Pulsação</b> é a batida regular e constante que organiza a
              música no tempo — como um relógio ou um coração. Toda música tem
              um pulso, mesmo que nem sempre seja tocado explicitamente.
            </p>
          </Step>
          <Step n={2}>
            <p>
              <b>Tempo</b> é a unidade de pulso que o músico sente enquanto
              toca. Em 4/4, há 4 tempos por compasso. A <i>semínima</i> (♩)
              representa 1 tempo.
            </p>
          </Step>
          <Step n={3}>
            <p>
              <b>Compasso</b> agrupa os tempos em unidades periódicas: 4/4 = 4
              tempos de semínima; 3/4 = 3 tempos (valsa); 6/8 = 6 tempos de
              colcheia (composto).
            </p>
          </Step>
          <Step n={4}>
            <p>
              <b>BPM</b> (batidas por minuto) define a velocidade do pulso. 60
              BPM = 1 batida por segundo. 120 BPM = 2 batidas por segundo.
              Controle o BPM com o metrônomo.
            </p>
          </Step>
        </TheoryBlock>
        <div className="mt-4">
          <PulseDemo />
        </div>
      </Section>

      {/* ── 2. Figuras ────────────────────────────────────────────────── */}
      <Section
        title="2. Figuras Rítmicas Fundamentais"
        action={<MkBtn id="figuras" />}
      >
        <TheoryBlock>
          <p>
            Cada figura rítmica tem um nome, uma aparência visual e uma duração
            relativa. A referência é sempre a <b>semínima = 1 tempo</b>. Clique
            em ▶ para ouvir cada figura preenchendo um compasso inteiro de 4/4.
          </p>
        </TheoryBlock>

        <div className="mb-4">
          <div className="text-xs text-white/50 mb-1.5">
            BPM de demonstração
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={40}
              max={120}
              step={2}
              value={demoBpm}
              onChange={(e) => setDemoBpm(+e.target.value)}
              className="w-40"
              style={{ accentColor: "#3b82f6" }}
            />
            <span className="text-sm font-bold" style={{ color: "#3b82f6" }}>
              {demoBpm}
            </span>
          </div>
        </div>

        <DurationTree />

        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {FIGURES.map((fig) => (
            <FigureCard key={fig.id} fig={fig} bpm={demoBpm} />
          ))}
        </div>
      </Section>

      {/* ── 3. Pausas ─────────────────────────────────────────────────── */}

      {/* ── 4. Pontuação e Ligaduras ──────────────────────────────────── */}

      {/* ── 5. Subdivisão ─────────────────────────────────────────────── */}
      <Section
        title="5. Subdivisão do Tempo"
        action={<MkBtn id="subdivisao" />}
      >
        <TheoryBlock>
          <Step n={1}>
            <p>
              <b>Sentir o tempo</b> = perceber o pulso da semínima. É o que você
              bate com o pé.
            </p>
          </Step>
          <Step n={2}>
            <p>
              <b>Subdividir o tempo</b> = dividir cada pulso em partes menores —
              colcheias (÷2), semicolcheias (÷4), tercinas (÷3), etc.
            </p>
          </Step>
          <Step n={3}>
            <p>
              <b>Divisão binária:</b> subdivisão em 2 (ou múltiplos de 2) —
              colcheias, semicolcheias. É o sistema padrão no pop, rock e samba.{" "}
              <b>Divisão ternária:</b> subdivisão em 3 — tercinas, 6/8. Cria a
              sensação de swing e shuffle.
            </p>
          </Step>
        </TheoryBlock>

        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          <div className="card p-4">
            <div
              className="text-sm font-bold mb-3"
              style={{ color: "#3b82f6" }}
            >
              Divisão Binária
            </div>
            {[
              { label: "÷ 2 (Colcheias)", count: 8, color: "#3b82f6" },
              { label: "÷ 4 (Semicolcheias)", count: 16, color: "#60a5fa" },
              {
                label: "÷ 8 (Fusas)",
                count: 16,
                color: "#818cf8",
                ellipsis: true,
              },
            ].map((r) => (
              <div key={r.label} className="mb-2">
                <div className="text-[10px] text-white/40 mb-1">{r.label}</div>
                <div className="flex gap-px">
                  {Array.from({ length: r.count }, (_, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-[2px]"
                      style={{
                        height: 12,
                        background:
                          i % 2 === 0 ? `${r.color}28` : `${r.color}14`,
                        border: `1px solid ${r.color}30`,
                        minWidth: 2,
                      }}
                    />
                  ))}
                  {r.ellipsis && (
                    <span className="text-[9px] self-center ml-1 text-white/30">
                      …
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="card p-4">
            <div
              className="text-sm font-bold mb-3"
              style={{ color: "#a78bfa" }}
            >
              Divisão Ternária
            </div>
            {[
              {
                label: "÷ 3 (Tercinas)",
                count: 12,
                color: "#a78bfa",
                group: 3,
              },
              {
                label: "÷ 6 (Sextinas)",
                count: 24,
                color: "#c084fc",
                group: 6,
              },
            ].map((r) => (
              <div key={r.label} className="mb-2">
                <div className="text-[10px] text-white/40 mb-1">{r.label}</div>
                <div className="flex gap-px">
                  {Array.from({ length: r.count }, (_, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-[2px]"
                      style={{
                        height: 12,
                        background:
                          Math.floor(i / r.group) % 2 === 0
                            ? `${r.color}28`
                            : `${r.color}14`,
                        border: `1px solid ${r.color}30`,
                        minWidth: 2,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
            <p className="text-[10px] text-white/40 mt-2">
              Sente um "balanço" diferente? Isso é a divisão ternária.
            </p>
          </div>
        </div>
      </Section>

      {/* ── 6. Tercinas ───────────────────────────────────────────────── */}
      <Section title="6. Tercinas" action={<MkBtn id="tercinas" />}>
        <TheoryBlock>
          <Step n={1}>
            <p>
              Uma <b>tercina</b> coloca <b>3 notas</b> no espaço que normalmente
              cabe <b>2</b>. Tercina de colcheias: 3 notas no espaço de 2
              colcheias (= 1 tempo). Cada nota dura ²⁄₃ de uma colcheia.
            </p>
          </Step>
          <Step n={2}>
            <p>
              <b>Identificação visual:</b> o número "3" aparece acima ou abaixo
              do grupo. Às vezes com uma colchete ligando as 3 notas.
            </p>
          </Step>
          <Step n={3}>
            <p>
              <b>Método de cantar:</b> diga "tri-po-let" enquanto bate os tempos
              com o pé. Cada sílaba = uma nota da tercina. O pé cai sempre no
              início de cada grupo.
            </p>
          </Step>
        </TheoryBlock>

        <TripletVisual bpm={demoBpm} />

        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          {[
            {
              label: "Tercina de Colcheias",
              desc: "3 no espaço de 2 colcheias (= 1 tempo)",
              color: "#a78bfa",
            },
            {
              label: "Tercina de Semínimas",
              desc: "3 no espaço de 2 semínimas (= 2 tempos)",
              color: "#818cf8",
            },
            {
              label: "Tercina de Semicolcheias",
              desc: "3 no espaço de 2 semicolcheias (= ½ tempo)",
              color: "#c084fc",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="card p-4"
              style={{ borderLeft: `2px solid ${item.color}50` }}
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded h-4"
                    style={{
                      background:
                        i === 0 ? `${item.color}35` : `${item.color}18`,
                      border: `1px solid ${item.color}40`,
                    }}
                  />
                ))}
                <div
                  className="text-[10px] self-center ml-1"
                  style={{ color: item.color }}
                >
                  3
                </div>
              </div>
              <div className="text-xs font-bold" style={{ color: item.color }}>
                {item.label}
              </div>
              <div className="text-[10px] mt-1 text-white/50">{item.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 7. Sextinas ───────────────────────────────────────────────── */}
      <Section title="7. Sextinas" action={<MkBtn id="sextinas" />}>
        <TheoryBlock>
          <Step n={1}>
            <p>
              Uma <b>sextina</b> coloca <b>6 notas iguais</b> em 1 tempo (ou no
              espaço de 4 colcheias). É essencialmente <b>2 tercinas</b>{" "}
              encadeadas — ou <b>3 pares</b> de notas.
            </p>
          </Step>
          <Step n={2}>
            <p>
              <b>Agrupamento 3+3:</b> sente como duas tercinas consecutivas.
              Groove de colcheia com swing. <b>Agrupamento 2+2+2:</b> sente como
              três colcheias rápidas. Sensação mais "quadrada".
            </p>
          </Step>
          <Step n={3}>
            <p>
              <b>Método de cantar:</b> "la-ra-la-ra-la-ra" (6 sílabas iguais por
              tempo) ou "tri-po-let-tri-po-let" para o agrupamento 3+3.
            </p>
          </Step>
        </TheoryBlock>

        <SextupletVisual bpm={demoBpm} />
      </Section>

      {/* ── 8. Metrônomo Integrado ────────────────────────────────────── */}
      <Section
        title="8. Metrônomo Integrado"
        action={<MkBtn id="metronomo_integrado" />}
      >
        <TheoryBlock>
          <p>
            Use o metrônomo abaixo para praticar qualquer subdivisão. Selecione
            a figura desejada, ajuste o BPM e observe a grade do compasso se
            iluminar em tempo real. Comece devagar (60–80 BPM) e suba
            gradualmente mantendo o pé no pulso.
          </p>
        </TheoryBlock>
        <RhythmMetronome />
      </Section>
      <LessonFooter moduleId="figuras_ritmicas" />
    </div>
  );
}
