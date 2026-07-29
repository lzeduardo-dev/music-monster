import { COMMON_ROOTS } from "../lib/theory.js";

export function PageHeader({ chip, title, description }) {
  return (
    <div className="mb-6 md:mb-8">
      {chip && <span className="chip mb-3 inline-flex">{chip}</span>}
      <h1
        className="text-3xl md:text-4xl font-extrabold tracking-tight"
        style={{ color: "var(--text-base)" }}
      >
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-3xl" style={{ color: "var(--text-muted)" }}>
          {description}
        </p>
      )}
    </div>
  );
}

// Strips leading numeric prefix like "1. " / "12. " from section titles so
// authors can keep inline ordering in source while the UI shows clean titles.
function stripLeadingNumber(text) {
  if (typeof text !== "string") return text;
  return text.replace(/^\s*\d+\s*[.)\-—:]\s*/, "");
}

export function Section({ title, children, action }) {
  return (
    <section className="mb-16 md:mb-24">
      <div className="flex items-end justify-between mb-3 gap-3 flex-wrap">
        <h2
          className="text-xl md:text-2xl font-bold"
          style={{ color: "var(--text-base)" }}
        >
          {stripLeadingNumber(title)}
        </h2>
        {action && <div className="flex flex-wrap gap-2">{action}</div>}
      </div>
      {children}
    </section>
  );
}

export function NotePicker({ value, onChange, label = "Tônica" }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {label && (
        <label
          className="text-xs uppercase tracking-wider"
          style={{ color: "var(--text-subtle)" }}
        >
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-1">
        {COMMON_ROOTS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold transition"
            style={{
              background: value === n ? "#2563eb" : "rgba(255,255,255,0.05)",
              color: value === n ? "#fff" : "var(--text-muted)",
              border:
                value === n ? "1px solid #2563eb" : "1px solid transparent",
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Pill({ children, tone = "emerald", onClick, active = false }) {
  const styles = {
    emerald: {
      active: {
        background: "#2563eb",
        color: "#fff",
        border: "1px solid #2563eb",
      },
      idle: {
        background: "transparent",
        color: "var(--text-muted)",
        border: "1px solid var(--border-card)",
      },
    },
    amber: {
      active: {
        background: "#c084fc",
        color: "#1a0628",
        border: "1px solid #c084fc",
      },
      idle: {
        background: "transparent",
        color: "var(--text-muted)",
        border: "1px solid var(--border-card)",
      },
    },
    coral: {
      active: {
        background: "#f472b6",
        color: "#1a0628",
        border: "1px solid #f472b6",
      },
      idle: {
        background: "transparent",
        color: "var(--text-muted)",
        border: "1px solid var(--border-card)",
      },
    },
  };
  const s = (styles[tone] || styles.emerald)[active ? "active" : "idle"];
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-semibold transition"
      style={s}
    >
      {children}
    </button>
  );
}

export function TheoryBlock({ children }) {
  return (
    <div
      className="py-3 leading-relaxed space-y-5 mb-6 text-[15px] md:text-[16px]"
      style={{ color: "var(--text-body, var(--text-muted))" }}
    >
      {children}
    </div>
  );
}

export function Step({ n, children }) {
  return <div className="leading-[1.7]">{children}</div>;
}

// Guitar chord diagram renderer
// positions: [E6, A5, D4, G3, B2, e1] — -1=muted, 0=open, n=absolute fret
// barre: { fret: n, from: stringIndex, to: stringIndex }
// startFret: first fret row shown (1 = nut)
export function ChordDiagram({
  name,
  subtitle,
  positions = [],
  startFret = 1,
  barre,
}) {
  const ROWS = 4;
  const W = 24;
  const isNut = startFret === 1;
  const total = 6 * W;

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      {name && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--text-base)",
            textAlign: "center",
            marginBottom: 2,
          }}
        >
          {name}
        </div>
      )}
      {subtitle && (
        <div
          style={{
            fontSize: 10,
            color: "var(--text-ultra)",
            textAlign: "center",
            marginBottom: 2,
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Mute / open indicators above nut */}
      <div style={{ display: "flex", width: total }}>
        {positions.map((p, i) => (
          <div
            key={i}
            style={{
              width: W,
              textAlign: "center",
              fontSize: 11,
              height: 14,
              lineHeight: "14px",
              fontWeight: 800,
              color: p === -1 ? "#f472b6" : p === 0 ? "#60a5fa" : "transparent",
            }}
          >
            {p === -1 ? "×" : p === 0 ? "○" : ""}
          </div>
        ))}
      </div>

      {/* Nut bar */}
      <div
        style={{
          width: total,
          height: isNut ? 4 : 2,
          background: isNut ? "var(--ink-60)" : "var(--ink-25)",
          borderRadius: 2,
        }}
      />

      {/* Fret grid */}
      <div style={{ position: "relative", width: total }}>
        {/* Vertical string lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{ width: W, display: "flex", justifyContent: "center" }}
            >
              <div
                style={{
                  width: 1.5,
                  height: "100%",
                  background: "var(--ink-30)",
                }}
              />
            </div>
          ))}
        </div>

        {Array.from({ length: ROWS }).map((_, row) => {
          const fretNum = row + startFret;
          const hasBarreHere = barre && barre.fret === fretNum;
          return (
            <div
              key={row}
              style={{
                display: "flex",
                height: 24,
                alignItems: "center",
                position: "relative",
                borderBottom: "1px solid var(--ink-20)",
              }}
            >
              {/* Barre bar */}
              {hasBarreHere && (
                <div
                  style={{
                    position: "absolute",
                    left: barre.from * W + 5,
                    width: (barre.to - barre.from + 1) * W - 10,
                    height: 14,
                    background: "#2563eb",
                    borderRadius: 7,
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.85,
                    zIndex: 0,
                  }}
                />
              )}

              {positions.map((p, col) => {
                const isCoveredByBarre =
                  hasBarreHere &&
                  col >= barre.from &&
                  col <= barre.to &&
                  p === fretNum;
                const showDot = p === fretNum && !isCoveredByBarre;
                return (
                  <div
                    key={col}
                    style={{
                      width: W,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {showDot && (
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          background: "#3b82f6",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Start fret label */}
      {!isNut && (
        <div
          style={{
            fontSize: 10,
            color: "var(--text-subtle)",
            fontWeight: 700,
            textAlign: "center",
            marginTop: 2,
          }}
        >
          {startFret}fr
        </div>
      )}

      {/* String labels */}
      <div style={{ display: "flex", width: total, marginTop: 3 }}>
        {["E", "A", "D", "G", "B", "e"].map((s, i) => (
          <div
            key={i}
            style={{
              width: W,
              textAlign: "center",
              fontSize: 10,
              fontWeight: 600,
              color: "var(--ink-50)",
            }}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
