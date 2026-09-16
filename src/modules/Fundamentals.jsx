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
  INTERVALS,
} from "../lib/theory.js";
import { playSequence, playInterval } from "../lib/audio.js";
import { useProgress } from "../context/ProgressContext.jsx";

import LessonFooter from "../components/LessonFooter.jsx";
import CompleteToggle from "../components/CompleteToggle.jsx";
const INTERVAL_TABLE = [
  {
    semis: 1,
    short: "2m",
    name: "Segunda Menor",
    type: "Menor",
    compound: "9ª menor",
    color: "#2563eb",
  },
  {
    semis: 2,
    short: "2M",
    name: "Segunda Maior",
    type: "Maior",
    compound: "9ª maior",
    color: "#60a5fa",
  },
  {
    semis: 3,
    short: "3m",
    name: "Terça Menor",
    type: "Menor",
    compound: null,
    color: "#2563eb",
  },
  {
    semis: 4,
    short: "3M",
    name: "Terça Maior",
    type: "Maior",
    compound: null,
    color: "#60a5fa",
  },
  {
    semis: 5,
    short: "4J",
    name: "Quarta Justa",
    type: "Justo",
    compound: "11ª",
    color: "#3b82f6",
  },
  {
    semis: 6,
    short: "TT",
    name: "Trítono",
    type: "Aug/Dim",
    compound: null,
    color: "#eab308",
  },
  {
    semis: 7,
    short: "5J",
    name: "Quinta Justa",
    type: "Justo",
    compound: null,
    color: "#3b82f6",
  },
  {
    semis: 8,
    short: "6m",
    name: "Sexta Menor",
    type: "Menor",
    compound: "13ª menor",
    color: "#2563eb",
  },
  {
    semis: 9,
    short: "6M",
    name: "Sexta Maior",
    type: "Maior",
    compound: "13ª maior",
    color: "#60a5fa",
  },
  {
    semis: 10,
    short: "7m",
    name: "Sétima Menor",
    type: "Menor",
    compound: null,
    color: "#2563eb",
  },
  {
    semis: 11,
    short: "7M",
    name: "Sétima Maior",
    type: "Maior",
    compound: null,
    color: "#60a5fa",
  },
];

const TYPE_COLORS = {
  Maior: "#60a5fa",
  Menor: "#2563eb",
  Justo: "#3b82f6",
  "Aug/Dim": "#eab308",
};

// Note frequencies (Hz) for display
const NOTE_FREQS = {
  C: 261.63,
  "C#": 277.18,
  D: 293.66,
  "D#": 311.13,
  E: 329.63,
  F: 349.23,
  "F#": 369.99,
  G: 392.0,
  "G#": 415.3,
  A: 440.0,
  "A#": 466.16,
  B: 493.88,
};

const SOUND_PROPERTIES = [
  {
    key: "altura",
    label: "Altura",
    color: "#3b82f6",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 15 L8 5 L13 11 L18 3"
          stroke="#3b82f6"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    summary: "A percepção de notas agudas e graves.",
    content: [
      "O som é vibração: moléculas de ar se comprimindo e expandindo. A frequência dessas vibrações determina a altura.",
      "Medida em Hz (Hertz = ciclos por segundo). O padrão internacional: A4 = 440 Hz (ISO 16).",
      "Dobrar a frequência = subir uma oitava. A3 = 220 Hz → A4 = 440 Hz → A5 = 880 Hz.",
      "O ouvido humano percebe de ~20 Hz até ~20.000 Hz. Notas musicais ficam entre 16 Hz e 8.000 Hz.",
    ],
    extra: (
      <div className="overflow-x-auto mt-3">
        <table className="text-xs w-full">
          <thead>
            <tr>
              {Object.keys(NOTE_FREQS).map((n) => (
                <th
                  key={n}
                  className="px-2 py-1 font-bold text-center"
                  style={{ color: "#60a5fa" }}
                >
                  {n}4
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.values(NOTE_FREQS).map((f, i) => (
                <td
                  key={i}
                  className="px-2 py-1 text-center font-mono"
                  style={{ color: "var(--text-muted)" }}
                >
                  {f}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div
          className="text-[10px] mt-1"
          style={{ color: "var(--text-subtle)" }}
        >
          Frequências em Hz da 4ª oitava (oitava central do piano)
        </div>
      </div>
    ),
  },
  {
    key: "intensidade",
    label: "Intensidade",
    color: "#eab308",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 13 L7 10 L7 13 Z" fill="#eab308" />
        <path
          d="M7 7 Q11 10 7 13"
          stroke="#eab308"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M9 5 Q15 10 9 15"
          stroke="#eab308"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M11 3 Q18 10 11 17"
          stroke="#eab308"
          strokeWidth="1.5"
          fill="none"
          opacity="0.35"
        />
      </svg>
    ),
    summary: "O volume e a força de uma nota ou frase musical.",
    content: [
      "Determinada pela amplitude da vibração: quão longe as moléculas de ar se deslocam.",
      "Medida em decibéis (dB), uma escala logarítmica: +10 dB = 2× mais alto na percepção.",
      "Na partitura, usamos italianos: pp (pianissimo) → p → mp → mf → f → ff (fortissimo).",
      "Crescendo (——<): progressivo aumento de volume. Decrescendo (>——): progressiva diminuição.",
      "O controle dinâmico é o que separa uma performance técnica de uma performance expressiva.",
    ],
    extra: (
      <div className="flex flex-wrap gap-2 mt-3">
        {[
          ["pp", "Muito suave"],
          ["p", "Suave"],
          ["mp", "Meio suave"],
          ["mf", "Meio forte"],
          ["f", "Forte"],
          ["ff", "Muito forte"],
        ].map(([sym, name]) => (
          <div
            key={sym}
            className="px-3 py-2 rounded-lg text-center"
            style={{
              background: "rgba(234,179,8,0.1)",
              border: "1px solid rgba(234,179,8,0.25)",
            }}
          >
            <div
              className="font-bold italic text-base"
              style={{ color: "#eab308" }}
            >
              {sym}
            </div>
            <div
              className="text-[10px] mt-0.5"
              style={{ color: "var(--text-subtle)" }}
            >
              {name}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    key: "timbre",
    label: "Timbre",
    color: "#2563eb",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M2 10 Q5 4 8 10 Q11 16 14 10 Q17 4 20 10"
          stroke="#2563eb"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    ),
    summary:
      'O "sotaque" de cada instrumento: por que o violão soa diferente do piano.',
    content: [
      "Quando uma corda vibra, ela não produz apenas uma frequência: produz a fundamental E seus harmônicos (múltiplos inteiros da frequência base).",
      "C4 no piano = 261 Hz + 522 Hz + 784 Hz + 1046 Hz + … cada um em proporção diferente.",
      "A mistura e intensidade relativa desses harmônicos define o timbre. Violão, piano e violino tocando C4 têm a mesma fundamental mas perfis de harmônicos completamente distintos.",
      "No violão, o ponto de ataque (ponte vs. escala vs. boca) muda o timbre: mais brilhante perto da ponte (harmônicos agudos em destaque), mais encorpado perto da boca.",
      "Na música eletrônica, síntese aditiva constrói sons combinando harmônicos; síntese subtrativa parte de um som rico e filtra frequências.",
    ],
    extra: null,
  },
  {
    key: "duracao",
    label: "Duração",
    color: "#eab308",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="11" r="3.5" stroke="#eab308" strokeWidth="1.5" />
        <path
          d="M13.5 7.5 L13.5 3"
          stroke="#eab308"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M13.5 3 L16 4.5"
          stroke="#eab308"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    summary: "Por quanto tempo uma nota soa: o ritmo da música.",
    content: [
      "A duração das notas cria o ritmo. Sem ritmo não há música: apenas frequências.",
      "Notação: Semibreve (4 tempos) → Mínima (2) → Semínima (1) → Colcheia (½) → Semicolcheia (¼).",
      "Tempo: medido em BPM (batidas por minuto). 60 BPM = 1 batida por segundo.",
      "Compasso: agrupa batidas em unidades repetíveis. 4/4 = 4 batidas por compasso, semínima = 1 tempo.",
      'Síncope: acentuação em tempos fracos: é a "virada" rítmica do blues e do jazz.',
    ],
    extra: (
      <div className="flex flex-wrap gap-2 mt-3">
        {[
          ["■■■■", "● Semibreve", "4 tempos"],
          ["■■", "◗ Mínima", "2 tempos"],
          ["■", "◉ Semínima", "1 tempo"],
          ["▪", "♪ Colcheia", "½ tempo"],
        ].map(([vis, name, dur]) => (
          <div
            key={name}
            className="px-3 py-2 rounded-lg"
            style={{
              background: "rgba(234,179,8,0.1)",
              border: "1px solid rgba(234,179,8,0.25)",
            }}
          >
            <div className="font-mono text-sm" style={{ color: "#eab308" }}>
              {vis}
            </div>
            <div
              className="text-xs font-semibold mt-0.5"
              style={{ color: "var(--text-base)" }}
            >
              {name}
            </div>
            <div
              className="text-[10px]"
              style={{ color: "var(--text-subtle)" }}
            >
              {dur}
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

export default function Fundamentals() {
  const [root, setRoot] = useState("C");
  const [selectedIv, setSelectedIv] = useState(null);
  const { markLesson, isComplete } = useProgress();

  const ivHighlight = selectedIv != null ? [0, selectedIv % 12] : [];

  const scaleNotes = useMemo(() => buildScale(root, "major"), [root]);
  const scalePitches = useMemo(
    () => scaleWithOctaves(root, "major", 4),
    [root]
  );
  const noteNames = useMemo(() => buildScaleNotes(root, "major"), [root]);

  return (
    <div>
      <PageHeader
        chip="Fundamentos"
        title="O Que é o Som Musical?"
        description="Antes de escalas e acordes, precisamos entender o material com que trabalhamos. O som tem quatro propriedades fundamentais: altura, intensidade, timbre e duração. Conhecer elas te torna um musico mais completo."
      />

      {/* ── Sound properties — texto corrido ──────────────────────────── */}
      <Section title="As quatro propriedades do som">
        <TheoryBlock>
          <p>
            O som tem quatro propriedades fundamentais que definem tudo o que
            ouvimos. Entender cada uma é o primeiro passo pra qualquer decisão
            musical consciente.
          </p>
        </TheoryBlock>

        {SOUND_PROPERTIES.map((p) => (
          <div key={p.key} style={{ marginTop: 28 }}>
            <h3
              className="font-display"
              style={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "var(--text-base)",
                margin: 0,
                marginBottom: 6,
              }}
            >
              {p.label}
              <span
                className="uppercase"
                style={{
                  marginLeft: 10,
                  fontSize: 10.5,
                  letterSpacing: "0.14em",
                  fontWeight: 700,
                  color: "var(--text-subtle)",
                }}
              >
                {p.en}
              </span>
            </h3>
            <p
              style={{
                fontSize: 14.5,
                color: "var(--text-subtle)",
                margin: "0 0 10px",
              }}
            >
              {p.summary}
            </p>
            <div
              style={{
                fontSize: 16,
                lineHeight: 1.75,
                color: "var(--text-muted)",
              }}
            >
              {p.content.map((line, i) => (
                <p key={i} style={{ margin: "8px 0" }}>
                  {line}
                </p>
              ))}
            </div>
            {p.extra}
          </div>
        ))}
      </Section>

      {/* ── Major scale ────────────────────────────────────────────────── */}
      <Section title="2. Escala Maior">
        <TheoryBlock>
          <Step n={1}>
            <p>
              Um <b>tom (T)</b> equivale a 2 semitons (duas casas no violão). Um{" "}
              <b>semitom (st)</b> é a menor distância entre duas notas (uma
              casa).
            </p>
          </Step>
          <Step n={2}>
            <p>
              A fórmula da escala maior:
              <span
                className="block mt-1.5 font-mono text-lg font-bold"
                style={{ color: "#60a5fa" }}
              >
                T - T - st - T - T - T - st
              </span>
            </p>
          </Step>
          <Step n={3}>
            <p>
              Escolha uma tônica abaixo e veja cada nota da escala no braço e no
              piano. Clique para ouvir.
            </p>
          </Step>
        </TheoryBlock>
      </Section>

      <Section
        title={`Escala de ${root} Maior`}
        action={
          <div className="flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              onClick={() => playSequence(scalePitches, 0.32, true)}
            >
              Tocar escala
            </button>
            <CompleteToggle
              done={isComplete("fundamentals", "major-scale")}
              onClick={() => markLesson("fundamentals", "major-scale")}
            />
          </div>
        }
      >
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <NotePicker value={root} onChange={setRoot} />
        </div>

        <div className="card p-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {noteNames.map((n, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-lg text-sm font-bold"
                style={{
                  background:
                    i === 0 ? "rgba(37,99,235,0.18)" : "rgba(226,232,240,0.07)",
                  color: i === 0 ? "#3b82f6" : "#cbd5e1",
                  border: `1px solid ${
                    i === 0 ? "rgba(37,99,235,0.3)" : "rgba(226,232,240,0.1)"
                  }`,
                }}
              >
                {i + 1}. {n}
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--text-subtle)" }}>
            Grau I (azul) = tônica. Graus II–VII = os outros membros da escala.
          </p>
        </div>

        <Fretboard
          frets={15}
          highlightedNotes={scaleNotes}
          rootNote={root}
          interactive
          useFlats={needsFlats(root)}
        />
      </Section>

      {/* ── Intervals ──────────────────────────────────────────────────── */}
      <Section title="3. Intervalos: a linguagem das distâncias">
        <TheoryBlock>
          <p>
            Um <b>intervalo</b> é a distância entre duas notas, contada em
            semitons. Todo acorde, escala e melodia é, em última análise, um
            conjunto de intervalos medidos a partir de uma referência.
          </p>
          <p>
            Clique para ouvir cada intervalo a partir de C4: raiz, depois
            intervalo, depois os dois juntos:
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {INTERVALS.map((iv) => (
              <Pill
                key={iv.semitones}
                onClick={() => playInterval("C4", iv.semitones)}
              >
                {iv.short} · {iv.name}
              </Pill>
            ))}
          </div>
        </TheoryBlock>
      </Section>

      {/* ── Intervalos Aprofundados ────────────────────────────────────── */}
      <Section
        title="4. Intervalos Aprofundados"
        action={
          <CompleteToggle
            done={isComplete("fundamentals", "intervalos_aprofundados")}
            onClick={() =>
              markLesson("fundamentals", "intervalos_aprofundados")
            }
          />
        }
      >
        <TheoryBlock>
          {/* Melódico vs Harmônico */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="card p-4">
              <div
                className="font-bold text-sm mb-2"
                style={{ color: "#60a5fa" }}
              >
                Intervalo Melódico
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                Duas notas tocadas em <b>sequência</b>: uma de cada vez. Forma
                melodias e escalas. Ex.: a subida de um semitom de E para F em
                um solo.
              </p>
              <div className="mt-2 flex gap-1">
                {["C4", "E4"].map((n, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 rounded text-xs font-bold"
                    style={{
                      background: "rgba(96,165,250,0.12)",
                      color: "#60a5fa",
                    }}
                  >
                    {n}
                  </div>
                ))}
                <span
                  className="text-xs self-center"
                  style={{ color: "var(--text-ultra)" }}
                >
                  → 3ª maior
                </span>
              </div>
            </div>
            <div className="card p-4">
              <div
                className="font-bold text-sm mb-2"
                style={{ color: "#2563eb" }}
              >
                Intervalo Harmônico
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                Duas notas tocadas <b>simultaneamente</b>: formam acordes e
                double stops. Ex.: C e E soando ao mesmo tempo criam uma terça
                maior harmônica.
              </p>
              <div className="mt-2 flex gap-1 items-center">
                {["C4", "E4"].map((n, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 rounded text-xs font-bold"
                    style={{
                      background: "rgba(37,99,235,0.12)",
                      color: "#2563eb",
                    }}
                  >
                    {n}
                  </div>
                ))}
                <span
                  className="text-xs"
                  style={{ color: "var(--text-ultra)" }}
                >
                  ↕ juntas
                </span>
              </div>
            </div>
          </div>

          {/* Simples vs Compostos */}
          <div className="mb-4">
            <div
              className="font-bold text-sm mb-2"
              style={{ color: "var(--text-base)" }}
            >
              Simples vs Compostos
            </div>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
              Intervalos simples ficam dentro de uma oitava (até 12 semitons).
              Compostos ultrapassam a oitava: são o intervalo simples
              correspondente mais 7 graus:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["2ª", "9ª", "1 oitava + 2ª"],
                ["4ª", "11ª", "1 oitava + 4ª"],
                ["6ª", "13ª", "1 oitava + 6ª"],
              ].map(([s, c, d]) => (
                <div key={s} className="card p-3 text-center">
                  <div
                    className="text-lg font-extrabold"
                    style={{ color: "#60a5fa" }}
                  >
                    {s}
                  </div>
                  <div
                    className="text-xs my-1"
                    style={{ color: "var(--text-ultra)" }}
                  >
                    +8va =
                  </div>
                  <div
                    className="text-lg font-extrabold"
                    style={{ color: "#eab308" }}
                  >
                    {c}
                  </div>
                  <div
                    className="text-[10px] mt-1"
                    style={{ color: "var(--text-subtle)" }}
                  >
                    {d}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* A Regra Mais Importante */}
          <div
            className="card p-4 mb-4"
            style={{ borderLeft: "3px solid #eab308" }}
          >
            <div
              className="font-bold text-sm mb-2"
              style={{ color: "#eab308" }}
            >
              A Regra Mais Importante
            </div>
            <p
              className="text-xs leading-relaxed mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              Intervalos são contados pela <b>posição numérica das notas</b>,
              não pelos semitons. C→D# é sempre uma
              <b> segunda</b> (aumentada), porque D é a segunda nota acima de C
              xmesmo que D# soe "mais longe" que Eb.
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {[
                { from: "C", to: "D#", label: "2ª Aumentada", ok: true },
                { from: "C", to: "Eb", label: "3ª Menor", ok: true },
                { from: "C", to: "D#", label: "3ª", ok: false },
              ].map((ex, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
                  style={{
                    background: ex.ok
                      ? "rgba(59,130,246,0.08)"
                      : "rgba(234,179,8,0.08)",
                    border: `1px solid ${
                      ex.ok ? "rgba(59,130,246,0.2)" : "rgba(234,179,8,0.2)"
                    }`,
                  }}
                >
                  <span style={{ color: ex.ok ? "#60a5fa" : "#eab308" }}>
                    {ex.ok ? "✓" : "✗"}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {ex.from}→{ex.to} = {ex.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enarmonia */}
          <div className="card p-4 mb-4">
            <div
              className="font-bold text-sm mb-2"
              style={{ color: "#eab308" }}
            >
              Enarmonia
            </div>
            <p
              className="text-xs leading-relaxed mb-2"
              style={{ color: "var(--text-muted)" }}
            >
              O mesmo som pode ter dois nomes dependendo do contexto.{" "}
              <b>C# = Db</b>: mesma tecla no piano, nomes diferentes. No X°7
              (diminuto), a 7ª é chamada de <b>Bbb</b> (si dobrado bemol), não
              de A: porque a 7ª nota acima de C é B, e precisamos de uma 7ª
              diminuta, não uma 6ª maior.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                ["C#", "Db", "2ª"],
                ["F#", "Gb", "4ª"],
                ["G#", "Ab", "5ª"],
                ["A#", "Bb", "6ª"],
                ["Bbb", "A", "7ª dim (X°7)"],
              ].map(([a, b, ctx]) => (
                <div
                  key={a}
                  className="text-xs px-2.5 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(234,179,8,0.08)",
                    border: "1px solid rgba(234,179,8,0.2)",
                  }}
                >
                  <span style={{ color: "#eab308", fontWeight: 700 }}>{a}</span>
                  <span style={{ color: "var(--text-ultra)" }}> = </span>
                  <span style={{ color: "#eab308", fontWeight: 700 }}>{b}</span>
                  <span style={{ color: "var(--text-subtle)", fontSize: 10 }}>
                    {" "}
                    ({ctx})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TheoryBlock>

        {/* Interval type table */}
        <div className="mb-4">
          <div
            className="text-sm font-semibold mb-2"
            style={{ color: "var(--text-base)" }}
          >
            Tipos de Intervalos
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5 text-xs">
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: color,
                  }}
                />
                <span style={{ color: "var(--text-subtle)" }}>{type}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {INTERVAL_TABLE.map((iv) => {
              const isSelected = selectedIv === iv.semis;
              return (
                <button
                  key={iv.semis}
                  onClick={() => {
                    setSelectedIv(isSelected ? null : iv.semis);
                    playInterval("C4", iv.semis);
                  }}
                  className="card p-3 text-left transition hover:-translate-y-0.5"
                  style={{
                    border: isSelected ? `1px solid ${iv.color}60` : undefined,
                    background: isSelected ? `${iv.color}10` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="font-mono font-extrabold text-base"
                      style={{ color: iv.color }}
                    >
                      {iv.short}
                    </span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase"
                      style={{
                        background: `${TYPE_COLORS[iv.type]}18`,
                        color: TYPE_COLORS[iv.type],
                      }}
                    >
                      {iv.type}
                    </span>
                  </div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: "var(--text-base)" }}
                  >
                    {iv.name}
                  </div>
                  <div
                    className="text-[10px] mt-0.5"
                    style={{ color: "var(--text-ultra)" }}
                  >
                    {iv.semis} semitom{iv.semis !== 1 ? "s" : ""}
                  </div>
                  {iv.compound && (
                    <div
                      className="text-[10px] mt-0.5"
                      style={{ color: "#eab30880" }}
                    >
                      = {iv.compound}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fretboard mapping */}
        <div>
          <div
            className="text-sm font-semibold mb-1"
            style={{ color: "var(--text-base)" }}
          >
            Mapeamento no braço
            {selectedIv != null
              ? `: ${
                  INTERVAL_TABLE.find((iv) => iv.semis === selectedIv)?.name
                } a partir de C`
              : ""}
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--text-ultra)" }}>
            {selectedIv != null
              ? "Rosa = C (tônica). Roxo = todas as posições do intervalo selecionado."
              : "Clique em um intervalo acima para ver todas as suas posições no braço a partir de C."}
          </p>
          <Fretboard
            frets={15}
            highlightedNotes={ivHighlight}
            rootNote="C"
            interactive={false}
            showNoteNames={true}
          />
        </div>
      </Section>
      <LessonFooter moduleId="fundamentals" />
    </div>
  );
}
