import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// ─── Trilhas ───────────────────────────────────────────────────────────────
// Cada trilha é um agrupamento pedagógico: título de seção + lista de
// lições. O `moduleId` alimenta o contador "X de Y concluídos".

const TRILHAS = [
  {
    id: "teoria",
    label: "Teoria Musical",
    items: [
      {
        to: "/fundamentos",
        moduleId: "fundamentals",
        title: "Fundamentos",
        desc: "Som, escala maior, intervalos e a fórmula T-T-st.",
      },
      {
        to: "/ciclo-das-quintas",
        moduleId: "ciclo_quintas",
        title: "Ciclo das Quintas",
        desc: "O mapa da harmonia: 12 tonalidades e relações de quinta.",
      },
      {
        to: "/harmonia",
        moduleId: "harmony",
        title: "Harmonia",
        desc: "Tríades, tétrades, qualidades, shapes D/A/E e inversões.",
      },
      {
        to: "/harmonia-funcional",
        moduleId: "harmonia_funcional",
        title: "Harmonia Funcional",
        desc: "Campo harmônico, T/S/D e progressões no pop e rock.",
      },
      {
        to: "/figuras-ritmicas",
        moduleId: "figuras_ritmicas",
        title: "Figuras Rítmicas",
        desc: "Semibreve à semicolcheia, pausas, ligaduras e subdivisão.",
      },
    ],
  },
  {
    id: "dominio",
    label: "Domínio",
    items: [
      {
        to: "/escalas-solos",
        moduleId: "scales",
        title: "Escalas & Solos",
        desc: "Pentatônica maior/menor, blues e visão horizontal do braço.",
      },
      {
        to: "/caged",
        moduleId: "caged",
        title: "Sistema CAGED",
        desc: "As 5 formas de acorde que mapeiam todo o braço.",
      },
      {
        to: "/padroes-pentatonica",
        moduleId: "penta_patterns",
        title: "Padrões na Pentatônica",
        desc: "Colunas, tercinas e saltos: vocabulário de solo.",
      },
      {
        to: "/arpejos",
        moduleId: "arpejos",
        title: "Arpejos",
        desc: "X7, XM7, Xm7 e além: a espinha dorsal do solo.",
      },
      {
        to: "/escalas-avancadas",
        moduleId: "escalas_avancadas",
        title: "Escalas Avançadas",
        desc: "Menor Harmônica e Menor Melódica: do flamenco ao jazz.",
      },
      {
        to: "/avancado",
        moduleId: "advanced",
        title: "Modos Gregos",
        desc: "Jônico ao Lócrio: fórmulas, sonoridade e aplicação.",
      },
    ],
  },
  {
    id: "vocabulario",
    label: "Vocabulário",
    items: [
      {
        to: "/lendas/licks",
        moduleId: "licks",
        title: "Vocabulário de Licks",
        desc: "Frases de estúdio dos grandes guitarristas, transcritas.",
      },
      {
        to: "/lendas/cliches-blues",
        moduleId: "licks",
        title: "Clichês do Blues",
        desc: "Passagens que aparecem em todo solo de blues.",
      },
    ],
  },
  {
    id: "treino",
    label: "Treino",
    items: [
      {
        to: "/improviso",
        moduleId: "improviso",
        title: "Laboratório de Improviso",
        desc: "Playback de blues em G e neo-soul em Am para tocar em cima.",
      },
      {
        to: "/quiz",
        moduleId: "quiz",
        title: "Quiz Musical",
        desc: "Teste seus conhecimentos em todos os módulos.",
      },
    ],
  },
];

const FERRAMENTAS = [
  {
    to: "/braco-violao",
    title: "Braço do Violão / Guitarra",
    desc: "Marcação livre de casas e sobreposição de escalas.",
  },
  {
    to: "/maquina-acordes",
    title: "Máquina de Acordes",
    desc: "Tétrades, Drop 2 e Drop 3 com diagramas e áudio.",
  },
  {
    to: "/ear-lab",
    title: "Lab Auditivo",
    desc: "Treine intervalos com feedback imediato.",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

function isModuleComplete(completedLessons, moduleId) {
  return Object.keys(completedLessons).some((k) =>
    k.startsWith(`${moduleId}:`)
  );
}

// Conta itens da trilha marcados como concluídos.
function trilhaProgress(trilha, completedLessons) {
  const done = trilha.items.filter((it) =>
    isModuleComplete(completedLessons, it.moduleId)
  ).length;
  return { done, total: trilha.items.length };
}

// Primeira lição ainda não concluída, na ordem das trilhas — usada no CTA.
function findNextLesson(completedLessons) {
  for (const t of TRILHAS) {
    for (const it of t.items) {
      if (!isModuleComplete(completedLessons, it.moduleId)) return it;
    }
  }
  return null;
}

// ─── Página ────────────────────────────────────────────────────────────────

export default function Home() {
  const { progress } = useProgress();
  const { user } = useAuth();
  const completedLessons = progress.completedLessons ?? {};
  const next = findNextLesson(completedLessons);

  const firstName = user?.name?.split(" ")[0] ?? null;

  return (
    <div
      style={{
        padding: "10px clamp(10px,2vw, 72px)",
        maxWidth: 1080,
      }}
    >
      {/* ── Hero (texto puro, sem card) ─────────────────────────────── */}
      <header style={{ marginBottom: 44, maxWidth: 720 }}>
        <h1
          className="font-display"
          style={{
            fontSize: 40,
            lineHeight: 1.12,
            letterSpacing: "-0.025em",
            fontWeight: 700,
            color: "var(--text-base)",
            margin: 0,
          }}
        >
          {firstName ? <>Olá, {firstName}.</> : <>Olá!</>}
          <br />
          Bem vindo ao MusicMonster.
        </h1>
        <p
          style={{
            fontSize: 16.5,
            lineHeight: 1.65,
            color: "var(--text-subtle)",
            maxWidth: 600,
            marginTop: 16,
          }}
        >
          Do iniciante ao avançado: fundamentos, CAGED, escalas, harmonia
          funcional, blues e visualização das notas no braço da guitarra.
        </p>

        <div
          style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}
        >
          {next ? (
            <Link
              to={next.to}
              className="btn-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 46,
                padding: "0 20px",
                fontSize: 14.5,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Continuar: {next.title} →
            </Link>
          ) : (
            <Link
              to="/fundamentos"
              className="btn-cta"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 46,
                padding: "0 20px",
                fontSize: 14.5,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Começar pelos Fundamentos →
            </Link>
          )}
          <Link
            to="/roadmap"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 46,
              padding: "0 20px",
              borderRadius: 11,
              fontSize: 14.5,
              fontWeight: 700,
              border: "1px solid var(--border-card)",
              color: "var(--text-base)",
              background: "transparent",
              textDecoration: "none",
            }}
          >
            Ver a trilha
          </Link>
        </div>
      </header>

      {/* ── Listas por trilha ───────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
        {TRILHAS.map((t) => {
          const { done, total } = trilhaProgress(t, completedLessons);
          return (
            <section key={t.id} style={{ maxWidth: 820 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <h2
                  className="uppercase"
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: "var(--text-subtle)",
                    margin: 0,
                  }}
                >
                  {t.label}
                </h2>
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "var(--brand-progress)",
                  }}
                >
                  {done} de {total} concluídos
                </span>
              </div>

              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {t.items.map((it) => (
                  <TrilhaItem
                    key={it.to}
                    item={it}
                    done={isModuleComplete(completedLessons, it.moduleId)}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      {/* ── Ferramentas ─────────────────────────────────────────────── */}
      <section style={{ marginTop: 58 }}>
        <h2
          className="uppercase"
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "var(--text-subtle)",
            margin: "0 0 16px",
          }}
        >
          Ferramentas
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
          style={{ maxWidth: 820 }}
        >
          {FERRAMENTAS.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              style={{
                display: "block",
                padding: 18,
                borderRadius: 12,
                border: "1px solid var(--border-card)",
                background: "var(--bg-card)",
                textDecoration: "none",
                transition: "transform 0.12s ease, background 0.15s ease",
              }}
              className="hover:-translate-y-0.5"
            >
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: "var(--text-base)",
                  marginBottom: 4,
                }}
              >
                {f.title}
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  lineHeight: 1.55,
                  color: "var(--text-subtle)",
                }}
              >
                {f.desc}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Linha da trilha ───────────────────────────────────────────────────────

function TrilhaItem({ item, done }) {
  return (
    <li>
      <Link
        to={item.to}
        className="sidebar-item"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px 4px",
          borderBottom: "1px solid var(--border-card)",
          textDecoration: "none",
        }}
      >
        {/* Bolinha de status */}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            flexShrink: 0,
            background: done ? "var(--brand-progress)" : "transparent",
            border: done ? "none" : "1.5px solid var(--bullet-border)",
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15.5,
              fontWeight: 700,
              color: "var(--text-base)",
              lineHeight: 1.3,
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              marginTop: 2,
              lineHeight: 1.5,
            }}
          >
            {item.desc}
          </div>
        </div>
        <span
          style={{
            color: "var(--text-ultra)",
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          →
        </span>
      </Link>
    </li>
  );
}
