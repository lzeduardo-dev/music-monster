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
  buildChord,
  buildChordNotes,
  chordWithOctaves,
  needsFlats,
  CHORDS,
  ARPEGGIO_GROUPS,
} from "../lib/theory.js";
import { playSequence, playChord } from "../lib/audio.js";
import { useProgress } from "../context/ProgressContext.jsx";

import LessonFooter from "../components/LessonFooter.jsx";
import CompleteToggle from '../components/CompleteToggle.jsx'
export default function Arpejos() {
  const [root, setRoot] = useState("G");
  const [chordKey, setChordKey] = useState("7");
  const [playMode, setPlayMode] = useState("asc"); // asc | chord
  const { markLesson, isComplete } = useProgress();

  const arpNotes = useMemo(() => buildChord(root, chordKey), [root, chordKey]);
  const arpPitches = useMemo(
    () => chordWithOctaves(root, chordKey, 4),
    [root, chordKey]
  );

  const handlePlay = async () => {
    if (playMode === "asc") {
      await playSequence(
        [...arpPitches, arpPitches[0].replace(/\d/, (d) => String(+d + 1))],
        0.3,
        false
      );
    } else {
      await playChord(arpPitches, 1.4);
    }
  };

  const currentInfo = CHORDS[chordKey];

  return (
    <div>
      <PageHeader
        chip="Arpejos"
        title="Arpejos: a espinha dorsal dos solos"
        description="Um arpejo é o acorde tocado nota por nota. Tocar o arpejo do acorde da harmonia garante que cada nota do seu solo pertença ao momento — é o segredo de solos que 'cantam' a música."
      />

      <Section title="1. Por que usar arpejos?">
        <TheoryBlock>
          <Step n={1}>
            <p>
              Arpejo é tocar as notas de um acorde individualmente em vez de
              todas de uma vez. Ele funciona como uma "ponte" entre a harmonia e
              o solo, trazendo melodia à base. Diferente das escalas, o arpejo
              foca apenas nas notas que formam o acorde específico. É essencial
              para criar solos que soam conectados aos acordes que estão soando.
              Na prática, é a técnica de "desmontar" o bloco sonoro em uma
              sequência de notas.
            </p>
          </Step>
          <Step n={2}>
            <p>
              A técnica consiste em identificar qual acorde está soando em cada
              momento e então priorizar as notas daquele arpejo nas suas frases,
              especialmente nos tempos fortes.
            </p>
          </Step>
          <Step n={3}>
            <p>
              Para o blues: o arpejo dominante <b>X7</b> funciona sobre os três
              acordes da progressão I7 – IV7 – V7. No jazz, Xm7 sobre o II e X7
              sobre o V criam a cadência <b>II-V-I</b>.
            </p>
          </Step>
        </TheoryBlock>
      </Section>

      {/* Group selector */}
      {ARPEGGIO_GROUPS.map((group) => (
        <div key={group.title} className="mb-2">
          <span className={`${group.chip} chip`}>{group.title}</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {group.items.map((item) => (
              <Pill
                key={item.key}
                active={chordKey === item.key}
                tone={
                  group.chip === "chip-amber"
                    ? "amber"
                    : group.chip === "chip-coral"
                    ? "coral"
                    : "emerald"
                }
                onClick={() => setChordKey(item.key)}
              >
                {item.label}{" "}
                <span className="opacity-60 ml-1">{item.desc}</span>
              </Pill>
            ))}
          </div>
        </div>
      ))}

      <Section
        title={`Arpejo: ${currentInfo.name}`}
        action={
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1">
              <Pill
                active={playMode === "asc"}
                onClick={() => setPlayMode("asc")}
              >
                Ascendente
              </Pill>
              <Pill
                active={playMode === "chord"}
                onClick={() => setPlayMode("chord")}
              >
                Acorde
              </Pill>
            </div>
            <button className="btn btn-primary" onClick={handlePlay}>
              ▶ Tocar
            </button>
            <CompleteToggle
              done={isComplete("arpejos", chordKey)}
              onClick={() => markLesson("arpejos", chordKey)}
            />
          </div>
        }
      >
        <div className="flex flex-wrap gap-3 mb-4">
          <NotePicker value={root} onChange={setRoot} />
        </div>

        {/* Notes display */}
        <div className="card p-4 mb-4 flex flex-wrap gap-2">
          {buildChordNotes(root, chordKey).map((n, i) => {
            const intervals = currentInfo.intervals;
            const degreeLabels = ["R", "3", "5", "7", "9"];
            const degreeLabel = degreeLabels[i] || String(i + 1);
            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="px-4 py-2 rounded-xl text-sm font-bold"
                  style={{
                    background:
                      i === 0
                        ? "rgba(37,99,235,0.18)"
                        : "rgba(226,232,240,0.07)",
                    color: i === 0 ? "#3b82f6" : "#cbd5e1",
                    border: `1px solid ${
                      i === 0 ? "rgba(37,99,235,0.3)" : "rgba(226,232,240,0.1)"
                    }`,
                  }}
                >
                  {n}
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {degreeLabel}
                </div>
              </div>
            );
          })}
        </div>

        <Fretboard
          frets={15}
          highlightedNotes={arpNotes}
          rootNote={root}
          showNoteNames
          useFlats={needsFlats(root)}
        />
      </Section>

      {/* ── Tríade vs Tétrade ──────────────────────────────────────────── */}
      <Section title="2. Tríade vs Tétrade — Comparação">
        <TheoryBlock>
          <Step n={1}>
            <p>
              Uma <b>tríade</b> (1–3–5) é a versão mais compacta do acorde —
              três notas, som direto. Uma <b>tétrade</b> adiciona a 7ª, criando
              mais cor e ambiguidade — o vocabulário do jazz e do pop moderno.
              No braço, a tétrade usa 4 notas mas ocupa basicamente a mesma
              região da tríade.
            </p>
          </Step>
        </TheoryBlock>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {[
            {
              type: "Tríade",
              label: "Maior",
              key: "maj",
              formula: "1–3–5",
              color: "#60a5fa",
            },
            {
              type: "Tétrade",
              label: "7ª Maior (M7)",
              key: "maj7",
              formula: "1–3–5–7",
              color: "#818cf8",
            },
            {
              type: "Tríade",
              label: "Menor",
              key: "min",
              formula: "1–b3–5",
              color: "#a78bfa",
            },
            {
              type: "Tétrade",
              label: "7ª Menor (m7)",
              key: "min7",
              formula: "1–b3–5–b7",
              color: "#c084fc",
            },
            {
              type: "Tríade",
              label: "Dominante",
              key: "maj",
              formula: "1–3–5",
              color: "#f472b6",
            },
            {
              type: "Tétrade",
              label: "Dom. 7 (X7)",
              key: "7",
              formula: "1–3–5–b7",
              color: "#fb7185",
            },
            {
              type: "Tríade",
              label: "Diminuto",
              key: "dim",
              formula: "1–b3–b5",
              color: "#94a3b8",
            },
            {
              type: "Tétrade",
              label: "Dim. 7 (°7)",
              key: "dim7",
              formula: "1–b3–b5–bb7",
              color: "#64748b",
            },
          ].map((item, i) => {
            const names = buildChordNotes(root, item.key);
            return (
              <button
                key={i}
                onClick={() => {
                  setChordKey(item.key);
                  playChord(chordWithOctaves(root, item.key, 4), 1.2);
                }}
                className="card p-4 text-left hover:-translate-y-0.5 transition-transform"
                style={{ borderLeft: `2px solid ${item.color}40` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span
                      className="text-[10px] uppercase tracking-widest font-bold mr-2"
                      style={{ color: item.color }}
                    >
                      {item.type}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "var(--text-base)" }}
                    >
                      {root} {item.label}
                    </span>
                  </div>
                  <span
                    className="text-[10px]"
                    style={{ color: "var(--text-ultra)" }}
                  >
                    {item.formula}
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {names.map((n, j) => (
                    <span
                      key={j}
                      className="px-2 py-0.5 rounded-md text-xs font-bold"
                      style={{
                        background:
                          j === 0 ? `${item.color}25` : "var(--ink-05)",
                        color: j === 0 ? item.color : "var(--text-muted)",
                        border: `1px solid ${
                          j === 0 ? item.color + "40" : "transparent"
                        }`,
                      }}
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-xs" style={{ color: "var(--text-ultra)" }}>
          Clique em qualquer card para ver o arpejo no braço e ouvi-lo.
        </p>
      </Section>

      <Section title="3. Aplicação: ii – V – I em Dó Maior">
        <TheoryBlock>
          <p>
            A progressão <b>ii-V-I</b> é o movimento harmônico mais usado no
            jazz e está presente em imensas músicas de pop, soul e MPB. Em Dó
            maior:
          </p>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              {
                numeral: "II",
                chord: "Dm7",
                key: "min7",
                root: "D",
                desc: "Preparo — tensão leve",
                color: "rgba(129,140,248,0.15)",
                borderColor: "rgba(129,140,248,0.3)",
                textColor: "#818cf8",
              },
              {
                numeral: "V",
                chord: "G7",
                key: "7",
                root: "G",
                desc: "Dominante — tensão máx.",
                color: "rgba(244,114,182,0.15)",
                borderColor: "rgba(244,114,182,0.3)",
                textColor: "#f472b6",
              },
              {
                numeral: "I",
                chord: "CM7",
                key: "maj7",
                root: "C",
                desc: "Tônica — resolução",
                color: "rgba(37,99,235,0.15)",
                borderColor: "rgba(37,99,235,0.3)",
                textColor: "#3b82f6",
              },
            ].map((item) => (
              <button
                key={item.numeral}
                onClick={() => {
                  playChord(chordWithOctaves(item.root, item.key, 4), 1.2);
                }}
                className="p-3 rounded-xl border text-left transition hover:opacity-90"
                style={{
                  background: item.color,
                  borderColor: item.borderColor,
                  color: item.textColor,
                }}
              >
                <div className="font-bold text-lg">{item.numeral}</div>
                <div className="font-semibold">{item.chord}</div>
                <div className="text-xs opacity-75 mt-1">{item.desc}</div>
              </button>
            ))}
          </div>
          <p className="mt-3">
            Para improvisar: use <b>Dm7 arpejo</b> sobre o ii, <b>G7 arpejo</b>{" "}
            (ou escala alterada) sobre o V, e <b>CM7 arpejo</b> (ou escala
            maior) sobre o I. Isso é a gramática do jazz.
          </p>
        </TheoryBlock>
      </Section>

      <Section title="4. Arpejos no Blues — I7, IV7, V7">
        <TheoryBlock>
          <p>
            No blues padrão em <b>A</b>, os três acordes são todos dominantes
            (7ª menor). O arpejo X7 funciona sobre todos eles:
          </p>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { numeral: "I7", chord: "A7", root: "A", key: "7" },
              { numeral: "IV7", chord: "D7", root: "D", key: "7" },
              { numeral: "V7", chord: "E7", root: "E", key: "7" },
            ].map((item) => (
              <button
                key={item.numeral}
                onClick={() =>
                  playChord(chordWithOctaves(item.root, item.key, 4), 1.2)
                }
                className="p-3 rounded-xl border text-left hover:opacity-90 transition"
                style={{
                  background: "rgba(37,99,235,0.1)",
                  borderColor: "rgba(37,99,235,0.25)",
                  color: "#60a5fa",
                }}
              >
                <div className="font-bold text-lg">{item.numeral}</div>
                <div className="font-semibold">{item.chord}</div>
                <div className="text-xs opacity-75">1 – 3 – 5 – b7</div>
              </button>
            ))}
          </div>
          <p className="mt-3">
            Nos momentos de troca de acorde, toque a nota raiz ou a 3ª do arpejo
            correspondente — isso cria a sensação de que o solo "move com" a
            harmonia.
          </p>
        </TheoryBlock>
      </Section>
      <LessonFooter moduleId="arpejos" />
    </div>
  );
}
