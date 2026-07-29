import { useState } from "react";
import {
  PageHeader,
  Section,
  TheoryBlock,
  Step,
} from "../components/Common.jsx";
import TabBlock from "../components/TabBlock.jsx";
import { useProgress } from "../context/ProgressContext.jsx";

import LessonFooter from "../components/LessonFooter.jsx";
import CompleteToggle from '../components/CompleteToggle.jsx'
// ─── Re-exported shape diagram helpers ──────────────────────────────────────

const SHAPE_PATTERNS = {
  box1: {
    label: "Caixa 1",
    span: 4,
    dots: [
      [1, 0, true],
      [1, 3, false],
      [2, 0, false],
      [2, 3, false],
      [3, 0, false],
      [3, 2, false],
      [4, 0, false],
      [4, 2, true],
      [5, 0, false],
      [5, 2, false],
      [6, 0, true],
      [6, 3, false],
    ],
  },
  box2: {
    label: "Caixa 2",
    span: 4,
    dots: [
      [1, 0, false],
      [1, 3, false],
      [2, 1, false],
      [2, 3, true],
      [3, 0, false],
      [3, 2, false],
      [4, 0, true],
      [4, 2, false],
      [5, 0, false],
      [5, 3, false],
      [6, 0, false],
      [6, 3, false],
    ],
  },
  box3: {
    label: "Caixa 3",
    span: 4,
    dots: [
      [1, 0, false],
      [1, 3, false],
      [2, 0, true],
      [2, 3, false],
      [3, 0, false],
      [3, 2, false],
      [4, 0, false],
      [4, 2, false],
      [5, 1, false],
      [5, 3, true],
      [6, 0, false],
      [6, 3, false],
    ],
  },
  box4: {
    label: "Caixa 4",
    span: 4,
    dots: [
      [1, 0, false],
      [1, 3, true],
      [2, 1, false],
      [2, 3, false],
      [3, 0, true],
      [3, 2, false],
      [4, 0, false],
      [4, 2, false],
      [5, 0, false],
      [5, 2, false],
      [6, 0, false],
      [6, 3, true],
    ],
  },
  box5: {
    label: "Caixa 5",
    span: 4,
    dots: [
      [1, 0, true],
      [1, 2, false],
      [2, 1, false],
      [2, 3, false],
      [3, 0, false],
      [3, 2, false],
      [4, 0, true],
      [4, 2, false],
      [5, 0, false],
      [5, 2, false],
      [6, 0, true],
      [6, 2, false],
    ],
  },
  bbking: {
    label: "Caixa B.B. King",
    span: 4,
    dots: [
      [1, 0, true],
      [1, 3, false],
      [2, 0, false],
      [2, 3, false],
      [3, 1, false],
    ],
  },
  open: {
    label: "Posição Aberta",
    span: 4,
    dots: [
      [1, 0, true],
      [1, 3, false],
      [2, 0, false],
      [2, 3, false],
      [3, 0, false],
      [3, 2, false],
      [4, 0, false],
      [4, 2, true],
      [5, 0, false],
      [5, 2, false],
      [6, 0, true],
      [6, 3, false],
    ],
  },
};

function parseShape(shapeStr) {
  if (!shapeStr) return null;
  let key = null;
  if (/B\.?B\.?/i.test(shapeStr) && /caixa/i.test(shapeStr)) key = "bbking";
  else if (/caixa\s*1\b/i.test(shapeStr)) key = "box1";
  else if (/caixa\s*2\b/i.test(shapeStr)) key = "box2";
  else if (/caixa\s*3\b/i.test(shapeStr)) key = "box3";
  else if (/caixa\s*4\b/i.test(shapeStr)) key = "box4";
  else if (/caixa\s*5\b/i.test(shapeStr)) key = "box5";
  else if (/aberta/i.test(shapeStr)) key = "open";
  const m = shapeStr.match(/(\d+)\s*ª/);
  const startFret = m ? parseInt(m[1], 10) : 0;
  return { key, startFret, fullLabel: shapeStr };
}

const FRET_MARKER_SINGLE = new Set([3, 5, 7, 9, 15, 17, 19, 21]);
const FRET_MARKER_DOUBLE = new Set([12, 24]);

function ShapeDiagram({ shape, color }) {
  const parsed = parseShape(shape);
  const pattern = parsed?.key ? SHAPE_PATTERNS[parsed.key] : null;

  if (!pattern) {
    return (
      <div
        style={{
          padding: "10px 12px",
          background: "var(--ink-03)",
          border: `1px solid ${color}25`,
          borderRadius: 10,
          fontSize: 12,
          color: "var(--text-muted)",
          lineHeight: 1.5,
        }}
      >
        {shape}
      </div>
    );
  }

  const STRINGS = 6,
    FRETS = pattern.span;
  const STR_GAP = 18,
    FRET_GAP = 26;
  const PAD_L = 38,
    PAD_T = 22,
    PAD_R = 28,
    PAD_B = 22;
  const W = PAD_L + (STRINGS - 1) * STR_GAP + PAD_R;
  const H = PAD_T + FRETS * FRET_GAP + PAD_B;
  const DOT_R = 7;
  const colX = (s) => PAD_L + (STRINGS - s) * STR_GAP;
  const rowY = (f) => PAD_T + f * FRET_GAP;
  const STRING_NAMES = ["E", "A", "D", "G", "B", "e"];

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.42), rgba(0,0,0,0.28))",
        border: `1px solid ${color}30`,
        borderRadius: 12,
        padding: "12px 16px",
        display: "inline-flex",
        alignItems: "center",
        gap: 18,
        flexWrap: "wrap",
      }}
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ flexShrink: 0 }}
      >
        {Array.from({ length: STRINGS }, (_, i) => {
          const s = STRINGS - i;
          return (
            <text
              key={`sl${s}`}
              x={colX(s)}
              y={PAD_T - 7}
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="var(--text-ultra)"
              opacity={0.7}
            >
              {STRING_NAMES[s - 1]}
            </text>
          );
        })}
        {Array.from({ length: STRINGS }, (_, i) => {
          const s = i + 1;
          return (
            <line
              key={`s${s}`}
              x1={colX(s)}
              y1={rowY(0)}
              x2={colX(s)}
              y2={rowY(FRETS)}
              stroke={`${color}80`}
              strokeWidth={0.9}
            />
          );
        })}
        {Array.from({ length: FRETS }, (_, f) => {
          const af = parsed.startFret + f;
          if (FRET_MARKER_DOUBLE.has(af)) {
            const x1 = (colX(5) + colX(4)) / 2,
              x2 = (colX(3) + colX(2)) / 2;
            return (
              <g key={`fm${f}`} opacity={0.18}>
                <circle cx={x1} cy={rowY(f + 0.5)} r={3} fill="white" />
                <circle cx={x2} cy={rowY(f + 0.5)} r={3} fill="white" />
              </g>
            );
          }
          if (FRET_MARKER_SINGLE.has(af)) {
            const x = (colX(4) + colX(3)) / 2;
            return (
              <circle
                key={`fm${f}`}
                cx={x}
                cy={rowY(f + 0.5)}
                r={3}
                fill="white"
                opacity={0.18}
              />
            );
          }
          return null;
        })}
        {Array.from({ length: FRETS + 1 }, (_, f) => {
          const isNut = parsed.startFret === 0 && f === 0;
          return (
            <line
              key={`f${f}`}
              x1={colX(STRINGS) - 0.5}
              y1={rowY(f)}
              x2={colX(1) + 0.5}
              y2={rowY(f)}
              stroke={isNut ? "#e2e8f0" : `${color}80`}
              strokeWidth={isNut ? 3.5 : 0.9}
            />
          );
        })}
        {parsed.startFret > 0 && (
          <text
            x={colX(STRINGS) - 10}
            y={rowY(0.5) + 4}
            textAnchor="end"
            fontSize="11"
            fontWeight="800"
            fill={color}
          >
            {parsed.startFret}fr
          </text>
        )}
        {Array.from({ length: FRETS }, (_, f) => {
          const af = parsed.startFret + f;
          if (af === 0) return null;
          return (
            <text
              key={`fn${f}`}
              x={colX(1) + 9}
              y={rowY(f + 0.5) + 3}
              textAnchor="start"
              fontSize="8"
              fontWeight="600"
              fill="var(--text-ultra)"
              opacity={0.6}
            >
              {af}
            </text>
          );
        })}
        {pattern.dots.map(([s, f, isRoot], i) => (
          <g key={i}>
            <circle
              cx={colX(s)}
              cy={rowY(f + 0.5)}
              r={DOT_R}
              fill={isRoot ? color : "#e2e8f0"}
              stroke={isRoot ? color : `${color}60`}
              strokeWidth={1}
            />
            {isRoot && (
              <text
                x={colX(s)}
                y={rowY(f + 0.5) + 3}
                textAnchor="middle"
                fontSize="8"
                fontWeight="800"
                fill="#0b1220"
              >
                R
              </text>
            )}
          </g>
        ))}
      </svg>
      <div style={{ minWidth: 0, maxWidth: 200 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 4,
          }}
        >
          Shape · Posição
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "var(--text-base)",
            lineHeight: 1.2,
            marginBottom: 4,
          }}
        >
          {pattern.label}
        </div>
        <div
          style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}
        >
          {parsed.fullLabel.replace(/^[^·]+·\s*/, "").trim()}
        </div>
      </div>
    </div>
  );
}

// ─── Blues Clichês data (10 frases atemporais) ───────────────────────────────

const BLUES_CLICHES = [
  {
    id: "bb-box",
    title: "A Caixa B.B. King",
    subtitle: "O lick mais reconhecível do blues",
    key: "Lá menor (Am)",
    shape: "Caixa B.B. King · 12ª–15ª casa · cordas e/B/G",
    tempo: "80 BPM",
    timeSig: "4/4",
    tab: [
      "e|------------------------------------------------|",
      "B|--- 13b15r13~~~------- 10-(10)~~~---------------|",
      "G|----------------- 12-10---------- 12-(12)~~-----|",
      "D|------------------------------------------------|",
      "A|------------------------------------------------|",
      "E|------------------------------------------------|",
    ],
    techniques: [
      "Bend & release",
      "Vibrato lateral (borboleta)",
      "Sustain longo",
    ],
    description:
      'A "caixa" do B.B. fica numa região pequena do braço (4 casas, 3 cordas) mas tem som infinito. Funciona em qualquer blues, em qualquer tom.',
    tip: "Pratique aplicar essa caixa em 5 tons diferentes (A, C, D, E, G). Quando virar reflexo, você pode improvisar blues em qualquer situação usando só essas notas.",
  },
  {
    id: "albert-king",
    title: "O Bend de (Albert King)",
    subtitle: "Bend de terça menor que parece chorar",
    key: "Mi menor (Em)",
    shape: "Caixa 1 (Em pent) · 12ª casa",
    tempo: "70 BPM",
    timeSig: "12/8",
    tab: [
      "e|------------------------------------------------|",
      "B|--- 15b17~~~------ 15-12----- 12~~~-------------|",
      "G|--------------------------- 14------- 14b16-----|",
      "D|------------------------------------------------|",
      "A|------------------------------------------------|",
      "E|------------------------------------------------|",
    ],
    techniques: [
      "Bend de 1½ tom (terça menor)",
      "Vibrato pesado",
      "Frase descendente",
    ],
    description:
      'Albert King famou esse bend "exagerado" — usa cordas leves pra dobrar UMA E MEIA TOM. Soa como uma voz chorando. SRV, Hendrix e Clapton roubaram tudo do Albert.',
    tip: "Use cordas finas (.009 ou .010). Bend de 1½ tom em corda .013 (SRV usava) é fisicamente brutal. Mesmo Albert usava cordas finas — segredo escondido por anos.",
  },
  {
    id: "turnaround-a",
    title: "Turnaround clássico em Lá",
    subtitle: 'A "volta" que termina o blues',
    key: "Lá maior (A)",
    shape: "Posição aberta · 0ª–5ª casa",
    tempo: "88 BPM",
    timeSig: "4/4",
    tab: [
      "e|--- 5-3-2-0--- 5-3-2---------- 3---------------|",
      "B|------------- 0------ 2-3-2--- 0---------------|",
      "G|------------------------------ 2---------------|",
      "D|----------------------------------- 0----------|",
      "A|------------------------------------- 3---------|",
      "E|------------------------------------------------|",
    ],
    techniques: [
      "Cromatismo descendente",
      "Linha de baixo melódica",
      "Resolução em V (E7)",
    ],
    description:
      "Todo blues de 12 compassos TERMINA com algum tipo de turnaround. Esse é o mais clássico em Lá: descida cromática + linha de baixo + chegada no V (E7).",
    tip: "Esse turnaround existe em DEZENAS de variações — Robert Johnson, Big Bill Broonzy, T-Bone Walker têm versões diferentes. Aprenda essa e depois explore as outras.",
  },
  {
    id: "chuck-berry",
    title: "Double-stop ascendente (Chuck Berry)",
    subtitle: "O lick que inventou o rock'n'roll",
    key: "Lá maior (A)",
    shape: "Double-stops em terças · 5ª casa",
    tempo: "120 BPM",
    timeSig: "4/4",
    tab: [
      "e|--- 5-5----- 7-7---- 9-9---- 7-7----- 5-5-------|",
      "B|--- 5-5----- 7-7---- 9-9---- 7-7----- 5-5-------|",
      "G|------------------------------------------------|",
      "D|------------------------------------------------|",
      "A|------------------------------------------------|",
      "E|------------------------------------------------|",
    ],
    techniques: [
      "Double-stop em terças",
      "Movimento ascendente",
      "Bend leve nas cordas duplas",
    ],
    description:
      'Chuck Berry inventou esse double-stop em "Johnny B. Goode" (1958). Sem ele, não existiria Keith Richards, Angus Young, ou qualquer rock baseado em cordas duplas.',
    tip: 'Toque com palheta DOWN em todas as notas — sem alternate picking. A "pegada de country/honky-tonk" vem dessa rigidez.',
  },
  {
    id: "blue-note-slide",
    title: "Slide da Blue Note",
    subtitle: "A b5 que define o blues",
    key: "Sol menor (Gm)",
    shape: "Caixa 1 (Gm pent) · 3ª casa",
    tempo: "88 BPM",
    timeSig: "4/4",
    tab: [
      "e|------------------------------------------------|",
      "B|------- 3-6/7---- 6\\3----- 6~~------------------|",
      "G|--- 3-5------ 5-3---- 5-3---- 3-----------------|",
      "D|------------------------------------------------|",
      "A|------------------------------------------------|",
      "E|------------------------------------------------|",
    ],
    techniques: [
      "Slide ascendente 6→7",
      "Slide descendente 7→3",
      "Blue note (b5) como nota de passagem",
    ],
    description:
      'A nota "blue" (b5) é a alma do blues — passa rápido entre a 4ª e a 5ª. Aqui o slide 6→7 imita exatamente o efeito de "deslizar pela tensão".',
    tip: 'NÃO pause na blue note. Ela é "nota de passagem" — fica no ar por meia colcheia no máximo. Se você pausar, vira jazz.',
  },
  {
    id: "pentatonic-descent",
    title: "Frase descendente",
    subtitle: "Pentatônica caindo em cascata",
    key: "Mi menor (Em)",
    shape: "Caixa 1 (Em pent) · 12ª casa",
    tempo: "108 BPM",
    timeSig: "4/4",
    tab: [
      "e|------ 15-12----- 15-12----- 15-12--------------|",
      "B|--------------- 15------ 15------- 13-(13)~~----|",
      "G|------- 14---------- 14--------- 14-------------|",
      "D|------------------------------------------------|",
      "A|------------------------------------------------|",
      "E|------------------------------------------------|",
    ],
    techniques: [
      "Frase descendente pentatônica",
      "Repetição de motivo",
      "Resolução em vibrato",
    ],
    description:
      'Lick "molhado" de Hendrix/Page — três pares de notas DESCENDENTES criam sensação de "queda d\'água".',
    tip: 'A REPETIÇÃO é o que vende o lick. Não tente "variar". Toque 3 vezes idêntico, e ATÉ a 4ª vez. A repetição cria hipnose.',
  },
  {
    id: "hammer-cascade",
    title: "Cascata hammer-pull",
    subtitle: "Velocidade sem palheta",
    key: "Lá menor (Am)",
    shape: "Caixa 1 (Am pent) · 5ª casa",
    tempo: "116 BPM",
    timeSig: "4/4",
    tab: [
      "e|------------------------------------------------|",
      "B|--- 5h8p5---- 5h8p5---- 5h8p5---- 5h8p5---------|",
      "G|---------- 5---------- 5---------- 5------------|",
      "D|------------------------------------------------|",
      "A|------------------------------------------------|",
      "E|------------------------------------------------|",
    ],
    techniques: [
      "Hammer-on + pull-off",
      "Trinado pentatônico",
      "Apenas 1 palhetada por grupo",
    ],
    description:
      "Trinado clássico do blues rock — palheta NA PRIMEIRA NOTA SÓ. Hammer 5→8 e pull 8→5 sai com o dedo. Velocidade triplica sem esforço.",
    tip: "Pratique APENAS o hammer-pull (5h8p5) em UMA corda por 5 minutos. Esse padrão funciona em QUALQUER pentatônica menor.",
  },
  {
    id: "walking-blues",
    title: "Walking bass + pentatônica",
    subtitle: "A linha de baixo com solo embutido",
    key: "Mi maior (E)",
    shape: "Pentatônica E maior + cordas graves",
    tempo: "92 BPM",
    timeSig: "4/4",
    tab: [
      "e|------------------------------------------------|",
      "B|--------------- 0--- 0------- 0--- 0------------|",
      "G|------- 1------ 1--- 1------- 1--- 1------------|",
      "D|--- 2--- 2-4-2--- 2--- 2-4-2---- 2--- 2-4-2-----|",
      "A|--- 0------------- 2------------- 0-------------|",
      "E|------------------------------------------------|",
    ],
    techniques: [
      "Walking bass na corda A/D",
      "Pedal nota nas cordas agudas",
      "Pegada Chicago blues",
    ],
    description:
      'Estilo "blues solo no violão" — UMA guitarra faz harmonia, baixo e melodia ao mesmo tempo. Big Bill Broonzy popularizou.',
    tip: "Use polegar da mão direita pra cordas graves (E, A, D) e dedos pras agudas (G, B, e). Sem essa coordenação, não rola.",
  },
  {
    id: "octave-punch",
    title: "Octave punch (Wes Montgomery)",
    subtitle: "Oitavas que cantam",
    key: "Sol maior (G)",
    shape: "Oitavas paralelas · cordas D+B ou E+G",
    tempo: "88 BPM",
    timeSig: "4/4",
    tab: [
      "e|------------------------------------------------|",
      "B|--- 8-------- 7-------- 5-------- 7-------------|",
      "G|------------------------------------------------|",
      "D|--- 5-------- 4-------- 2-------- 4-------------|",
      "A|------------------------------------------------|",
      "E|------------------------------------------------|",
    ],
    techniques: [
      "Oitavas (3 casas + 2 cordas)",
      "Mute na corda do meio (G)",
      "Pegada de polegar",
    ],
    description:
      "Wes Montgomery usou oitavas como assinatura — toca a MESMA nota em duas alturas, mute a corda do meio. Soa MASSIVO.",
    tip: "A corda G no meio tem que estar 100% mutada (dedo do indicador encosta levemente). Pratique mutar PRIMEIRO, depois tocar.",
  },
  {
    id: "i-iv-slide",
    title: 'O "I-IV" Slide',
    subtitle: "Double-stops nos acordes da progressão",
    key: "Lá maior (A)",
    shape: "Double-stops · cordas G+B · 2ª–5ª casa",
    tempo: "108 BPM",
    timeSig: "4/4",
    tab: [
      "e|------------------------------------------------|",
      "B|--- 5-5--- 2/3-3--- 5-5--- 2/3-3---- 5----------|",
      "G|--- 4-4--- 2/2-2--- 4-4--- 2/2-2---- 4----------|",
      "D|------------------------------------------------|",
      "A|------------------------------------------------|",
      "E|------------------------------------------------|",
    ],
    techniques: [
      "Double-stop em cordas G+B",
      "Slide ascendente 2→3",
      "Articulação country-blues",
    ],
    description:
      'Lick clássico de country blues — alterna entre acorde I (A: 5-4) e IV (D: 3-2). Slide entre eles cria movimento. Hendrix usava sobre "Hey Joe".',
    tip: "Esse lick é PERFEITO pra blues lento (slow shuffle). Não acelere — toque com swing pesado.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function ClichesBlues() {
  const [clicheId, setClicheId] = useState(BLUES_CLICHES[0].id);
  const { markLesson, isComplete } = useProgress();
  const cliche =
    BLUES_CLICHES.find((c) => c.id === clicheId) ?? BLUES_CLICHES[0];
  const color = "#a78bfa";

  return (
    <div>
      <PageHeader
        chip="Vocabulário"
        title="Clichês do Blues"
        description="10 frases atemporais que TODO blueseiro precisa saber de cor. Não são de um artista específico — são licks que aparecem em centenas de músicas, em todas as tonalidades, em todos os estilos."
      />

      <Section title="Por que decorar clichês?">
        <TheoryBlock>
          <Step>
            <p>
              Um <b>clichê do blues</b> é uma frase tão difundida que virou
              "domínio público" — todos os blueseiros tocam, ouvintes esperam, e
              fica perfeitamente em qualquer música do gênero. Decorar esses
              licks é como aprender o "abecedário" do blues.
            </p>
          </Step>
          <Step>
            <p>
              Pode parecer pejorativo dizer "clichê" — mas no blues, os clichês
              SÃO a linguagem. B.B. King usava licks-padrão. Eric Clapton
              também. SRV idem. A originalidade vem de COMO você combina, não de
              evitá-los.
            </p>
          </Step>
          <Step>
            <p>
              <b>Como praticar</b>: decore um clichê por semana. Toque-o em 5
              tonalidades diferentes, em 3 velocidades, e em diferentes momentos
              do compasso. Quando virar reflexo, passe pro próximo. Em 10
              semanas você fala "fluentemente" o vocabulário do blues.
            </p>
          </Step>
        </TheoryBlock>
      </Section>

      <Section title="Os 10 clichês essenciais">
        {/* Grid selector */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 8,
            marginBottom: 18,
          }}
        >
          {BLUES_CLICHES.map((c, i) => {
            const active = c.id === clicheId;
            return (
              <button
                key={c.id}
                onClick={() => setClicheId(c.id)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: active ? `${color}15` : "var(--ink-03)",
                  border: `1px solid ${
                    active ? color + "55" : "var(--ink-08)"
                  }`,
                  textAlign: "left",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: active ? color : `${color}25`,
                    color: active ? "#0b1220" : color,
                    fontSize: 11,
                    fontWeight: 800,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: active ? color : "var(--text-base)",
                      lineHeight: 1.2,
                    }}
                  >
                    {c.title}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text-ultra)",
                      marginTop: 2,
                    }}
                  >
                    {c.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail card */}
        <div
          className="card"
          style={{ padding: 20, borderTop: `3px solid ${color}` }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: 9,
              fontWeight: 700,
              color,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              padding: "3px 9px",
              borderRadius: 999,
              background: `${color}12`,
              border: `1px solid ${color}30`,
              marginBottom: 8,
            }}
          >
            Clichê do Blues
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--text-base)",
              lineHeight: 1.1,
            }}
          >
            {cliche.title}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-ultra)",
              marginTop: 4,
              marginBottom: 14,
            }}
          >
            {cliche.subtitle}
          </div>

          <div
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              marginBottom: 12,
              background: `${color}10`,
              border: `1px solid ${color}25`,
              display: "inline-block",
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              Tom
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-base)",
              }}
            >
              {cliche.key}
            </div>
          </div>

          {cliche.shape && (
            <div style={{ marginBottom: 16 }}>
              <ShapeDiagram shape={cliche.shape} color={color} />
            </div>
          )}

          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--text-ultra)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            Tablatura
          </div>
          <TabBlock
            tab={cliche.tab}
            color={color}
            timeSig={cliche.timeSig}
            tempo={cliche.tempo}
          />

          <div style={{ marginTop: 18 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--text-ultra)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
              }}
            >
              Técnicas
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {cliche.techniques.map((t, i) => (
                <span
                  key={i}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    background: `${color}10`,
                    color,
                    border: `1px solid ${color}28`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 18,
            }}
          >
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                background: "var(--ink-03)",
                border: `1px solid ${color}20`,
                borderLeft: `3px solid ${color}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                ♪ Por que soa lindo
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {cliche.description}
              </p>
            </div>
            <div
              style={{
                padding: 14,
                borderRadius: 12,
                background: "var(--ink-03)",
                border: `1px solid #f59e0b20`,
                borderLeft: `3px solid #f59e0b`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#f59e0b",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 8,
                }}
              >
                ⚡ Dica de treino
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {cliche.tip}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 18,
            }}
          >
            <CompleteToggle
              done={isComplete("licks", `cliche-${cliche.id}`)}
              onClick={() => markLesson("licks", `cliche-${cliche.id}`)}
            />
          </div>
        </div>
      </Section>
      <LessonFooter moduleId="licks" />
    </div>
  );
}
