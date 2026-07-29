import { useMemo, useState, useRef, useEffect } from "react";
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
  noteIndex,
  SCALE_LABELS,
} from "../lib/theory.js";
import { playSequence } from "../lib/audio.js";
import { useProgress } from "../context/ProgressContext.jsx";

import LessonFooter from "../components/LessonFooter.jsx";
import CompleteToggle from '../components/CompleteToggle.jsx'
// ─── Modes data ──────────────────────────────────────────────────────────────
// charDegree: index (0–6) of the characteristic note within the mode's scale
// charLabel: how to refer to that interval theoretically
// chord: triad/tetrad quality used for the modal drone

const MODES = [
  {
    key: "ionian",
    label: "Jônico",
    degree: "I",
    desc: "A própria escala maior. Soa estável e brilhante.",
    charDegree: null,
    charLabel: "— (escala maior é a referência)",
    chord: "maj7",
    chordLabel: "Imaj7",
    practiceTip:
      'O modo "neutro" — qualquer nota cai bem na tônica maior. Use para entender resolução.',
  },
  {
    key: "dorian",
    label: "Dórico",
    degree: "ii",
    desc: "Menor com 6ª maior. Cor sofisticada — usado em jazz, funk e MPB.",
    charDegree: 5,
    charLabel: "6ª maior (♮6)",
    chord: "min7",
    chordLabel: "im7",
    practiceTip:
      'Foque na 6ª maior — é o que diferencia do menor natural. Toque a nota lentamente sobre o drone para "ouvir" a tensão única.',
  },
  {
    key: "phrygian",
    label: "Frígio",
    degree: "iii",
    desc: "Menor com 2ª menor. Sonoridade espanhola/oriental.",
    charDegree: 1,
    charLabel: "2ª menor (♭2)",
    chord: "min7",
    chordLabel: "im7",
    practiceTip:
      "A ♭2 é a alma do Frígio. Toque-a logo após a tônica para sentir o sabor espanhol/flamenco.",
  },
  {
    key: "lydian",
    label: "Lídio",
    degree: "IV",
    desc: 'Maior com 4ª aumentada. Soa "sonhador", flutuante, "Star Wars".',
    charDegree: 3,
    charLabel: "4ª aumentada (♯4)",
    chord: "maj7",
    chordLabel: "Imaj7♯11",
    practiceTip:
      'A ♯4 é a magia do Lídio — soa "elevada". Pause nela sobre o drone e ouça o efeito flutuante.',
  },
  {
    key: "mixolydian",
    label: "Mixolídio",
    degree: "V",
    desc: "Maior com 7ª menor. Som dominante — blues, rock, gospel.",
    charDegree: 6,
    charLabel: "7ª menor (♭7)",
    chord: "7",
    chordLabel: "I7",
    practiceTip:
      "A ♭7 é a tensão dominante característica. Mixolídio funciona sobre qualquer acorde dom7.",
  },
  {
    key: "aeolian",
    label: "Eólio",
    degree: "VI",
    desc: "A menor natural. Triste, introspectiva, base do rock e do metal.",
    charDegree: 5,
    charLabel: "6ª menor (♭6)",
    chord: "min7",
    chordLabel: "Im7",
    practiceTip:
      "A ♭6 é o que diferencia do Dórico — dá o tom melancólico ao Eólio.",
  },
  {
    key: "locrian",
    label: "Lócrio",
    degree: "VII°",
    desc: "Diminuto, com 5ª bemol. Tenso, instável — raro como tonalidade.",
    charDegree: 4,
    charLabel: "5ª diminuta (♭5)",
    chord: "m7b5",
    chordLabel: "Im7♭5",
    practiceTip:
      'A ♭5 (trítono) define o Lócrio. É praticamente impossível ter uma "tônica" estável — Lócrio é usado mais sobre acordes meio-diminutos.',
  },
];

// ─── Mode Drone (Web Audio sustained chord) ──────────────────────────────────
// Plays a pad-like chord that establishes the modal center for practice over.

function semiToFreq(semi, oct) {
  // semi: 0–11 (C=0). oct: octave number where 4 = middle (C4 = MIDI 60)
  const midi = (oct + 1) * 12 + semi;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function ModeDrone({ root, modeKey, mode, color }) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.25);
  const ctxRef = useRef(null);
  const masterGainRef = useRef(null);
  const filterRef = useRef(null);
  const nodesRef = useRef([]);

  // Compute drone chord voicing: root + 5th (or b5 for locrian) + 3rd above
  const droneVoicing = useMemo(() => {
    const r = noteIndex(root);
    const scale = buildScale(root, modeKey);
    const third = scale[2];
    const fifth = scale[4];
    return [
      { semi: r, oct: 2 }, // root bass
      { semi: r, oct: 3 }, // root octave
      { semi: fifth, oct: 3 }, // fifth
      { semi: third, oct: 4 }, // third (high)
      { semi: r, oct: 4 }, // root top
    ];
  }, [root, modeKey]);

  const stopDrone = () => {
    nodesRef.current.forEach(({ osc, gain }) => {
      try {
        const ctx = ctxRef.current;
        if (ctx) {
          gain.gain.cancelScheduledValues(ctx.currentTime);
          gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.stop(ctx.currentTime + 0.35);
        } else {
          osc.stop();
        }
      } catch {}
    });
    nodesRef.current = [];
  };

  const startDrone = () => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    const ctx = ctxRef.current;
    try {
      if (ctx.state === "suspended") ctx.resume();
    } catch {}

    if (!masterGainRef.current) {
      masterGainRef.current = ctx.createGain();
      filterRef.current = ctx.createBiquadFilter();
      filterRef.current.type = "lowpass";
      filterRef.current.frequency.value = 2200;
      filterRef.current.Q.value = 0.4;
      masterGainRef.current.connect(filterRef.current);
      filterRef.current.connect(ctx.destination);
    }
    masterGainRef.current.gain.setValueAtTime(volume, ctx.currentTime);

    const nodes = [];
    droneVoicing.forEach(({ semi, oct }, idx) => {
      const baseFreq = semiToFreq(semi, oct);
      // 3 detuned oscillators per note for pad warmth
      [-9, 0, 9].forEach((detune, dIdx) => {
        const osc = ctx.createOscillator();
        osc.type = idx === 0 ? "sine" : "triangle"; // bass = sine (cleaner), upper = triangle
        osc.frequency.value = baseFreq;
        osc.detune.value = detune;

        const g = ctx.createGain();
        const target = idx === 0 ? 0.22 : 0.1; // bass louder
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(target, ctx.currentTime + 0.6);

        osc.connect(g);
        g.connect(masterGainRef.current);
        osc.start();
        nodes.push({ osc, gain: g });
      });
    });
    nodesRef.current = nodes;
    setPlaying(true);
  };

  const toggle = () => {
    if (playing) {
      stopDrone();
      setPlaying(false);
    } else {
      startDrone();
    }
  };

  // Restart on mode/root change while playing
  useEffect(() => {
    if (playing) {
      stopDrone();
      startDrone();
    }
    // eslint-disable-next-line
  }, [root, modeKey]);

  // Volume realtime
  useEffect(() => {
    if (masterGainRef.current && ctxRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        volume,
        ctxRef.current.currentTime
      );
    }
  }, [volume]);

  useEffect(
    () => () => {
      stopDrone();
      ctxRef.current?.close();
    },
    []
  );

  return (
    <div
      className="card"
      style={{
        padding: 16,
        borderLeft: `3px solid ${color}`,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={toggle}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            flexShrink: 0,
            background: playing ? `${color}25` : color,
            border: "none",
            color: playing ? color : "#0b1220",
            fontSize: 17,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
          }}
          aria-label={playing ? "Parar drone" : "Tocar drone"}
        >
          {playing ? "■" : "▶"}
        </button>

        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--text-ultra)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Acorde Estático
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-base)",
              marginTop: 2,
            }}
          >
            {root} {mode.chordLabel}
            <span
              style={{
                fontSize: 11,
                color: "var(--text-ultra)",
                fontWeight: 500,
                marginLeft: 8,
              }}
            >
              · centro tonal do {mode.label}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 140,
          }}
        >
          <span style={{ fontSize: 10, color: "var(--text-ultra)" }}>VOL</span>
          <input
            type="range"
            min={0}
            max={0.6}
            step={0.02}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ flex: 1, accentColor: color, cursor: "pointer" }}
          />
        </div>

        {/* Pulsing indicator while playing */}
        {playing && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
                animation: "dronePulse 1.6s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: 10,
                color,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              tocando
            </span>
          </div>
        )}
      </div>

      <p
        style={{
          fontSize: 11,
          color: "var(--text-muted)",
          margin: "10px 0 0 0",
          lineHeight: 1.5,
        }}
      >
        💡 {mode.practiceTip}
      </p>

      <style>{`
        @keyframes dronePulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

const CHAR_COLOR = "#f59e0b";

export default function Advanced() {
  const [root, setRoot] = useState("C");
  const [modeKey, setModeKey] = useState("dorian");
  const { markLesson, isComplete } = useProgress();

  const notes = useMemo(() => buildScale(root, modeKey), [root, modeKey]);
  const pitches = useMemo(
    () => scaleWithOctaves(root, modeKey, 4),
    [root, modeKey]
  );
  const scaleNames = useMemo(
    () => buildScaleNotes(root, modeKey),
    [root, modeKey]
  );
  const mode = MODES.find((m) => m.key === modeKey);

  // Semitone index of the characteristic note (for Fretboard highlight)
  const charSemi = mode.charDegree != null ? notes[mode.charDegree] : null;

  // Degree labels for each scale note (1, 2, b3, etc.) — used for chip tooltip
  const DEGREE_LABELS = {
    ionian: ["1", "2", "3", "4", "5", "6", "7"],
    dorian: ["1", "2", "♭3", "4", "5", "6", "♭7"],
    phrygian: ["1", "♭2", "♭3", "4", "5", "♭6", "♭7"],
    lydian: ["1", "2", "3", "♯4", "5", "6", "7"],
    mixolydian: ["1", "2", "3", "4", "5", "6", "♭7"],
    aeolian: ["1", "2", "♭3", "4", "5", "♭6", "♭7"],
    locrian: ["1", "♭2", "♭3", "4", "♭5", "♭6", "♭7"],
  };

  return (
    <div>
      <PageHeader
        chip="Modos Gregos"
        title="Modos Gregos"
        description="Sete modos derivados da escala maior, cada um começando em um grau diferente — e por que isso muda a sonoridade por completo."
      />

      <Section title="1. O que são os modos?">
        <TheoryBlock>
          <Step>
            <p>
              Pegue a escala de C maior (C-D-E-F-G-A-B). Comece a tocá-la a
              partir do <b>D</b>, sem mudar nenhuma nota: D-E-F-G-A-B-C. Isto é
              o modo <b>Dórico</b>. As mesmas notas, mas o "centro" mudou — e a
              sonoridade muda completamente.
            </p>
          </Step>
          <Step>
            <p>
              Cada grau da escala maior gera um modo: I=Jônico, II=Dórico,
              III=Frígio, IV=Lídio, V=Mixolídio, VI=Eólio, VII°=Lócrio.
            </p>
          </Step>
          <Step>
            <p>
              Cada modo tem uma <b>nota característica</b> (destacada em{" "}
              <span style={{ color: CHAR_COLOR, fontWeight: 700 }}>
                laranja
              </span>{" "}
              aqui no app) — é a nota que define seu sabor único. Treinar o
              ouvido para reconhecer essa nota sobre o drone é a forma mais
              rápida de "internalizar" o modo.
            </p>
          </Step>
        </TheoryBlock>
      </Section>

      <Section
        title={`${root} ${SCALE_LABELS[modeKey]}`}
        action={
          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              onClick={() => playSequence(pitches, 0.3, true)}
            >
              ▶ Tocar modo
            </button>
            <CompleteToggle
              done={isComplete("advanced", modeKey)}
              onClick={() => markLesson("advanced", modeKey)}
            />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3 mb-4">
          <NotePicker value={root} onChange={setRoot} />
          <div className="flex flex-wrap gap-1">
            {MODES.map((m) => (
              <Pill
                key={m.key}
                active={modeKey === m.key}
                onClick={() => setModeKey(m.key)}
              >
                {m.degree} · {m.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Drone player */}
        <ModeDrone
          root={root}
          modeKey={modeKey}
          mode={mode}
          color={CHAR_COLOR}
        />

        {/* Mode info + scale notes with characteristic highlighted */}
        <div className="card p-4 mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {scaleNames.map((n, i) => {
              const isRoot = i === 0;
              const isChar = mode.charDegree === i;
              const degreeLabel = DEGREE_LABELS[modeKey]?.[i];
              return (
                <div
                  key={i}
                  className="px-3 py-2 rounded-lg text-sm font-bold"
                  style={{
                    background: isRoot
                      ? "rgba(37,99,235,0.18)"
                      : isChar
                      ? `${CHAR_COLOR}25`
                      : "rgba(226,232,240,0.07)",
                    color: isRoot ? "#3b82f6" : isChar ? CHAR_COLOR : "#cbd5e1",
                    border: `1px solid ${
                      isRoot
                        ? "rgba(37,99,235,0.4)"
                        : isChar
                        ? `${CHAR_COLOR}60`
                        : "rgba(226,232,240,0.1)"
                    }`,
                    position: "relative",
                    minWidth: 50,
                    textAlign: "center",
                  }}
                  title={
                    isChar
                      ? `Nota característica — ${mode.charLabel}`
                      : undefined
                  }
                >
                  <div>{n}</div>
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 600,
                      opacity: 0.7,
                      marginTop: 1,
                    }}
                  >
                    {degreeLabel}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mode description + characteristic explainer */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 240,
                fontSize: 13,
                color: "var(--text-muted)",
                lineHeight: 1.55,
              }}
            >
              {mode.desc}
            </div>
            {mode.charDegree != null && (
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: `${CHAR_COLOR}10`,
                  border: `1px solid ${CHAR_COLOR}30`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: CHAR_COLOR,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "var(--text-ultra)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Nota característica
                  </div>
                  <div
                    style={{ fontSize: 12, fontWeight: 700, color: CHAR_COLOR }}
                  >
                    {scaleNames[mode.charDegree]} · {mode.charLabel}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fretboard with characteristic note highlighted */}
        <Fretboard
          frets={15}
          highlightedNotes={notes}
          rootNote={root}
          useFlats={needsFlats(root)}
          characteristicNote={charSemi}
          characteristicColor={CHAR_COLOR}
        />

        {/* Fretboard legend */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 10,
            fontSize: 11,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#2563eb",
              }}
            />
            <span style={{ color: "var(--text-muted)" }}>Tônica ({root})</span>
          </div>
          {mode.charDegree != null && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: CHAR_COLOR,
                }}
              />
              <span style={{ color: "var(--text-muted)" }}>
                Característica ({scaleNames[mode.charDegree]} · {mode.charLabel}
                )
              </span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#e2e8f0",
              }}
            />
            <span style={{ color: "var(--text-muted)" }}>
              Demais notas do modo
            </span>
          </div>
        </div>
      </Section>
      <LessonFooter moduleId="advanced" />
    </div>
  );
}
