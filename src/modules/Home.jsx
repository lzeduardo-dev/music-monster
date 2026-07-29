import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const MODULES = [
  {
    to: "/fundamentos",
    chip: "Módulo 1",
    title: "Fundamentos",
    desc: "Som, escala maior, intervalos e a fórmula T-T-st.",
    accent: "from-blue-500/20 to-blue-500/0",
    color: "#3b82f6",
  },
  {
    to: "/ciclo-das-quintas",
    chip: "Teoria",
    title: "Ciclo das Quintas",
    desc: "O mapa da harmonia — 12 tonalidades, acidentes e relações de quinta e quarta.",
    accent: "from-blue-400/20 to-blue-400/0",
    color: "#38bdf8",
  },
  {
    to: "/harmonia",
    chip: "Módulo 2",
    title: "Harmonia",
    desc: "Tríades, tétrades, qualidades, shapes D/A/E e inversões.",
    accent: "from-accent-amber/20 to-accent-amber/0",
    color: "#c084fc",
  },
  {
    to: "/harmonia-funcional",
    chip: "Módulo 3",
    title: "Harmonia Funcional",
    desc: "Campo harmônico, T/S/D e progressões no pop e rock.",
    accent: "from-blue-400/20 to-blue-400/0",
    color: "#60a5fa",
  },
  {
    to: "/escalas-solos",
    chip: "Módulo 4",
    title: "Escalas",
    desc: "Pentatônica maior/menor, blues e blues maior.",
    accent: "from-accent-coral/20 to-accent-coral/0",
    color: "#f472b6",
  },
  {
    to: "/arpejos",
    chip: "Módulo 5",
    title: "Arpejos",
    desc: "X7, XM7, Xm7 e além — a espinha dorsal do solo.",
    accent: "from-accent-amber/20 to-accent-amber/0",
    color: "#c084fc",
  },
  {
    to: "/caged",
    chip: "Sistema",
    title: "Sistema CAGED",
    desc: "As 5 formas de acorde que mapeiam todo o braço.",
    accent: "from-sky-400/20 to-sky-400/0",
    color: "#38bdf8",
  },
  {
    to: "/tecnicas",
    chip: "Técnicas",
    title: "Técnicas de Guitarra",
    desc: "Improvisação, notas de repouso, notas a evitar e escalas relativas.",
    accent: "from-indigo-400/20 to-indigo-400/0",
    color: "#818cf8",
  },
  {
    to: "/escalas-avancadas",
    chip: "Avançado",
    title: "Escalas Avançadas",
    desc: "Menor Harmônica (7 modos) e Menor Melódica — do flamenco ao jazz.",
    accent: "from-violet-400/20 to-violet-400/0",
    color: "#a78bfa",
  },
  {
    to: "/avancado",
    chip: "Módulo 7",
    title: "Modos Gregos",
    desc: "Jônico ao Lócrio — fórmulas, sonoridade e aplicação.",
    accent: "from-violet-400/20 to-violet-400/0",
    color: "#a78bfa",
  },
  {
    to: "/ear-lab",
    chip: "Prática",
    title: "Lab Auditivo",
    desc: "Treine intervalos e notas isoladas com feedback imediato.",
    accent: "from-fuchsia-400/20 to-fuchsia-400/0",
    color: "#e879f9",
  },
  {
    to: "/braco-violao",
    chip: "Ferramenta",
    title: "Braço do Violão",
    desc: "Marcação livre de casas com cores, sobreposição de escalas e acordes.",
    accent: "from-sky-400/20 to-sky-400/0",
    color: "#38bdf8",
  },
  {
    to: "/jazz-blues",
    chip: "Estilos",
    title: "Jazz & Blues",
    desc: "Texas, Chicago, blues maior/menor, jazz blues — teoria e progressões.",
    accent: "from-accent-amber/20 to-accent-amber/0",
    color: "#c084fc",
  },
  {
    to: "/historia",
    chip: "História",
    title: "História do Blues & Jazz",
    desc: "De Robert Johnson a Joe Bonamassa — artistas, álbuns e legado.",
    accent: "from-rose-400/20 to-rose-400/0",
    color: "#fb7185",
  },
  {
    to: "/quiz",
    chip: "Quiz",
    title: "Quiz Musical",
    desc: "Teste seus conhecimentos em todos os módulos com questões de múltipla escolha.",
    accent: "from-indigo-400/20 to-indigo-400/0",
    color: "#818cf8",
  },
  {
    to: "/maquina-acordes",
    chip: "Voicings",
    title: "Máquina de Acordes",
    desc: "Tétrades, Drop 2 e Drop 3 — todas as inversões com diagramas e áudio.",
    accent: "from-blue-500/20 to-indigo-500/0",
    color: "#6366f1",
  },
  {
    to: "/progresso",
    chip: "Progresso",
    title: "Meu Progresso",
    desc: "Acompanhe seu avanço por módulo e veja o histórico de lições concluídas.",
    accent: "from-blue-400/20 to-blue-400/0",
    color: "#60a5fa",
  },
];

export default function Home() {
  const { progress } = useProgress();
  const { user } = useAuth();
  const total = Object.keys(progress.completedLessons).length;

  return (
    <div>
      {/* Hero */}
      <div className="card p-7 md:p-10 mb-10 relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-accent-blue/8 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-20 w-72 h-72 rounded-full bg-indigo-500/6 blur-3xl pointer-events-none" />
        <div className="relative">
          <h1
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
            style={{ color: "var(--text-base)" }}
          >
            {user?.name ? (
              <>
                Olá, {user.name.split(" ")[0]}! Vamos aprender musica de verdade
              </>
            ) : (
              <>Olá! Vamos aprender musica de verdade.</>
            )}
          </h1>
          <p
            className="mt-3 max-w-2xl text-base md:text-lg leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Do iniciante ao avançado — Fundamentos, CAGED, Escalas (maior,
            menor, blues, menor harmônica, menor melódica) harmonia , harmonia
            funcional ,blues, visualização das notas no braço da guitarra
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/fundamentos" className="btn btn-ghost">
              Começar pelos Fundamentos →
            </Link>
            <Link
              to="/caged"
              className="btn btn-ghost"
              style={{ color: "var(--text-base)" }}
            >
              Sistema CAGED
            </Link>
            <Link
              to="/tecnicas"
              className="btn btn-ghost"
              style={{ color: "var(--text-base)" }}
            >
              Técnicas
            </Link>
          </div>
          {total > 0 && (
            <div className="mt-5 flex items-center gap-3">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Você já concluiu <b style={{ color: "#3b82f6" }}>{total}</b> liç
                {total !== 1 ? "ões" : "ão"}.{" "}
                <Link to="/progresso" style={{ color: "#60a5fa" }}>
                  Ver progresso →
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Module grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className="card p-5 hover:-translate-y-0.5 transition-transform group relative overflow-hidden"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${m.accent} opacity-0 group-hover:opacity-100 transition`}
            />
            <div className="relative">
              <span
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ background: `${m.color}1a`, color: m.color }}
              >
                {m.chip}
              </span>
              <h3
                className="text-lg font-bold mt-3"
                style={{ color: "var(--text-base)" }}
              >
                {m.title}
              </h3>
              <p
                className="text-sm mt-1 leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {m.desc}
              </p>
              <div
                className="mt-4 text-sm font-semibold"
                style={{ color: m.color }}
              >
                Acessar →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
