import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext.jsx";

// ─── Áreas de estudo (todas as lições do site) ─────────────────────────────
// A ordem das áreas define a ordem do caminho. Dentro de cada área,
// as lições seguem a progressão pedagógica do módulo.

const AREAS = [
  {
    id: "fundamentos",
    label: "Fundamentos da Teoria",
    route: "/fundamentos",
    color: "#6366f1",
    moduleId: "fundamentals",
    lessons: [
      { id: "waves",                    title: "Som e Frequência" },
      { id: "scale",                    title: "Notas no Braço" },
      { id: "intervals",                title: "Intervalos" },
      { id: "intervalos_aprofundados",  title: "Mapeamento dos Intervalos" },
      { id: "formula",                  title: "Enarmonia e Acidentes" },
      { id: "major-scale",              title: "Escala Maior, Menor e Relativo" },
    ],
  },
  {
    id: "ritmo",
    label: "Figuras Rítmicas",
    route: "/figuras-ritmicas",
    color: "#f59e0b",
    moduleId: "figuras_ritmicas",
    lessons: [
      { id: "introducao",          title: "Introdução ao Ritmo" },
      { id: "figuras",             title: "Figuras Fundamentais" },
      { id: "pausas",              title: "Pausas Rítmicas" },
      { id: "pontua_ligaduras",    title: "Pontuação e Ligaduras" },
      { id: "subdivisao",          title: "Fórmulas de Compasso" },
      { id: "tercinas",            title: "Tercinas & Sextinas" },
      { id: "metronomo_integrado", title: "Metrônomo Integrado" },
    ],
  },
  {
    id: "ciclos",
    label: "Ciclos · Quintas & Quartas",
    route: "/ciclo-das-quintas",
    color: "#06b6d4",
    moduleId: "ciclo_quintas",
    lessons: [
      { id: "quintas", title: "Ciclo das Quintas" },
      { id: "quartas", title: "Ciclo das Quartas" },
    ],
  },
  {
    id: "caged",
    label: "Sistema CAGED",
    route: "/caged",
    color: "#8b5cf6",
    moduleId: "caged",
    lessons: [
      { id: "concept", title: "O Sistema CAGED" },
      { id: "c_shape", title: "Forma C" },
      { id: "a_shape", title: "Forma A" },
      { id: "g_shape", title: "Forma G" },
      { id: "e_shape", title: "Forma E" },
      { id: "d_shape", title: "Forma D" },
    ],
  },
  {
    id: "harmonia",
    label: "Harmonia",
    route: "/harmonia",
    color: "#10b981",
    moduleId: "harmony",
    lessons: [
      { id: "chord_qualities", title: "Formação de Acordes" },
      { id: "triads",          title: "Tríades & Tétrades" },
      { id: "string_shapes",   title: "Shapes por Corda" },
      { id: "inversions",      title: "Inversão de Acordes" },
    ],
  },
  {
    id: "harmonia_funcional",
    label: "Harmonia Funcional",
    route: "/harmonia-funcional",
    color: "#14b8a6",
    moduleId: "harmonia_funcional",
    lessons: [
      { id: "tsdf",         title: "T · S · D — Funções Harmônicas" },
      { id: "progressions", title: "Progressões Clichê" },
      { id: "ii_v_i",       title: "ii–V–I e Jazz" },
    ],
  },
  {
    id: "escalas-solos",
    label: "Escalas & Solos",
    route: "/escalas-solos",
    color: "#f43f5e",
    moduleId: "scales",
    lessons: [
      { id: "pentatonicMinor", title: "Pentatônica Menor" },
      { id: "pentatonicMajor", title: "Pentatônica Maior" },
      { id: "blues",           title: "Blues Hexatônica" },
      { id: "bluesMajor",      title: "Blues Maior" },
      { id: "shapes_5",        title: "Os 5 Shapes da Pentatônica" },
      { id: "horizontalidade", title: "Visão Horizontal do Braço" },
    ],
  },
  {
    id: "penta_patterns",
    label: "Padrões Pentatônicos",
    route: "/padroes-pentatonica",
    color: "#ec4899",
    moduleId: "penta_patterns",
    lessons: [
      { id: "col_4",       title: "Coluna de 4" },
      { id: "col_3",       title: "Coluna de 3" },
      { id: "tercina_3",   title: "Tercinas de 3" },
      { id: "tercina_4",   title: "Tercinas de 4" },
    ],
  },
  {
    id: "arpejos",
    label: "Arpejos",
    route: "/arpejos",
    color: "#f97316",
    moduleId: "arpejos",
    lessons: [
      { id: "maj",  title: "Arpejo de Tríade Maior" },
      { id: "min",  title: "Arpejo de Tríade Menor" },
      { id: "dim",  title: "Arpejo Diminuto" },
      { id: "aug",  title: "Arpejo Aumentado" },
      { id: "7",    title: "Arpejo Dominante (X7)" },
      { id: "maj7", title: "Arpejo Maior com 7ª" },
      { id: "min7", title: "Arpejo Menor com 7ª" },
    ],
  },
  {
    id: "modos",
    label: "Modos Gregos",
    route: "/avancado",
    color: "#a855f7",
    moduleId: "advanced",
    lessons: [
      { id: "ionian",     title: "Modo Jônico" },
      { id: "dorian",     title: "Modo Dórico" },
      { id: "phrygian",   title: "Modo Frígio" },
      { id: "lydian",     title: "Modo Lídio" },
      { id: "mixolydian", title: "Modo Mixolídio" },
      { id: "aeolian",    title: "Modo Eólio" },
      { id: "locrian",    title: "Modo Lócrio" },
    ],
  },
  {
    id: "escalas-avancadas",
    label: "Escalas Avançadas",
    route: "/escalas-avancadas",
    color: "#d946ef",
    moduleId: "escalas_avancadas",
    lessons: [
      { id: "harmonic_minor", title: "Menor Harmônica" },
      { id: "harmonic_modes", title: "Modos da Menor Harmônica" },
      { id: "melodic_minor",  title: "Menor Melódica" },
    ],
  },
  {
    id: "tecnicas",
    label: "Técnicas Melódicas",
    route: "/tecnicas",
    color: "#0ea5e9",
    moduleId: "tecnicas",
    lessons: [
      { id: "chord_tones",    title: "Chord Tones" },
      { id: "avoid_notes",    title: "Avoid Notes" },
      { id: "approach",       title: "Approach Notes" },
      { id: "relative_minor", title: "Tônica Relativa" },
    ],
  },
  {
    id: "jazz-blues",
    label: "Jazz & Blues",
    route: "/jazz-blues",
    color: "#84cc16",
    moduleId: "jazz-blues",
    lessons: [
      { id: "blues_12",   title: "Blues de 12 Compassos" },
      { id: "jazz_blues", title: "Jazz Blues" },
    ],
  },
  {
    id: "maquina_acordes",
    label: "Máquina de Acordes",
    route: "/maquina-acordes",
    color: "#0d9488",
    moduleId: "maquina_acordes",
    lessons: [
      { id: "teoria",  title: "Formas Musicais · Teoria" },
      { id: "maquina", title: "Máquina de Acordes" },
    ],
  },
  {
    id: "groove",
    label: "Laboratório de Groove",
    route: "/laboratorio-groove",
    color: "#7c3aed",
    moduleId: "groove",
    lessons: [
      { id: "mpq", title: "Sistema MPQ (Groove)" },
    ],
  },
  {
    id: "licks",
    label: "Vocabulário · Licks",
    route: "/lendas/licks",
    color: "#eab308",
    moduleId: "licks",
    lessons: [
      { id: "module_done", title: "Vocabulário de Licks" },
    ],
  },
  {
    id: "cliches-blues",
    label: "Clichês do Blues",
    route: "/lendas/cliches-blues",
    color: "#ca8a04",
    moduleId: "licks",
    lessons: [
      { id: "module_done", title: "Clichês do Blues" },
    ],
  },
  {
    id: "improviso",
    label: "Improviso Aplicado",
    route: "/improviso",
    color: "#ef4444",
    moduleId: "improviso",
    lessons: [
      { id: "blues_g",     title: "Análise · Blues em G" },
      { id: "neo_soul_am", title: "Análise · Neo-Soul Am" },
    ],
  },
  {
    id: "quiz",
    label: "Quiz Final",
    route: "/quiz",
    color: "#6366f1",
    moduleId: "quiz",
    lessons: [
      { id: "completed", title: "Quiz Final" },
    ],
  },
];

// Achata em um único array linear com referência da área de origem.
const LESSONS = AREAS.flatMap((area) =>
  area.lessons.map((l) => ({
    ...l,
    areaId: area.id,
    areaLabel: area.label,
    areaColor: area.color,
    route: area.route,
    moduleId: area.moduleId,
    lessonId: l.id,
  }))
);

const STATUS = { COMPLETED: "completed", CURRENT: "current", FUTURE: "future" };

// Curva senoidal com amplitude horizontal, período de 6 nós.
const AMPLITUDE_PX = 130;
function offsetForIndex(i) {
  return Math.round(Math.sin((i + 0.5) * (Math.PI / 3)) * AMPLITUDE_PX);
}

export default function Roadmap() {
  const { progress } = useProgress();
  const [paceLessonsPerWeek, setPaceLessonsPerWeek] = useState(8);

  const classified = useMemo(() => {
    let foundCurrent = false;
    return LESSONS.map((l) => {
      const key = `${l.moduleId}:${l.lessonId}`;
      const isDone = !!progress.completedLessons[key];
      let status;
      if (isDone) status = STATUS.COMPLETED;
      else if (!foundCurrent) {
        status = STATUS.CURRENT;
        foundCurrent = true;
      } else status = STATUS.FUTURE;
      return { ...l, status };
    });
  }, [progress.completedLessons]);

  const total = LESSONS.length;
  const totalDone = classified.filter((l) => l.status === STATUS.COMPLETED).length;
  const remaining = total - totalDone;
  const weeksLeft = Math.max(1, Math.ceil(remaining / paceLessonsPerWeek));
  const finishDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weeksLeft * 7);
    return d.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [weeksLeft]);

  return (
    <>
      <style>{`
        @keyframes float-bounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes pulse-ring-current {
          0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.55); }
          70%  { box-shadow: 0 0 0 18px rgba(99,102,241,0); }
          100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
        }
        .roadmap-current-glow { animation: pulse-ring-current 2.2s ease-out infinite; }
        .roadmap-start-tooltip { animation: float-bounce 2.4s ease-in-out infinite; }
      `}</style>

      <div
        className="max-w-[1200px] mx-auto px-5 md:px-8 pt-8 pb-24"
        style={{ color: "var(--text-base)" }}
      >
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* ── Coluna central ────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 w-full max-w-[720px] mx-auto">
            <Hero total={total} done={totalDone} />
            <Legend />
            <SectionBanner total={total} completed={totalDone} />
            <ZigzagPath lessons={classified} />
            <AreasSection areas={AREAS} classified={classified} />
          </div>

          {/* ── Pace planner ──────────────────────────────────────────── */}
          <aside
            className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-20 rounded-3xl p-6"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <h3 className="text-[18px] font-extrabold mb-2 tracking-tight">
              Planeje seu ritmo
            </h3>
            <p
              className="text-[13px] leading-relaxed mb-5"
              style={{ color: "var(--text-muted)" }}
            >
              Escolha quantas lições por semana parece confortável.
            </p>

            <div
              className="text-[12px] mb-1 uppercase tracking-wider font-semibold"
              style={{ color: "var(--text-ultra)" }}
            >
              Restam
            </div>
            <div className="text-[15px] font-bold mb-4">
              <b style={{ color: "var(--text-base)" }}>{remaining}</b>
              <span style={{ color: "var(--text-muted)" }}>
                {" "}de {total} lições
              </span>
            </div>

            <div
              className="text-[12px] mb-1 uppercase tracking-wider font-semibold"
              style={{ color: "var(--text-ultra)" }}
            >
              Lições por semana
            </div>
            <div
              className="text-[28px] font-extrabold leading-none mb-2"
              style={{ color: "#6366f1" }}
            >
              {paceLessonsPerWeek}
            </div>

            <input
              type="range"
              min="1"
              max="20"
              value={paceLessonsPerWeek}
              onChange={(e) =>
                setPaceLessonsPerWeek(parseInt(e.target.value, 10))
              }
              className="w-full mb-4"
              style={{ accentColor: "#6366f1" }}
            />

            <div
              className="rounded-2xl px-4 py-3 mt-2"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.10), rgba(168,85,247,0.06))",
                border: "1px solid rgba(99,102,241,0.20)",
              }}
            >
              <div
                className="text-[11px] uppercase tracking-wider font-semibold mb-1"
                style={{ color: "#6366f1" }}
              >
                Você termina por volta de
              </div>
              <div
                className="text-[15px] font-extrabold leading-tight"
                style={{ color: "var(--text-base)" }}
              >
                {finishDate}
              </div>
              <div
                className="text-[12px] mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                ({weeksLeft} {weeksLeft === 1 ? "semana" : "semanas"})
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function Hero({ total }) {
  return (
    <div className="mb-6">
      <h1 className="text-[30px] md:text-[36px] font-extrabold tracking-tight leading-tight">
        Sua trilha de estudos
      </h1>
      <p
        className="text-[14px] md:text-[15px] mt-2"
        style={{ color: "var(--text-muted)" }}
      >
        {total} lições em sequência, cobrindo todas as áreas do MusicMonster —
        dos fundamentos ao improviso.
      </p>
    </div>
  );
}

// ─── Legenda ───────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div
      className="inline-flex flex-wrap items-center gap-x-5 gap-y-2 rounded-full px-5 py-2.5 mb-8"
      style={{
        background: "var(--ink-05)",
        border: "1px solid var(--border-card)",
      }}
    >
      <LegendDot color="#10b981" icon={<CheckIcon size={10} />} label="Concluído" />
      <LegendDot color="#6366f1" icon={<PlayIcon size={10} />} label="Próximo" />
      <LegendDot
        color="transparent"
        icon={
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "var(--text-muted)",
            }}
          >
            #
          </span>
        }
        label="Futuro"
        ring
      />
    </div>
  );
}

function LegendDot({ color, icon, label, ring }) {
  return (
    <div
      className="inline-flex items-center gap-2 text-[12.5px] font-semibold"
      style={{ color: "var(--text-base)" }}
    >
      <span
        className="grid place-items-center rounded-full"
        style={{
          background: ring ? "transparent" : color,
          border: ring ? "1.5px solid var(--ink-25)" : "none",
          width: 20,
          height: 20,
          color: "#fff",
        }}
      >
        {icon}
      </span>
      {label}
    </div>
  );
}

// ─── Banner roxo de seção ──────────────────────────────────────────────────

function SectionBanner({ total, completed }) {
  return (
    <div
      className="w-full flex items-center justify-between px-6 py-4 rounded-2xl mb-12"
      style={{
        background:
          "linear-gradient(135deg, #6366f1 0%, #7c3aed 60%, #8b5cf6 100%)",
        boxShadow:
          "0 12px 32px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
        color: "#fff",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="grid place-items-center rounded-full text-[13px] font-extrabold"
          style={{
            width: 30,
            height: 30,
            background: "rgba(255,255,255,0.20)",
            border: "1px solid rgba(255,255,255,0.35)",
          }}
        >
          1
        </span>
        <div>
          <div className="uppercase tracking-[0.16em] text-[13px] md:text-[14px] font-extrabold">
            Trilha Completa
          </div>
          <div className="text-[11.5px] opacity-90 mt-0.5">
            Do braço do instrumento até o improviso aplicado
          </div>
        </div>
      </div>
      <div className="text-[13px] font-extrabold opacity-95 tabular-nums">
        {completed} / {total} lições
      </div>
    </div>
  );
}

// ─── Caminho em zigzag ─────────────────────────────────────────────────────

function ZigzagPath({ lessons }) {
  return (
    <div className="relative py-4">
      <ol className="relative flex flex-col items-center">
        {lessons.map((lesson, i) => (
          <PathNode
            key={`${lesson.areaId}-${lesson.id}`}
            lesson={lesson}
            index={i}
            isFirst={i === 0}
          />
        ))}
      </ol>
    </div>
  );
}

function PathNode({ lesson, index, isFirst }) {
  const isCurrent = lesson.status === STATUS.CURRENT;
  const isCompleted = lesson.status === STATUS.COMPLETED;
  const offsetX = offsetForIndex(index);
  const size = isCurrent ? 84 : 64;

  const bg = isCurrent
    ? "#6366f1"
    : isCompleted
    ? "#10b981"
    : "var(--bg-card)";
  const border = isCurrent
    ? "3px solid #6366f1"
    : isCompleted
    ? "3px solid #10b981"
    : "2px solid var(--ink-15)";
  const shadow = isCurrent
    ? "0 12px 28px rgba(99,102,241,0.45)"
    : isCompleted
    ? "0 8px 20px rgba(16,185,129,0.30)"
    : "0 4px 12px rgba(0,0,0,0.06)";

  return (
    <li
      className="relative flex flex-col items-center"
      style={{
        transform: `translateX(${offsetX}px)`,
        marginTop: isFirst ? 0 : 22,
      }}
    >
      {/* Tooltip "Começar" flutuante */}
      {isCurrent && (
        <div
          className="roadmap-start-tooltip absolute -top-[46px] left-1/2 -translate-x-1/2 z-20"
          style={{ pointerEvents: "none" }}
        >
          <div
            className="px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold uppercase tracking-[0.18em] whitespace-nowrap"
            style={{
              background: "#ffffff",
              color: "#6366f1",
              border: "1.5px solid #6366f1",
              boxShadow: "0 6px 14px rgba(99,102,241,0.25)",
            }}
          >
            Começar
          </div>
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-[6px]"
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "7px solid #6366f1",
            }}
          />
        </div>
      )}

      {/* Círculo */}
      <Link
        to={lesson.route}
        aria-label={lesson.title}
        className={`relative z-10 grid place-items-center rounded-full transition-transform hover:scale-110 active:scale-95 ${
          isCurrent ? "roadmap-current-glow" : ""
        }`}
        style={{
          width: size,
          height: size,
          background: bg,
          border,
          boxShadow: shadow,
          color: isCurrent || isCompleted ? "#fff" : "var(--text-subtle)",
        }}
      >
        {isCurrent ? (
          <PlayIcon size={26} />
        ) : isCompleted ? (
          <CheckIcon size={22} />
        ) : (
          <span
            className="text-[18px] font-extrabold"
            style={{ color: "var(--text-subtle)" }}
          >
            {index + 1}
          </span>
        )}
      </Link>

      {/* Título + área */}
      <Link
        to={lesson.route}
        className="mt-3 text-center max-w-[200px] hover:underline"
        style={{
          color: isCurrent ? "#6366f1" : "var(--text-base)",
          fontWeight: isCurrent ? 800 : 700,
          fontSize: isCurrent ? "15px" : "13.5px",
          lineHeight: 1.25,
        }}
      >
        {lesson.title}
      </Link>
      <span
        className="mt-1 text-[10.5px] font-bold uppercase tracking-wider"
        style={{ color: lesson.areaColor, opacity: 0.85 }}
      >
        {lesson.areaLabel}
      </span>
    </li>
  );
}

// ─── Cards das áreas de estudo ─────────────────────────────────────────────

function AreasSection({ areas, classified }) {
  // Conta progresso por área
  const progressByArea = useMemo(() => {
    const map = {};
    areas.forEach((a) => (map[a.id] = { done: 0, total: a.lessons.length }));
    classified.forEach((l) => {
      if (l.status === STATUS.COMPLETED && map[l.areaId]) {
        map[l.areaId].done += 1;
      }
    });
    return map;
  }, [areas, classified]);

  return (
    <section className="mt-24">
      <div className="mb-6">
        <div
          className="text-[11px] font-extrabold uppercase tracking-[0.18em] mb-2"
          style={{ color: "#6366f1" }}
        >
          As {areas.length} áreas da trilha
        </div>
        <h2
          className="text-[22px] md:text-[26px] font-extrabold leading-tight tracking-tight"
          style={{ color: "var(--text-base)" }}
        >
          De onde vem cada tópico
        </h2>
        <p
          className="text-[13.5px] mt-1"
          style={{ color: "var(--text-muted)" }}
        >
          Cada assunto do caminho pertence a uma destas áreas — clique para
          abrir o módulo completo.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {areas.map((area) => {
          const p = progressByArea[area.id];
          const pct = p.total === 0 ? 0 : Math.round((p.done / p.total) * 100);
          return (
            <Link
              key={area.id}
              to={area.route}
              className="group rounded-2xl p-4 transition-transform hover:scale-[1.015] hover:-translate-y-0.5"
              style={{
                background: "var(--bg-card)",
                border: `1px solid ${hexToRgba(area.color, 0.32)}`,
                boxShadow: `0 4px 16px ${hexToRgba(area.color, 0.10)}`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="shrink-0 grid place-items-center rounded-xl"
                  style={{
                    width: 38,
                    height: 38,
                    background: `linear-gradient(135deg, ${area.color}, ${hexToRgba(
                      area.color,
                      0.75
                    )})`,
                    color: "#fff",
                    boxShadow: `0 4px 12px ${hexToRgba(area.color, 0.35)}`,
                  }}
                >
                  <AreaGlyph />
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className="text-[14px] font-extrabold leading-tight"
                    style={{ color: "var(--text-base)" }}
                  >
                    {area.label}
                  </div>
                  <div
                    className="text-[12px] mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {area.lessons.length}{" "}
                    {area.lessons.length === 1 ? "tópico" : "tópicos"}
                    {p.done > 0 && (
                      <>
                        {" · "}
                        <span style={{ color: area.color, fontWeight: 700 }}>
                          {p.done} concluído{p.done === 1 ? "" : "s"}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Mini barra de progresso */}
                  <div
                    className="mt-2.5 h-[5px] w-full rounded-full overflow-hidden"
                    style={{ background: "var(--ink-08)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: area.color,
                      }}
                    />
                  </div>
                </div>

                <span
                  className="text-[16px] font-bold opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                  style={{ color: area.color }}
                >
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function AreaGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M5 13V5l8 4-8 4Z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────

function CheckIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 8.5L6.5 11L12.5 5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M5.5 4L12 8L5.5 12V4Z" fill="currentColor" />
    </svg>
  );
}

// ─── Utils ─────────────────────────────────────────────────────────────────

function hexToRgba(hex, a = 1) {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
