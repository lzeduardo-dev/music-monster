import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { MODULE_LESSONS } from "../data/moduleLessons.js";
import { ALL_NAV } from "./Layout.jsx";

/**
 * Standardised footer for every module page.
 *
 * Props:
 *   moduleId  — string, the module identifier (e.g. "fundamentos")
 *   lessons   — string[] of lesson IDs that belong to this module.
 *               When omitted, falls back to a single "${moduleId}:summary" key.
 *   quizPath  — route to start the related quiz. Defaults to "/quiz".
 */
export default function LessonFooter({
  moduleId,
  lessons,
  quizPath = "/quiz",
}) {
  const {
    markModule,
    isModuleComplete,
    toggleBookmark,
    isBookmarked,
    setFeedback,
    getFeedback,
  } = useProgress();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const ids =
    lessons && lessons.length > 0
      ? lessons
      : MODULE_LESSONS[moduleId] ?? ["summary"];
  const completed = isModuleComplete(moduleId, ids);
  const bookmarked = isBookmarked(moduleId);
  const feedback = getFeedback(moduleId);

  // Find next nav item in the sidebar order
  const nextRoute = (() => {
    const currentIdx = ALL_NAV.findIndex((n) => n.to === pathname);
    if (currentIdx < 0 || currentIdx >= ALL_NAV.length - 1) return null;
    return ALL_NAV[currentIdx + 1].to;
  })();

  const handleFeedback = (value) => {
    setFeedback(moduleId, feedback === value ? null : value);
  };

  const handleComplete = () => {
    markModule(moduleId, ids);
    // Only navigate forward (not when un-marking)
    if (!completed && nextRoute) {
      // tiny delay so the state change is visible before the route changes
      setTimeout(() => navigate(nextRoute), 350);
    }
  };

  return (
    <footer
      className="mt-10 pt-8 border-t"
      style={{ borderColor: "var(--border-card)" }}
    >
      {/* ── Feedback row ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div
          className="text-[14px] font-medium"
          style={{ color: "var(--text-base)" }}
        >
          Esta lição foi clara?
        </div>
        <div className="flex items-center gap-3">
          <FeedbackButton
            emoji="👍"
            active={feedback === "up"}
            onClick={() => handleFeedback("up")}
            label="Sim, foi clara"
          />
          <FeedbackButton
            emoji="👎"
            active={feedback === "down"}
            onClick={() => handleFeedback("down")}
            label="Não foi clara"
          />
        </div>
      </div>

      {/* ── Action row ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Start Quiz — solid indigo, white text in both themes */}
          <Link
            to={quizPath}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[14px] transition-transform hover:scale-[1.02] active:scale-[0.99]"
            style={{
              background: "#4f46e5",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(79,70,229,0.30)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle
                cx="9"
                cy="9"
                r="7.5"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path d="M7.5 6L12 9L7.5 12V6Z" fill="currentColor" />
            </svg>
            Iniciar Quiz
          </Link>

          {/* Completed — solid blue → green when done.
              In light theme the "pending" state is a white outline button.
              When marked, navigates to the next subject automatically. */}
          <button
            onClick={handleComplete}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[14px] transition-transform hover:scale-[1.02] active:scale-[0.99]"
            style={{
              background: completed
                ? "#22c55e"
                : isDark
                ? "#3b82f6"
                : "#ffffff",
              color: completed ? "#ffffff" : isDark ? "#ffffff" : "#3b82f6",
              border:
                completed || isDark
                  ? "1px solid transparent"
                  : "1.5px solid #3b82f6",
              boxShadow: completed
                ? "0 4px 12px rgba(34,197,94,0.30)"
                : isDark
                ? "0 4px 12px rgba(59,130,246,0.30)"
                : "0 2px 8px rgba(59,130,246,0.12)",
            }}
            title={
              !completed && nextRoute
                ? "Conclui e segue pro próximo assunto"
                : undefined
            }
          >
            {completed && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3.5 8L6.5 11L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {completed
              ? "Concluída"
              : nextRoute
              ? "Concluir e continuar"
              : "Marcar como concluída"}
            {!completed && nextRoute && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7h8M7.5 3.5L11 7l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => toggleBookmark(moduleId)}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-[14px] transition-colors"
          style={{
            background: bookmarked ? "rgba(245,158,11,0.10)" : "transparent",
            color: bookmarked ? "#f59e0b" : "var(--text-base)",
            border: `1px solid ${
              bookmarked ? "rgba(245,158,11,0.35)" : "var(--border-card)"
            }`,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill={bookmarked ? "currentColor" : "none"}
          >
            <path
              d="M4 2h8v12l-4-2.5L4 14V2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {bookmarked ? "Favoritada" : "Favoritar"}
        </button>
      </div>
    </footer>
  );
}

// ─── Feedback button ───────────────────────────────────────────────────────

function FeedbackButton({ emoji, active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid place-items-center w-12 h-12 rounded-xl transition-all hover:scale-110 active:scale-95"
      style={{
        background: active ? "rgba(59,130,246,0.10)" : "var(--bg-card)",
        border: `1px solid ${active ? "#3b82f6" : "var(--border-card)"}`,
        boxShadow: active ? "0 0 0 3px rgba(59,130,246,0.15)" : "none",
        fontSize: 20,
        lineHeight: 1,
      }}
    >
      {emoji}
    </button>
  );
}
