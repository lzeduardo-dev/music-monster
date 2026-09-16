import { NavLink, Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useProgress } from "../context/ProgressContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

const TOTAL_LESSONS = 131;

// ─── Navigation structure ────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    id: "aprender",
    label: "Teoria Musical",
    icon: "book",
    items: [
      { to: "/fundamentos", label: "Fundamentos" },
      { to: "/figuras-ritmicas", label: "Figuras Rítmicas" },
      { to: "/harmonia", label: "Tríades & Voicings" },
      { to: "/harmonia-funcional", label: "Harmonia Funcional" },
      { to: "/ciclo-das-quintas", label: "Ciclo das Quintas" },
    ],
  },
  {
    id: "dominio",
    label: "Domínio",
    icon: "target",
    items: [
      { to: "/escalas-solos", label: "Escalas" },
      { to: "/caged", label: "Sistema CAGED" },
      { to: "/padroes-pentatonica", label: "Padrões na Pentatônica" },
      { to: "/arpejos", label: "Arpejos" },
      { to: "/escalas-avancadas", label: "Escalas Avançadas" },
      { to: "/avancado", label: "Modos Gregos" },
    ],
  },
  {
    id: "ferramentas",
    label: "Ferramentas",
    icon: "wrench",
    items: [
      { to: "/braco-violao", label: "Braço do Violão" },
      { to: "/maquina-acordes", label: "Máquina de Acordes" },
      { to: "/ear-lab", label: "Lab Auditivo" },
      { to: "/laboratorio-groove", label: "Laboratório do Groove" },
    ],
  },
  {
    id: "lendas",
    label: "Vocabulário",
    icon: "bookmark",
    items: [
      { to: "/lendas/licks", label: "Vocabulário de Licks" },
      { to: "/lendas/cliches-blues", label: "Clichês do Blues" },
      // ── Páginas de artistas individuais (desativadas) ────────────────
      // MPB:
      // { to: '/lendas/djavan',           label: 'Djavan'                },
      // { to: '/lendas/chico-buarque',    label: 'Chico Buarque'         },
      // { to: '/lendas/cartola',          label: 'Cartola'               },
      // { to: '/lendas/cazuza',           label: 'Cazuza'                },
      // Blues & Rock:
      // { to: '/lendas/paralamas',        label: 'Paralamas do Sucesso'  },
      // R&B / Soul:
      // { to: '/lendas/roupa-nova',       label: 'Roupa Nova'            },
      // { to: '/lendas/stevie-wonder',    label: 'Stevie Wonder'         },
      // { to: '/lendas/michael-jackson',  label: 'Michael Jackson'       },
    ],
  },
  {
    id: "treino",
    label: "Treino",
    icon: "trophy",
    items: [
      { to: "/improviso", label: "Lab. de Improviso" },
      { to: "/quiz", label: "Quiz Musical" },
      { to: "/progresso", label: "Meu Progresso" },
    ],
  },
];

// ─── Map of route → moduleId (used to detect completion per nav item) ───────
// Mirrors the catalog in Progresso.jsx
const ROUTE_TO_MODULE = {
  "/fundamentos": "fundamentals",
  "/figuras-ritmicas": "figuras_ritmicas",
  "/harmonia": "harmony",
  "/harmonia-funcional": "harmonia_funcional",
  "/ciclo-das-quintas": "ciclo_quintas",
  "/escalas-solos": "scales",
  "/caged": "caged",
  "/padroes-pentatonica": "penta_patterns",
  "/arpejos": "arpejos",
  "/escalas-avancadas": "escalas_avancadas",
  "/avancado": "advanced",
  "/maquina-acordes": "maquina_acordes",
  "/laboratorio-groove": "groove",
  "/lendas/licks": "licks",
  "/lendas/cliches-blues": "licks",
  "/improviso": "improviso",
  "/quiz": "quiz",
  "/tecnicas": "tecnicas",
  "/menor-melodica": "melodic-minor",
  "/jazz-blues": "jazz-blues",
};

// Returns true when the user has marked at least one lesson under this route's module
function hasCompletionForRoute(routePath, completedLessons) {
  const moduleId = ROUTE_TO_MODULE[routePath];
  if (!moduleId) return false;
  return Object.keys(completedLessons).some((k) =>
    k.startsWith(`${moduleId}:`)
  );
}

// Flatten items from groups (handles both flat `items` and nested `subgroups`)
function flattenGroupItems(g) {
  if (g.items) return g.items;
  if (g.subgroups) return g.subgroups.flatMap((sg) => sg.items);
  return [];
}

export const ALL_NAV = NAV_GROUPS.flatMap(flattenGroupItems);

// ─── Sidebar nav icon ────────────────────────────────────────────────────────
// Cada ícone é um SVG 16x16 stroke-based que herda `currentColor`,
// integrando com as cores do tema (claro/escuro) e do estado (ativo/inativo).

function NavIcon({ name, size = 15 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { flexShrink: 0, opacity: 0.9 },
  };
  switch (name) {
    case "note":
      return (
        <svg {...common}>
          <path d="M6 12.5V4l6-1.5v8" />
          <circle cx="4.5" cy="12.5" r="1.5" fill="currentColor" />
          <circle cx="10.5" cy="10.5" r="1.5" fill="currentColor" />
        </svg>
      );
    case "pulse":
      return (
        <svg {...common}>
          <path d="M1 8h2.5l1.5-5 3 10 1.5-5h6" />
        </svg>
      );
    case "stack":
      return (
        <svg {...common}>
          <rect x="2.5" y="3" width="11" height="2.2" rx="0.7" />
          <rect x="2.5" y="6.9" width="11" height="2.2" rx="0.7" />
          <rect x="2.5" y="10.8" width="11" height="2.2" rx="0.7" />
        </svg>
      );
    case "flow":
      return (
        <svg {...common}>
          <path d="M2 5h7a2.5 2.5 0 0 1 0 5H6a2.5 2.5 0 0 0 0 5h8" />
          <path d="M12 13l2 2-2 2" />
          <path d="M12 3l2 2-2 2" />
        </svg>
      );
    case "cycle":
      return (
        <svg {...common}>
          <path d="M13 4.5a5.5 5.5 0 1 0 1.4 5.5" />
          <path d="M13 1.5V5h-3.5" />
        </svg>
      );
    case "ladder":
      return (
        <svg {...common}>
          <path d="M4 2v12M12 2v12" />
          <path d="M4 5h8M4 8h8M4 11h8" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
          <path d="M6 2.5v11M10 2.5v11M2.5 6h11M2.5 10h11" />
        </svg>
      );
    case "dots":
      return (
        <svg {...common}>
          <circle cx="4" cy="4" r="1.3" fill="currentColor" />
          <circle cx="8" cy="4" r="1.3" fill="currentColor" />
          <circle cx="12" cy="4" r="1.3" fill="currentColor" />
          <circle cx="6" cy="8" r="1.3" fill="currentColor" />
          <circle cx="10" cy="8" r="1.3" fill="currentColor" />
          <circle cx="4" cy="12" r="1.3" fill="currentColor" />
          <circle cx="8" cy="12" r="1.3" fill="currentColor" />
          <circle cx="12" cy="12" r="1.3" fill="currentColor" />
        </svg>
      );
    case "wave":
      return (
        <svg {...common}>
          <path d="M1.5 8c1.5-4 3 4 4.5 0s3 4 4.5 0 3 4 4 0" />
        </svg>
      );
    case "mountain":
      return (
        <svg {...common}>
          <path d="M1.5 13l3.5-6 2.5 4 2-3 5 5z" />
        </svg>
      );
    case "columns":
      return (
        <svg {...common}>
          <path d="M3 4v9M8 2.5v11M13 5v8" />
        </svg>
      );
    case "guitar":
      return (
        <svg {...common}>
          <rect x="2.5" y="3" width="11" height="10" rx="1.5" />
          <path d="M2.5 6h11M2.5 8h11M2.5 10h11" />
        </svg>
      );
    case "chord":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="10" height="10" rx="1.2" />
          <circle cx="6" cy="6" r="1.1" fill="currentColor" />
          <circle cx="10" cy="8" r="1.1" fill="currentColor" />
          <circle cx="6" cy="10.5" r="1.1" fill="currentColor" />
        </svg>
      );
    case "ear":
      return (
        <svg {...common}>
          <path d="M5 9a3 3 0 0 1 6 0c0 1.5-1 2-1 3a1.5 1.5 0 1 1-3 0" />
          <path d="M5 9V7a3 3 0 0 1 6 0" />
        </svg>
      );
    case "drum":
      return (
        <svg {...common}>
          <ellipse cx="8" cy="5" rx="5" ry="2" />
          <path d="M3 5v6c0 1.1 2.2 2 5 2s5-0.9 5-2V5" />
          <path d="M5 1l-1 3M11 1l1 3" />
        </svg>
      );
    case "lightning":
      return (
        <svg {...common}>
          <path
            d="M9 1.5L3 9h4l-1 5.5L12 7H8z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "flame":
      return (
        <svg {...common}>
          <path d="M8 14c-3 0-5-2-5-4.5 0-2 1.5-3 2-4 .5 1 1.5 1.5 2 1 0-2-1-3 0-5 1 1.5 5 3 5 7C12 11.5 11 14 8 14z" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...common}>
          <path d="M8 2v3M8 11v3M2 8h3M11 8h3" />
          <path d="M4 4l1.5 1.5M10.5 10.5L12 12M4 12l1.5-1.5M10.5 5.5L12 4" />
        </svg>
      );
    case "question":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6" />
          <path d="M6.3 6.3a1.7 1.7 0 1 1 2.6 1.4c-.6.4-.9.7-.9 1.3" />
          <circle cx="8" cy="11.5" r="0.6" fill="currentColor" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M2 13h12" />
          <path d="M4 13V9M7 13V6M10 13V8M13 13V4" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M2.5 3.5h4a2 2 0 0 1 2 2v8a1.5 1.5 0 0 0-1.5-1.5h-4.5z" />
          <path d="M13.5 3.5h-4a2 2 0 0 0-2 2v8a1.5 1.5 0 0 1 1.5-1.5h4.5z" />
        </svg>
      );
    case "target":
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6" />
          <circle cx="8" cy="8" r="3.2" />
          <circle cx="8" cy="8" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...common}>
          <path d="M10.5 1.8a3.2 3.2 0 0 0-3.5 4.6L1.7 11.7a1.6 1.6 0 0 0 2.3 2.3l5.3-5.3a3.2 3.2 0 0 0 4.6-3.5l-2.1 2.1-1.7-1.7z" />
        </svg>
      );
    case "bookmark":
      return (
        <svg {...common}>
          <path d="M4 2.5h8v11.5l-4-2.8-4 2.8z" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...common}>
          <path d="M5 3h6v4a3 3 0 0 1-6 0z" />
          <path d="M5 4.5H3.2a1 1 0 0 0-1 1c0 1.5 1.2 2.5 2.8 2.5" />
          <path d="M11 4.5h1.8a1 1 0 0 1 1 1c0 1.5-1.2 2.5-2.8 2.5" />
          <path d="M8 10v2M5.5 13h5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="3" />
        </svg>
      );
  }
}

// ─── Logo ────────────────────────────────────────────────────────────────────

export function LogoMark({ height = 24 }) {
  // Official MusicMonster headphones — exact specs from handoff (78×62 viewBox)
  const width = Math.round(height * (78 / 62));
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 78 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block", flex: "none" }}
    >
      {/* Headband arc */}
      <path
        d="M9 47 C9 25 24 11 39 11 C54 11 69 25 69 47"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Left ear cup */}
      <circle cx="9" cy="50" r="8.5" fill="currentColor" />
      {/* Right ear cup */}
      <circle cx="69" cy="50" r="8.5" fill="currentColor" />
    </svg>
  );
}

// Wordmark with stylised vinyl-record "o" — exact from handoff
// Aceita cores explícitas (ink / hole) para uso em contextos fora do tema,
// como a Landing page (fundo branco fixo).
export function MusicMonsterWordmark({
  fontSize = 18,
  ink = "var(--text-base)",
  hole = "var(--bg-body)",
}) {
  const inkColor = ink;
  // Vinyl-record sized in em so it scales with fontSize
  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 800,
        fontSize,
        lineHeight: 1,
        color: inkColor,
        letterSpacing: "-0.02em",
        whiteSpace: "nowrap",
      }}
    >
      MusicM
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "0.6em",
          height: "0.6em",
          borderRadius: "50%",
          background: inkColor,
          verticalAlign: "-0.04em",
        }}
      >
        <span
          style={{
            display: "block",
            width: "0.25em",
            height: "0.25em",
            borderRadius: "50%",
            background: hole,
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "0.11em",
              height: "0.11em",
              borderRadius: "50%",
              background: inkColor,
            }}
          />
        </span>
      </span>
      nster
    </div>
  );
}

// ─── Chevron icon ────────────────────────────────────────────────────────────

function RoadmapIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      {/* Map outline */}
      <path
        d="M2 4l4-1.5L10 4l4-1.5v9.5L10 13.5 6 12l-4 1.5V4z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Vertical creases */}
      <path
        d="M6 2.5v9.5M10 4v9.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Pin */}
      <circle cx="8" cy="7" r="1.4" fill="currentColor" />
    </svg>
  );
}

function Chevron({ open }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{
        transform: open ? "rotate(90deg)" : "none",
        transition: "transform 0.2s ease",
      }}
    >
      <path
        d="M4 2.5L7.5 6L4 9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Layout ──────────────────────────────────────────────────────────────────

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { progress } = useProgress();
  const { isDark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const totalCompleted = Object.keys(progress.completedLessons).length;
  const progressPct = Math.min(
    100,
    Math.round((totalCompleted / TOTAL_LESSONS) * 100)
  );

  // Routes that render without sidebar (full-width centered content)
  const FULLSCREEN_ROUTES = ["/roadmap"];
  const hideSidebar = FULLSCREEN_ROUTES.includes(pathname);

  // Search results — filter all nav items by label
  const searchResults =
    searchQuery.trim().length > 0
      ? ALL_NAV.filter((item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 8)
      : [];

  // Mocked notifications (could come from API)
  const notifications = [
    {
      id: 1,
      icon: "🔥",
      text: "Você está em uma sequência de 3 dias!",
      time: "Agora",
    },
    {
      id: 2,
      icon: "🎉",
      text: "Nova lição de Modos Gregos disponível",
      time: "2h",
    },
    {
      id: 3,
      icon: "🏆",
      text: "Conquistou: Iniciante da Pentatônica",
      time: "1d",
    },
  ];
  const unreadCount = notifications.length;

  // Grupo que contém a rota atual (usado só para abrir automaticamente).
  const activeGroupId =
    NAV_GROUPS.find((g) => flattenGroupItems(g).some((i) => i.to === pathname))
      ?.id ?? null;

  // Múltiplos grupos podem ficar abertos ao mesmo tempo — cada um controla
  // sua própria expansão. Começa com o grupo da rota atual aberto.
  const [openGroupIds, setOpenGroupIds] = useState(() =>
    activeGroupId ? new Set([activeGroupId]) : new Set()
  );

  // Ao navegar pra outra rota, garante que o grupo dono da rota fique aberto
  // (sem fechar os outros que o usuário já expandiu manualmente).
  useEffect(() => {
    if (!activeGroupId) return;
    setOpenGroupIds((prev) => {
      if (prev.has(activeGroupId)) return prev;
      const next = new Set(prev);
      next.add(activeGroupId);
      return next;
    });
  }, [activeGroupId]);

  const toggleGroup = (id) =>
    setOpenGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-body)", color: "var(--text-base)" }}
    >
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HEADER (full-width, overlaps sidebar — AlgoMonster style)           */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <header
        className="app-header sticky top-0 z-40 backdrop-blur-md"
        style={{
          background: "var(--bg-header)",
          borderBottom: "1px solid var(--border-header)",
        }}
      >
        <div className="flex items-center gap-3 px-4 md:px-6" style={{ height: 60 }}>
          {/* Mobile menu trigger */}
          <button
            className="md:hidden p-2 rounded-lg transition"
            style={{
              color: "var(--text-muted)",
              background: "var(--nav-hover-bg)",
            }}
            onClick={() => setMobileOpen(true)}
            aria-label="Menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                y="2"
                width="16"
                height="1.5"
                rx=".75"
                fill="currentColor"
              />
              <rect
                y="7"
                width="12"
                height="1.5"
                rx=".75"
                fill="currentColor"
              />
              <rect
                y="12"
                width="16"
                height="1.5"
                rx=".75"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link
            to="/inicio"
            className="flex items-center shrink-0"
            onClick={() => setMobileOpen(false)}
            style={{ color: "var(--text-base)", gap: 8 }}
          >
            <LogoMark height={22} />
            <div className="hidden sm:block">
              <MusicMonsterWordmark fontSize={18} />
            </div>
          </Link>

          {/* Divider */}
          <div
            className="hidden md:block h-6 w-px ml-2 mr-1"
            style={{ background: "var(--border-card)" }}
          />

          {/* Breadcrumbs (current page) */}
          <div className="min-w-0">
            <Breadcrumbs />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Contador de progresso — bolinha verde + X / Y */}
            <Link
              to="/progresso"
              className="hidden sm:inline-flex items-center gap-2 px-3 rounded-lg text-[12.5px] font-semibold transition-colors"
              style={{
                height: 36,
                background: "var(--nav-hover-bg)",
                border: "1px solid var(--border-card)",
                color: "var(--text-base)",
              }}
              title="Meu progresso"
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: "var(--brand-progress)" }}
              />
              <span className="tabular-nums">
                {totalCompleted} / {TOTAL_LESSONS}
              </span>
            </Link>

            {/* User menu */}
            <div className="relative ml-1">
              <button
                onClick={() => {
                  setUserMenuOpen((o) => !o);
                  setNotifOpen(false);
                }}
                className="flex items-center gap-1 h-9 pl-1 pr-1.5 rounded-full transition"
                style={{
                  background: userMenuOpen
                    ? "var(--nav-hover-bg)"
                    : "transparent",
                  border: "1px solid transparent",
                }}
                title={user?.name ?? "Perfil"}
              >
                <span
                  className="grid place-items-center rounded-full text-[12px] font-bold text-white"
                  style={{
                    width: 32,
                    height: 32,
                    background: "var(--brand-primary)",
                  }}
                >
                  {(user?.name ?? "U").charAt(0).toUpperCase()}
                </span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  style={{ color: "var(--text-ultra)" }}
                >
                  <path
                    d="M2 4l3 3 3-3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {userMenuOpen && (
                <UserMenuPopover
                  user={user}
                  onClose={() => setUserMenuOpen(false)}
                  onLogout={logout}
                  isDark={isDark}
                  toggleTheme={toggle}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BODY (sidebar + main content, both BELOW the header)                */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 min-h-0">
        {!hideSidebar && (
          <>
            {/* ── Sidebar ──────────────────────────────────────────────────────── */}
            <aside
              className={`sidebar fixed md:sticky md:inset-auto shrink-0 z-30 inset-y-0 left-0 flex flex-col transform transition-all ${
                mobileOpen
                  ? "translate-x-0"
                  : "-translate-x-full md:translate-x-0"
              } ${
                sidebarCollapsed
                  ? "md:!w-0 md:!min-w-0 md:overflow-hidden md:border-r-0"
                  : ""
              }`}
              style={{
                width: sidebarCollapsed ? 0 : 238,
                top: 56,
                height: "calc(100vh - 56px)",
                transition: "width 0.25s ease, transform 0.25s ease",
              }}
            >
              {/* ── Search (moved from header) ───────────────────────────────── */}
              <div className="px-4 pt-4 pb-3 shrink-0 relative">
                <div
                  className="flex items-center gap-2 px-3 h-9 rounded-lg transition-all"
                  style={{
                    background: "var(--bg-card)",
                    border: `1px solid ${
                      searchFocused ? "#3b82f6" : "var(--border-card)"
                    }`,
                    boxShadow: searchFocused
                      ? "0 0 0 3px rgba(59,130,246,0.15)"
                      : "none",
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 14 14"
                    fill="none"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <circle
                      cx="6"
                      cy="6"
                      r="4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M9.5 9.5L12 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() =>
                      setTimeout(() => setSearchFocused(false), 150)
                    }
                    placeholder="Buscar..."
                    className="flex-1 bg-transparent outline-none text-[12.5px] font-medium min-w-0"
                    style={{ color: "var(--text-base)" }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-[12px] font-bold"
                      style={{ color: "var(--text-ultra)" }}
                      aria-label="Limpar busca"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Search dropdown */}
                {searchFocused && searchResults.length > 0 && (
                  <div
                    className="absolute left-4 right-4 mt-1 rounded-xl overflow-hidden z-50"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-card)",
                      boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                      top: "calc(100% - 8px)",
                    }}
                  >
                    {searchResults.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => {
                          setSearchQuery("");
                          setSearchFocused(false);
                          setMobileOpen(false);
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-[12.5px] transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        style={{ color: "var(--text-base)" }}
                      >
                        <span style={{ fontSize: 11, opacity: 0.5 }}>↗</span>
                        <span className="font-medium truncate">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Navigation (accordion) ───────────────────────────────────── */}
              <nav className="flex-1 overflow-y-auto px-3 pb-2 space-y-0.5">
                {NAV_GROUPS.map((group) => {
                  const isOpen = openGroupIds.has(group.id);
                  const groupItems = flattenGroupItems(group);
                  const hasActive = groupItems.some((i) => i.to === pathname);

                  const renderItem = (item) => {
                    const isComplete = hasCompletionForRoute(
                      item.to,
                      progress.completedLessons
                    );
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        onClick={() => setMobileOpen(false)}
                        className="sidebar-item relative flex items-center gap-3 px-3 rounded-lg text-[13.5px] transition-all"
                        style={({ isActive }) => ({
                          height: 32,
                          background: isActive
                            ? "var(--nav-active-bg)"
                            : "transparent",
                          color: isActive
                            ? "var(--nav-active-fg)"
                            : "var(--nav-inactive)",
                          fontWeight: isActive ? 700 : 500,
                        })}
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className="sidebar-bullet"
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                flexShrink: 0,
                                background: isComplete
                                  ? "var(--brand-progress)"
                                  : "transparent",
                                border: isComplete
                                  ? "none"
                                  : "1.5px solid var(--bullet-border)",
                                transition:
                                  "background 0.2s, border 0.2s",
                              }}
                            />
                            {item.label}
                          </>
                        )}
                      </NavLink>
                    );
                  };

                  return (
                    <div key={group.id}>
                      {/* Group header button */}
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors"
                        style={{
                          color: hasActive
                            ? "var(--text-base)"
                            : "var(--text-ultra)",
                          background: isOpen
                            ? "rgba(255,255,255,0.04)"
                            : "transparent",
                        }}
                      >
                        <span
                          className="uppercase"
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            letterSpacing: "0.14em",
                            color: "var(--text-subtle)",
                          }}
                        >
                          {group.label}
                        </span>
                        <span
                          style={{
                            color: isOpen
                              ? "var(--text-muted)"
                              : "var(--text-ultra)",
                            opacity: 0.7,
                          }}
                        >
                          <Chevron open={isOpen} />
                        </span>
                      </button>

                      {/* Group body */}
                      {isOpen && (
                        <div className="mt-0.5 mb-1 ml-1 flex flex-col gap-0.5">
                          {group.subgroups
                            ? group.subgroups.map((sg, sgIdx) => (
                                <div
                                  key={sg.label}
                                  style={{ marginTop: sgIdx === 0 ? 0 : 6 }}
                                >
                                  <div
                                    style={{
                                      fontSize: 9,
                                      fontWeight: 700,
                                      color: "var(--text-ultra)",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.14em",
                                      padding: "4px 12px 2px",
                                    }}
                                  >
                                    {sg.label}
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    {sg.items.map(renderItem)}
                                  </div>
                                </div>
                              ))
                            : group.items.map(renderItem)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* ── Bottom bar ───────────────────────────────────────────────── */}
              <div
                className="shrink-0 px-3 pb-4 pt-2 space-y-2"
                style={{ borderTop: "1px solid var(--border-card)" }}
              >
                {/* Compact progress card */}
                {/* Seu progresso — barra verde sólida (sem gradiente) */}
                <Link
                  to="/progresso"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg transition-colors"
                  style={{
                    padding: "10px 4px 4px",
                    textDecoration: "none",
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[12px] font-semibold"
                      style={{ color: "var(--text-subtle)" }}
                    >
                      Seu progresso
                    </span>
                    <span
                      className="text-[12px] font-bold tabular-nums"
                      style={{ color: "var(--brand-progress)" }}
                    >
                      {progressPct}%
                    </span>
                  </div>
                  <div
                    style={{
                      background: "var(--ink-08)",
                      borderRadius: 999,
                      height: 4,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${progressPct}%`,
                        height: "100%",
                        borderRadius: 999,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </Link>

                {/* Theme + logout */}
                <div className="flex gap-2">
                  <button
                    onClick={toggle}
                    title={isDark ? "Tema claro" : "Tema escuro"}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium transition"
                    style={{
                      background: "var(--nav-hover-bg)",
                      border: "1px solid var(--border-card)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <span>{isDark ? "☀" : "◑"}</span>
                    {isDark ? "Claro" : "Escuro"}
                  </button>

                  {user && (
                    <button
                      onClick={logout}
                      className="flex items-center justify-center px-3 py-2 rounded-lg text-[11px] font-medium transition"
                      style={{
                        background: "var(--nav-hover-bg)",
                        border: "1px solid var(--border-card)",
                        color: "var(--text-subtle)",
                      }}
                    >
                      Sair
                    </button>
                  )}
                </div>
              </div>
            </aside>

            {/* ── Sidebar collapse toggle (minimalist hover rail) ────────────────── */}
            <button
              onClick={() => setSidebarCollapsed((c) => !c)}
              aria-label={sidebarCollapsed ? "Abrir sidebar" : "Fechar sidebar"}
              className="sidebar-toggle hidden md:flex group"
              style={{
                position: "sticky",
                top: 56,
                height: "calc(100vh - 56px)",
                width: 12,
                alignItems: "center",
                justifyContent: "center",
                zIndex: 25,
                background: "transparent",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
              }}
            >
              {/* Thin vertical rail (always visible, subtle) */}
              <span
                aria-hidden="true"
                className="sidebar-toggle__rail"
                style={{
                  width: 2,
                  height: 28,
                  borderRadius: 999,
                  background: "var(--border-card)",
                  transition: "background 0.15s, height 0.2s",
                }}
              />
              {/* Arrow chip (visible on hover) */}
              <span
                aria-hidden="true"
                className="sidebar-toggle__arrow"
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--text-muted)",
                  opacity: 0,
                  transition: "opacity 0.15s",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d={sidebarCollapsed ? "M3 2L7 5L3 8" : "M7 2L3 5L7 8"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </>
        )}

        {/* Mobile overlay (under header, above content) */}
        {mobileOpen && (
          <div
            className="fixed left-0 right-0 bottom-0 z-20 bg-black/50 md:hidden"
            style={{ top: 56 }}
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col">
          <main
            className={`flex-1 pt-6 md:pt-10 pb-10 w-full mx-auto fade-up ${
              hideSidebar
                ? "px-6 md:px-10 max-w-6xl"
                : "px-8 md:px-20 lg:px-32 xl:px-40 max-w-5xl"
            }`}
          >
            {children}
          </main>
        </div>
      </div>

      {/* ── Ask AI modal (placeholder) ─────────────────────────────── */}
    </div>
  );
}

function NotifPopover({ items, onClose }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden z-50"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
          boxShadow: "0 14px 40px rgba(0,0,0,0.20)",
        }}
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border-card)" }}
        >
          <div
            className="text-[13px] font-bold"
            style={{ color: "var(--text-base)" }}
          >
            Notificações
          </div>
          <button
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "#3b82f6" }}
            onClick={onClose}
          >
            Marcar todas
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {items.map((n) => (
            <li
              key={n.id}
              className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
              style={{ borderBottom: "1px solid var(--border-card)" }}
              onClick={onClose}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>{n.icon}</span>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[12.5px] leading-snug"
                  style={{ color: "var(--text-base)" }}
                >
                  {n.text}
                </div>
                <div
                  className="mt-1 text-[10px]"
                  style={{ color: "var(--text-ultra)" }}
                >
                  {n.time}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ─── User menu popover ──────────────────────────────────────────────────────

function UserMenuPopover({ user, onClose, onLogout, isDark, toggleTheme }) {
  const itemStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 12.5,
    fontWeight: 500,
    color: "var(--text-base)",
    cursor: "pointer",
    transition: "background 0.12s",
  };
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="absolute right-0 top-full mt-2 w-60 rounded-xl overflow-hidden z-50 p-1.5"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
          boxShadow: "0 14px 40px rgba(0,0,0,0.20)",
        }}
      >
        {user && (
          <div
            className="px-3 py-3"
            style={{
              borderBottom: "1px solid var(--border-card)",
              marginBottom: 6,
            }}
          >
            <div
              className="text-[13px] font-bold leading-tight"
              style={{ color: "var(--text-base)" }}
            >
              {user.name}
            </div>
            <div
              className="text-[11px] mt-0.5 truncate"
              style={{ color: "var(--text-ultra)" }}
            >
              {user.email}
            </div>
          </div>
        )}
        <Link
          to="/progresso"
          onClick={onClose}
          style={itemStyle}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--nav-hover-bg)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <span style={{ fontSize: 14 }}>📊</span> Meu progresso
        </Link>
        <button
          onClick={() => {
            toggleTheme();
            onClose();
          }}
          style={{
            ...itemStyle,
            width: "100%",
            textAlign: "left",
            background: "transparent",
            border: "none",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--nav-hover-bg)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <span style={{ fontSize: 14 }}>{isDark ? "☀" : "◑"}</span>
          Tema {isDark ? "claro" : "escuro"}
        </button>
        <div
          style={{
            height: 1,
            background: "var(--border-card)",
            margin: "6px 4px",
          }}
        />
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          style={{
            ...itemStyle,
            width: "100%",
            textAlign: "left",
            background: "transparent",
            border: "none",
            color: "#ef4444",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(239,68,68,0.08)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <span style={{ fontSize: 14 }}>↩</span> Sair
        </button>
      </div>
    </>
  );
}

// ─── Breadcrumbs ─────────────────────────────────────────────────────────────

function Breadcrumbs() {
  const { pathname } = useLocation();
  const current = ALL_NAV.find((n) => n.to === pathname) ?? { label: "Início" };
  return (
    <div className="text-sm flex items-center gap-2">
      <span className="hidden sm:inline" style={{ color: "var(--text-ultra)" }}>
        MusicMonster
      </span>
      <span className="hidden sm:inline" style={{ color: "var(--text-ultra)" }}>
        /
      </span>
      <span className="font-medium" style={{ color: "var(--text-base)" }}>
        {current.label}
      </span>
    </div>
  );
}
