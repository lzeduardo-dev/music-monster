import { COMMON_ROOTS } from "../lib/theory.js";

export function PageHeader({ chip, title, description }) {
  return (
    <div className="mb-8 md:mb-10">
      {chip && (
        <div
          className="uppercase mb-3"
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "var(--brand-accent-on-dark, #eab308)",
          }}
        >
          {chip}
        </div>
      )}
      <h1
        className="font-display"
        style={{
          fontSize: "clamp(30px, 3.6vw, 40px)",
          fontWeight: 700,
          letterSpacing: "-0.025em",
          lineHeight: 1.12,
          color: "var(--text-base)",
          margin: 0,
        }}
      >
        {title}
      </h1>
      {description && (
        <p
          style={{
            marginTop: 12,
            maxWidth: 700,
            fontSize: 16.5,
            lineHeight: 1.65,
            color: "var(--text-subtle)",
          }}
        >
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
    <section style={{ marginBottom: 44, maxWidth: 720 }}>
      <div className="flex items-end justify-between mb-3 gap-3 flex-wrap">
        <h2
          className="font-display"
          style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-0.015em",
            color: "var(--text-base)",
            margin: 0,
          }}
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
        background: "#eab308",
        color: "#1a0628",
        border: "1px solid #eab308",
      },
      idle: {
        background: "transparent",
        color: "var(--text-muted)",
        border: "1px solid var(--border-card)",
      },
    },
    coral: {
      active: {
        background: "#eab308",
        color: "#1a0628",
        border: "1px solid #eab308",
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
      style={{
        marginTop: 8,
        marginBottom: 12,
        fontSize: 16,
        lineHeight: 1.75,
        color: "var(--text-muted)",
      }}
      className="theory-block"
    >
      {children}
    </div>
  );
}

export function Step({ n, children }) {
  return (
    <div
      style={{
        marginTop: 12,
        fontSize: 16,
        lineHeight: 1.75,
        color: "var(--text-muted)",
      }}
    >
      {children}
    </div>
  );
}

/**
 * Destaque de fórmula: bloco simples com faixa lateral azul.
 * Sem cartão, sem fundo, apenas tipografia display e alinhamento.
 */
export function Formula({ children }) {
  return (
    <div
      className="font-display"
      style={{
        borderLeft: "2px solid var(--brand-primary, #2563eb)",
        padding: "20px 24px",
        margin: "24px 0",
        fontSize: 24,
        fontWeight: 600,
        letterSpacing: "0.06em",
        color: "var(--brand-primary-on-dark, #7dabff)",
        lineHeight: 1.4,
      }}
    >
      {children}
    </div>
  );
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
              color: p === -1 ? "#eab308" : p === 0 ? "#60a5fa" : "transparent",
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
