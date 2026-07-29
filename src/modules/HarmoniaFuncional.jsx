import { useMemo, useState } from "react";
import {
  PageHeader,
  Section,
  NotePicker,
  TheoryBlock,
  Step,
} from "../components/Common.jsx";
import {
  diatonicTriads,
  chordWithOctaves,
  noteName,
  noteIndex,
} from "../lib/theory.js";
import { playChord, playChordSequence } from "../lib/audio.js";
import { useProgress } from "../context/ProgressContext.jsx";

import LessonFooter from '../components/LessonFooter.jsx'
import CompleteToggle from '../components/CompleteToggle.jsx'
// I=Tônica, ii=Subdominante, iii=Tônica, IV=Subdominante, V=Dominante, vi=Tônica, vii°=Dominante
const DEGREE_FUNCTIONS = ["T", "S", "T", "S", "D", "T", "D"];

const FUNC = {
  T: {
    label: "Tônica",
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.12)",
    border: "rgba(96,165,250,0.28)",
  },
  S: {
    label: "Subdominante",
    color: "#c084fc",
    bg: "rgba(192,132,252,0.12)",
    border: "rgba(192,132,252,0.28)",
  },
  D: {
    label: "Dominante",
    color: "#f472b6",
    bg: "rgba(244,114,182,0.12)",
    border: "rgba(244,114,182,0.28)",
  },
};

const NUMERAL_FUNC = {
  I: "T",
  II: "S",
  III: "T",
  IV: "S",
  V: "D",
  VI: "T",
  "VII°": "D",
  bVII: "S",
  bVI: "S",
  IV: "S",
  II7: "S",
  V7: "D",
  Imaj7: "T",
  VI7: "T",
  I7: "T",
  IV7: "S",
};

function chordLabel(root, quality) {
  if (quality === "min") return root + "m";
  if (quality === "dim") return root + "°";
  return root;
}

const PROGRESSIONS = [
  {
    id: "axis",
    label: "I – V – VI – IV",
    subtitle: "Pop moderno / Axis of Awesome",
    degrees: [0, 4, 5, 3],
    description:
      'A progressão mais onipresente do pop. O "Axis of Awesome" identificou centenas de hits usando exatamente essa sequência. Funciona em qualquer tonalidade.',
    songs: [
      "Let Her Go – Passenger",
      "Let It Be – The Beatles",
      "With or Without You – U2",
      "Someone Like You – Adele",
      "Don't Stop Believin' – Journey",
    ],
  },
  {
    id: "fifties",
    label: "I – VI – IV – V",
    subtitle: "Anos 50 / Doo-wop",
    degrees: [0, 5, 3, 4],
    description:
      "Base do rock 'n' roll clássico e do doo-wop. A linha de baixo desce naturalmente, criando sensação cíclica e nostálgica.",
    songs: [
      "Stand By Me – Ben E. King",
      "Every Breath You Take – The Police",
      "Earth Angel – The Penguins",
      "Teenager in Love – Dion",
    ],
  },
  {
    id: "blues-rock",
    label: "I – IV – V – I",
    subtitle: "Blues / Rock & Roll",
    degrees: [0, 3, 4, 0],
    description:
      "T → S → D → T em sua forma mais direta. O esqueleto do blues de 12 compassos — simples, poderosa e infalível.",
    songs: [
      "Johnny B. Goode – Chuck Berry",
      "La Bamba – Ritchie Valens",
      "Wild Thing – The Troggs",
      "Louie Louie – The Kingsmen",
    ],
  },
  {
    id: "pachelbel",
    label: "I – V – VI – III – IV",
    subtitle: "Canon de Pachelbel",
    degrees: [0, 4, 5, 2, 3],
    description:
      "O baixo ostinato de Pachelbel (1680). Linha descendente com tensão e resolução contínuas. Presente em centenas de músicas dos últimos 300 anos.",
    songs: [
      "Canon in D – Pachelbel",
      "Don't Look Back in Anger – Oasis",
      "Go West – Pet Shop Boys",
      "Streets of Philadelphia – Springsteen",
    ],
  },
  {
    id: "emotional",
    label: "VI – IV – I – V",
    subtitle: "Pop emocional / Indie",
    degrees: [5, 3, 0, 4],
    description:
      "Começa no VI (relativa menor) para uma sensação introspectiva. Mesmos acordes da Axis, mas com um centro tonal diferente — mais melancólico.",
    songs: [
      "Demons – Imagine Dragons",
      "Clocks – Coldplay",
      "Africa – Toto",
      "The Sound of Silence – Simon & Garfunkel",
    ],
  },
  {
    id: "mixolydian",
    label: "I – bVII – IV – I",
    subtitle: "Rock Mixolídio",
    degrees: null,
    description:
      "O bVII é emprestado do modo Mixolídio — mesmo tônico, mas com a 7ª abaixada. Soa épico e grandioso, marca do hard rock e do southern rock.",
    songs: [
      "Sweet Home Alabama – Lynyrd Skynyrd",
      "Hey Jude – The Beatles",
      "La Grange – ZZ Top",
      "Born to Run – Bruce Springsteen",
    ],
  },
];

export default function HarmoniaFuncional() {
  const [root, setRoot] = useState("C");
  const { markLesson, isComplete } = useProgress();

  const triads = useMemo(() => diatonicTriads(root), [root]);

  function getMixolydianChords() {
    const bVIIRoot = noteName((noteIndex(root) + 10) % 12);
    return [
      { ...triads[0], numeral: "I" },
      { root: bVIIRoot, quality: "maj", numeral: "bVII" },
      { ...triads[3], numeral: "IV" },
      { ...triads[0], numeral: "I" },
    ];
  }

  function getProgChords(prog) {
    if (prog.id === "mixolydian") return getMixolydianChords();
    return prog.degrees.map((d) => ({ ...triads[d] }));
  }

  function playProgression(prog) {
    const chords = getProgChords(prog);
    const pitchArrays = chords.map((c) =>
      chordWithOctaves(c.root, c.quality, 4)
    );
    playChordSequence(pitchArrays, 1.4);
  }

  const secDoms = useMemo(
    () =>
      triads.slice(1, 6).map((t) => ({
        numeral: t.numeral,
        sdRoot: noteName((noteIndex(t.root) + 7) % 12),
      })),
    [triads]
  );

  return (
    <div>
      <PageHeader
        chip="Harmonia Funcional"
        title="Campo Harmônico & Progressões"
        description="Como cada acorde de uma tonalidade exerce uma função — e como as progressões mais famosas do pop, rock e blues exploram essas funções para criar emoção e movimento."
      />

      {/* ── 1. Campo Harmônico ─────────────────────────────────────────── */}
      <Section title="1. O Campo Harmônico">
        <TheoryBlock>
          <Step n={1}>
            <p>
              O <b>campo harmônico</b> é o conjunto de 7 acordes construídos
              sobre cada grau de uma escala maior, usando exclusivamente as
              notas dessa escala. Em C maior: C – Dm – Em – F – G – Am – B°.
            </p>
          </Step>
          <Step n={2}>
            <p>
              Cada acorde exerce uma <b>função harmônica</b>:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(FUNC).map(([k, f]) => (
                <div
                  key={k}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: f.bg, border: `1px solid ${f.border}` }}
                >
                  <span
                    className="font-bold text-sm"
                    style={{ color: f.color }}
                  >
                    {f.label}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-subtle)" }}
                  >
                    {k === "T"
                      ? "repouso — I, iii, vi"
                      : k === "S"
                      ? "movimento — ii, IV"
                      : "tensão — V, vii°"}
                  </span>
                </div>
              ))}
            </div>
          </Step>
          <Step n={3}>
            <p>
              A cadência{" "}
              <span
                className="font-mono font-bold"
                style={{ color: "#f472b6" }}
              >
                V7 → I
              </span>{" "}
              é a mais forte da música ocidental: o acorde dominante contém um
              trítono que resolve por semitom na tônica.
              <b> T → S → D → T</b> é o movimento básico de toda harmonia tonal.
            </p>
          </Step>
        </TheoryBlock>

        <div className="mt-5 mb-4">
          <NotePicker value={root} onChange={setRoot} />
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-2">
          {triads.map((triad, i) => {
            const fn = FUNC[DEGREE_FUNCTIONS[i]];
            return (
              <button
                key={i}
                onClick={() =>
                  playChord(chordWithOctaves(triad.root, triad.quality, 4), 1.5)
                }
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition hover:-translate-y-0.5 active:scale-95"
                style={{ background: fn.bg, border: `1px solid ${fn.border}` }}
                title={`Tocar ${chordLabel(triad.root, triad.quality)}`}
              >
                <span
                  className="text-[9px] font-bold uppercase tracking-wider"
                  style={{ color: fn.color }}
                >
                  {triad.numeral}
                </span>
                <span
                  className="text-sm font-extrabold leading-none"
                  style={{ color: "var(--text-base)" }}
                >
                  {chordLabel(triad.root, triad.quality)}
                </span>
                <span
                  className="text-[8px] font-semibold px-1.5 py-0.5 rounded-sm"
                  style={{ background: fn.border, color: fn.color }}
                >
                  {fn.label.slice(0, 3).toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
          Clique em qualquer acorde para ouvi-lo. Verde = Tônica · Âmbar =
          Subdominante · Vermelho = Dominante.
        </p>
      </Section>

      {/* ── 2. Funções e Substituições ─────────────────────────────────── */}
      <Section title="2. Funções e Substituições">
        <TheoryBlock>
          <p>
            Acordes com a mesma função podem se <b>substituir</b> — compartilham
            ao menos duas notas e produzem efeito harmônico similar:
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            <div
              className="p-4 rounded-xl"
              style={{
                background: FUNC.T.bg,
                border: `1px solid ${FUNC.T.border}`,
              }}
            >
              <div
                className="font-bold text-sm mb-2"
                style={{ color: FUNC.T.color }}
              >
                Tônica — I, III, VI
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                <b>vi</b> (relativa menor) substitui o I — mesmas notas, centro
                diferente. Cria emoção sem abandonar a tonalidade.
                <br />
                <b>iii</b> age como tônica ou como ponte entre T e D — tem notas
                do I e do V.
              </p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{
                background: FUNC.S.bg,
                border: `1px solid ${FUNC.S.border}`,
              }}
            >
              <div
                className="font-bold text-sm mb-2"
                style={{ color: FUNC.S.color }}
              >
                Subdominante — II, IV
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                <b>ii</b> substitui o IV — compartilham duas notas. No jazz, a
                cadência <span className="font-mono">II7→V7→I</span> é a
                subdominante mais refinada. ii7 tem "mais cor" que o IV simples.
              </p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{
                background: FUNC.D.bg,
                border: `1px solid ${FUNC.D.border}`,
              }}
            >
              <div
                className="font-bold text-sm mb-2"
                style={{ color: FUNC.D.color }}
              >
                Dominante — V, VII°
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                <b>V7</b> contém um trítono (3ª↔7ª) que resolve por semitom na
                tônica. <b>VII°</b> tem três das quatro notas do V7 — funciona
                como dominante sem a fundamental.
              </p>
            </div>
          </div>
        </TheoryBlock>
      </Section>

      {/* ── 3. Progressões Clássicas ───────────────────────────────────── */}
      <Section
        title="3. Progressões Clássicas no Pop & Rock"
        action={
          <CompleteToggle
            done={isComplete("harmonia_funcional", "progressions")}
            onClick={() => markLesson("harmonia_funcional", "progressions")}
          />
        }
      >
        <p className="text-xs mb-5" style={{ color: "var(--text-subtle)" }}>
          Tonalidade:{" "}
          <span className="font-bold" style={{ color: "var(--text-muted)" }}>
            {root} maior
          </span>
          {" — "}altere no Campo Harmônico acima para transpor todas as
          progressões.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {PROGRESSIONS.map((prog) => {
            const chords = getProgChords(prog);
            return (
              <div key={prog.id} className="card p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div
                      className="font-bold"
                      style={{ color: "var(--text-base)" }}
                    >
                      {prog.label}
                    </div>
                    <div
                      className="text-[11px] font-medium mt-0.5"
                      style={{ color: "var(--text-subtle)" }}
                    >
                      {prog.subtitle}
                    </div>
                  </div>
                  <button
                    className="btn btn-primary shrink-0"
                    style={{ fontSize: "12px", padding: "0.4rem 0.85rem" }}
                    onClick={() => playProgression(prog)}
                  >
                    Tocar
                  </button>
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  {chords.map((c, i) => {
                    const fn = FUNC[NUMERAL_FUNC[c.numeral] || "T"];
                    return (
                      <div
                        key={i}
                        className="px-2.5 py-2 rounded-lg text-center"
                        style={{
                          background: fn.bg,
                          border: `1px solid ${fn.border}`,
                          minWidth: "50px",
                        }}
                      >
                        <div
                          className="text-[9px] font-bold uppercase leading-none mb-0.5"
                          style={{ color: fn.color }}
                        >
                          {c.numeral}
                        </div>
                        <div
                          className="font-extrabold text-sm leading-none"
                          style={{ color: "var(--text-base)" }}
                        >
                          {chordLabel(c.root, c.quality)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {prog.description}
                </p>

                <div>
                  <div
                    className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: "var(--text-ultra)" }}
                  >
                    Exemplos
                  </div>
                  {prog.songs.slice(0, 4).map((s) => (
                    <div
                      key={s}
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--text-subtle)" }}
                    >
                      · {s}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── 4. ii–V–I e Jazz ──────────────────────────────────────────── */}
      <Section
        title="4. ii–V–I e a Lógica do Jazz"
        action={
          <CompleteToggle
            done={isComplete("harmonia_funcional", "ii_v_i")}
            onClick={() => markLesson("harmonia_funcional", "ii_v_i")}
          />
        }
      >
        <TheoryBlock>
          <Step n={1}>
            <p>
              O <b>II–V–I</b> é a cadência mais importante do jazz — e também
              uma das mais usadas no pop sofisticado e no bossa nova. Substitui
              o clássico IV–V–I usando um acorde de 7ª menor como subdominante,
              gerando mais tensão e cor:
            </p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {[
                {
                  numeral: "ii7",
                  label: triads[1] ? `${triads[1].root}m7` : "Dm7",
                  fn: "S",
                  desc: "Subdominante — cria movimento",
                },
                {
                  numeral: "V7",
                  label: triads[4] ? `${triads[4].root}7` : "G7",
                  fn: "D",
                  desc: "Dominante — cria tensão",
                },
                {
                  numeral: "Imaj7",
                  label: triads[0] ? `${triads[0].root}M7` : "CM7",
                  fn: "T",
                  desc: "Tônica — resolução",
                },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <button
                    className="flex flex-col items-center gap-1.5 p-4 rounded-xl transition hover:-translate-y-0.5 min-w-[70px]"
                    style={{
                      background: FUNC[c.fn].bg,
                      border: `1px solid ${FUNC[c.fn].border}`,
                    }}
                    onClick={() => {
                      const qual =
                        c.fn === "S" ? "min7" : c.fn === "D" ? "7" : "maj7";
                      const deg = c.fn === "S" ? 1 : c.fn === "D" ? 4 : 0;
                      if (triads[deg])
                        playChord(
                          chordWithOctaves(triads[deg].root, qual, 4),
                          1.5
                        );
                    }}
                  >
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: FUNC[c.fn].color }}
                    >
                      {c.numeral}
                    </span>
                    <span
                      className="text-base font-extrabold leading-none"
                      style={{ color: "var(--text-base)" }}
                    >
                      {c.label}
                    </span>
                  </button>
                  {i < 2 && (
                    <span
                      className="text-xl"
                      style={{ color: "var(--text-ultra)" }}
                    >
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Step>
          <Step n={2}>
            <p>
              <b>Conceito de rotação</b> — o ii–V–I pode começar em qualquer
              grau do campo harmônico. Em jazz, é comum "girar" o centro tonal:
              primeiro II–V–I em {root}, depois em{" "}
              {triads[3] ? triads[3].root : "F"} (IV), criando um "movimento de
              tonalidade dentro da tonalidade". Isso explica porque músicas de
              jazz parecem sempre estar "saindo" e "voltando" para casa.
            </p>
          </Step>
          <Step n={3}>
            <p>
              <b>Tritone substitution</b> — o dominante V7 pode ser substituído
              pelo acorde cujo trítono é enarmônico ao V7. Para{" "}
              {triads[4] ? `${triads[4].root}7` : "G7"}: a substituição é{" "}
              {triads[4]
                ? noteName((noteIndex(triads[4].root) + 6) % 12)
                : "Db"}
              7. Funciona porque ambos compartilham o mesmo trítono (a tensão é
              idêntica, só a cor muda).
            </p>
          </Step>
        </TheoryBlock>

        {/* ii-V-I examples in all keys */}
        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          {[
            {
              label: "Jazz básico",
              keys: ["ii7", "V7", "Imaj7"],
              note: "A célula fundamental — memorize essa tríade de acordes.",
            },
            {
              label: "ii–V–I com extensões",
              keys: ["ii9", "V7b9", "Imaj9"],
              note: "Adicionando tensões: 9ª e b9. Sons mais modernos.",
            },
            {
              label: "Turnaround I–vi–ii–V",
              keys: ["I", "vi7", "ii7", "V7"],
              note: 'A cadência de "turnaround" — retorna à tônica com movimento.',
            },
            {
              label: "Bird Blues",
              keys: ["I7", "IV7", "II7", "V7"],
              note: "Blues de Charlie Parker — mistura campo harmônico com blues.",
            },
          ].map((ex, i) => (
            <div key={i} className="card p-4">
              <div
                className="font-semibold text-sm mb-1.5"
                style={{ color: "var(--text-base)" }}
              >
                {ex.label}
              </div>
              <div className="flex gap-1.5 mb-2">
                {ex.keys.map((k, j) => (
                  <div
                    key={j}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-center flex-1"
                    style={{
                      background: "rgba(99,102,241,0.12)",
                      border: "1px solid rgba(99,102,241,0.25)",
                      color: "#818cf8",
                    }}
                  >
                    {k}
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: "var(--text-ultra)" }}>
                {ex.note}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 5. Intercâmbio Modal e Dominantes Secundárias ─────────────── */}
      <Section title="5. Intercâmbio Modal e Dominantes Secundárias">
        <TheoryBlock>
          <p>
            <b>Intercâmbio Modal</b> — emprestamos acordes de modos paralelos
            (mesma tônica, modo diferente). Em <b>{root} maior</b>:
          </p>

          <div className="flex flex-wrap gap-3 mt-2 mb-4">
            {[
              {
                chordRoot: noteName((noteIndex(root) + 10) % 12),
                quality: "maj",
                numeral: "bVII",
                from: "Mixolídio",
                desc: "Épico, grandioso. Usado em Hey Jude, Sweet Home Alabama, La Grange.",
              },
              {
                chordRoot: noteName((noteIndex(root) + 5) % 12),
                quality: "min",
                numeral: "IV",
                from: "Menor paralela",
                desc: "Sombrio e dramático. Mad World, Hotel California (pré-bridge), The Night They Drove Old Dixie Down.",
              },
              {
                chordRoot: noteName((noteIndex(root) + 8) % 12),
                quality: "maj",
                numeral: "bVI",
                from: "Menor paralela",
                desc: "Cinematográfico e inesperado. Creep (Radiohead), Let Her Go (pré-coro).",
              },
            ].map((item) => (
              <div
                key={item.numeral}
                className="flex-1 min-w-[160px] p-4 rounded-xl"
                style={{
                  background: "rgba(129,140,248,0.08)",
                  border: "1px solid rgba(129,140,248,0.22)",
                }}
              >
                <div
                  className="font-extrabold text-lg leading-none"
                  style={{ color: "#818cf8" }}
                >
                  {chordLabel(item.chordRoot, item.quality)}
                </div>
                <div className="flex items-center gap-1.5 mt-1 mb-2">
                  <span
                    className="font-mono text-xs font-bold"
                    style={{ color: "#a5b4fc" }}
                  >
                    {item.numeral}
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: "var(--text-ultra)" }}
                  >
                    de {item.from}
                  </span>
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <p>
            <b>Dominantes Secundárias</b> — aplicar um V7 antes de qualquer grau
            (exceto VII°) intensifica a resolução para aquele acorde. Notação:{" "}
            <span className="font-mono">V/X</span> = "dominante de X". Em{" "}
            <b>{root} maior</b>:
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {secDoms.map((sd) => (
              <div
                key={sd.numeral}
                className="px-3 py-1.5 rounded-lg"
                style={{
                  background: "rgba(244,114,182,0.08)",
                  border: "1px solid rgba(244,114,182,0.20)",
                }}
              >
                <span
                  className="font-mono font-bold text-xs"
                  style={{ color: "#f472b6" }}
                >
                  V/{sd.numeral}
                </span>
                <span
                  className="text-xs font-medium ml-1.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  = {sd.sdRoot}7
                </span>
              </div>
            ))}
          </div>

          <p
            className="text-xs mt-2.5 leading-relaxed"
            style={{ color: "var(--text-subtle)" }}
          >
            O mais usado é o V/V: em {root} maior ={" "}
            {noteName((noteIndex(root) + 14) % 12)}7 →{" "}
            {noteName((noteIndex(root) + 7) % 12)} → {root}. No blues, o I7 e o
            IV7 são tecnicamente dominantes secundárias da IV e da I,
            respectivamente — daí a "sujeira" característica do blues.
          </p>
        </TheoryBlock>
      </Section>
      <LessonFooter moduleId="harmonia_funcional" />
    </div>
  );
}
