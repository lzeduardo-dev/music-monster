import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { LogoMark, MusicMonsterWordmark } from "../components/Layout.jsx";

// ─── Landing page ──────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
      }}
    >
      {/* ── Nav (branco, wordmark colorido + pills) ───────────────────── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 78,
          padding: "0 clamp(20px, 4vw, 40px)",
          background: "#fff",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "#17202b",
          }}
        >
          <LogoMark height={26} />
          <MusicMonsterWordmark fontSize={22} ink="#17202b" hole="#ffffff" />
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <NavPill onClick={() => setAuthOpen(true)}>Entrar</NavPill>
        </nav>
      </header>

      {/* ── Hero (dark radial + dot pattern + fade branco embaixo) ────── */}
      <section
        style={{
          position: "relative",
          minHeight: 720,
          overflow: "hidden",
          background:
            "radial-gradient(680px 480px at 68% 46%, rgba(56,132,255,.42) 0%, rgba(37,99,235,.10) 45%, transparent 72%), linear-gradient(180deg, #101c33 0%, #0c1728 55%, #0b1524 100%)",
        }}
      >
        {/* Padrão de pontos */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.10) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* Fade branco embaixo */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 110,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.9) 78%, #fff 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            height: "100%",
            minHeight: 720,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            padding: "0 clamp(24px, 5vw, 72px)",
          }}
        >
          <div style={{ flex: 1, minWidth: 0, maxWidth: 700 }}>
            {/* Eyebrow pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 16px 8px 13px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,.14)",
                background: "rgba(255,255,255,.05)",
                fontSize: 13.5,
                color: "rgba(232,238,247,.82)",
              }}
            >
              <span style={{ color: "#eab308", fontSize: 13 }}>✦</span>
              Teoria, harmonia e braço do violão · em português
            </div>

            <h1
              className="font-display"
              style={{
                margin: "26px 0 0",
                fontWeight: 700,
                fontSize: "clamp(38px, 5.4vw, 56px)",
                lineHeight: 1.08,
                letterSpacing: "-.03em",
                color: "#fff",
              }}
            >
              A forma mais
              <br />
              <span style={{ color: "#5aa9ff" }}>estruturada</span>{" "}
              <span style={{ color: "#f3e3a8" }}>de aprender</span>
              <br />
              música de verdade
            </h1>

            <p
              style={{
                margin: "26px 0 0",
                maxWidth: 520,
                fontSize: 18,
                lineHeight: 1.68,
                color: "rgba(226,234,246,.72)",
              }}
            >
              Domine teoria, harmonia e o braço do violão com uma trilha
              completa: e ganhe o conhecimento sistemático para tocar qualquer
              música.
            </p>

            <div
              style={{
                display: "flex",
                gap: 14,
                marginTop: 38,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => navigate("/fundamentos")}
                style={{
                  height: 54,
                  padding: "0 28px",
                  borderRadius: 999,
                  border: "none",
                  background: "#eab308",
                  color: "#17202b",
                  fontFamily: "inherit",
                  fontSize: 15.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 0 34px rgba(234,179,8,.35)",
                }}
              >
                Começar pelos Fundamentos →
              </button>
              <button
                onClick={() => navigate("/roadmap")}
                style={{
                  height: 54,
                  padding: "0 26px",
                  borderRadius: 999,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,.28)",
                  color: "#fff",
                  fontFamily: "inherit",
                  fontSize: 15.5,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Ver a Trilha
              </button>
            </div>
          </div>

          {/* Imagem da guitarra + wordmark (só em telas grandes) */}
          <img
            src="/hero-guitar.png"
            alt="MusicMonster"
            className="hero-guitar"
            style={{
              flexShrink: 0,
              width: "clamp(320px, 34vw, 520px)",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.35))",
              pointerEvents: "none",
            }}
          />
        </div>
      </section>

      {/* ── Stats + "Por onde começar" (fundo branco) ─────────────────── */}

      {/* ── O que oferecemos ──────────────────────────────────────────── */}
      <section
        style={{
          background: "#f8fafc",
          padding: "90px clamp(24px, 5vw, 72px) 110px",
        }}
      >
        <div
          style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 56px" }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#3b82f6",
              marginBottom: 14,
            }}
          >
            O que oferecemos
          </div>
          <h2
            style={{
              fontSize: "clamp(30px, 4vw, 44px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "#0f172a",
              margin: 0,
            }}
          >
            Tudo que você precisa
            <br />
            pra tocar de verdade
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            maxWidth: 1180,
            margin: "0 auto",
          }}
        >
          <FeatureCard
            iconBg="#dbeafe"
            iconColor="#2563eb"
            title="Teoria que faz sentido"
            desc="Trilha completa do zero ao improviso, com áudio em tempo real e o braço da guitarra na tela. Chega de decorar sem entender."
            icon={
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 5.5A1.5 1.5 0 0 1 5.5 4h5v14h-5A1.5 1.5 0 0 1 4 16.5v-11Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M20 5.5A1.5 1.5 0 0 0 18.5 4h-5v14h5a1.5 1.5 0 0 0 1.5-1.5v-11Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M4 20h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            }
          />
          <FeatureCard
            iconBg="#fef3c7"
            iconColor="#a16207"
            title="Ferramentas na palma da mão"
            desc="Máquina de acordes, lab auditivo, playback de improviso. Tudo dentro do site, sem plugin nem download."
            icon={
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14.5 3a4.5 4.5 0 0 0-4.4 5.5l-6.6 6.6a1.5 1.5 0 0 0 2.1 2.1l6.6-6.6A4.5 4.5 0 0 0 21 5l-2.5 2.5-2.4-2.4L18.5 3H14.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <FeatureCard
            iconBg="#dcfce7"
            iconColor="#15803d"
            title="Ritmo no lugar certo"
            desc="Metrônomo por figura, subdivisão e tempo. Treine leitura rítmica, groove e precisão sem sair da lição."
            icon={
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M8 3h8l3 18H5L8 3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8v9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="17" r="1.4" fill="currentColor" />
              </svg>
            }
          />
        </div>
      </section>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}

// ─── Sub-componentes da Landing ────────────────────────────────────────────

function NavPill({ to, onClick, children }) {
  const style = {
    padding: "9px 16px",
    fontSize: 14.5,
    fontWeight: 500,
    color: "#4a5261",
    background: "transparent",
    border: "none",
    borderRadius: 999,
    cursor: "pointer",
    textDecoration: "none",
    fontFamily: "inherit",
  };
  if (to) {
    return (
      <Link to={to} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} style={style}>
      {children}
    </button>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: "#0f172a",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13.5, color: "#5a6472", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

function FeatureCard({ icon, iconBg, iconColor, title, desc }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 32,
        borderRadius: 18,
        border: `1px solid ${hover ? iconColor + "40" : "#e5e9f0"}`,
        background: hover ? iconBg + "80" : "#ffffff",
        transition:
          "background 0.25s ease, border-color 0.25s ease, transform 0.15s ease",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hover
          ? `0 12px 30px -18px ${iconColor}55`
          : "0 1px 2px rgba(15,23,42,0.04)",
      }}
    >
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: 52,
          height: 52,
          borderRadius: 14,
          background: iconBg,
          color: iconColor,
          marginBottom: 44,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: "#0f172a",
          margin: "0 0 14px",
          letterSpacing: "-0.015em",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 15.5,
          lineHeight: 1.65,
          color: "#5a6472",
          margin: 0,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

function StartCard({ to, eyebrow, eyebrowColor, title, desc }) {
  return (
    <Link
      to={to}
      style={{
        padding: 24,
        borderRadius: 14,
        border: "1px solid #e5e9f0",
        textDecoration: "none",
        background: "#fff",
        display: "block",
        transition: "transform 0.15s ease, border-color 0.15s ease",
      }}
      className="hover:-translate-y-0.5"
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: eyebrowColor,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 19,
          fontWeight: 600,
          color: "#0f172a",
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 14,
          lineHeight: 1.6,
          color: "#5a6472",
        }}
      >
        {desc}
      </div>
    </Link>
  );
}

// ─── Modal de autenticação (layout split: visual + form) ──────────────────

function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const validate = () => {
    const errs = {};
    if (mode === "register" && name.trim().length < 2)
      errs.name = "Nome deve ter ao menos 2 caracteres.";
    if (!email.includes("@")) errs.email = "Informe um e-mail válido.";
    if (password.length < 8)
      errs.password = "Senha deve ter ao menos 8 caracteres.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(name, email, password);
      navigate("/inicio", { replace: true });
    } catch (err) {
      setServerError(err.message ?? "Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(23, 32, 43, 0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "auth-fade-in .18s ease-out both",
      }}
    >
      <style>{`
        @keyframes auth-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes auth-pop-in {
          from { opacity: 0; transform: scale(.96) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 720px) {
        }
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#ffffff",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 40px 90px -25px rgba(23,32,43,0.45)",
          position: "relative",
          animation: "auth-pop-in .28s cubic-bezier(.16,1,.3,1) both",
          color: "#17202b",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#f4f6f8",
            border: "none",
            color: "#5a6472",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
            zIndex: 2,
          }}
        >
          ✕
        </button>

        {/* ── Form ────────────────────────────────────────────────────── */}
        <div
          style={{
            padding: "44px 40px 38px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          <h2
            style={{
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: "-0.015em",
              margin: 0,
              marginBottom: 4,
            }}
          >
            {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
          </h2>
          <p
            style={{
              fontSize: 13.5,
              color: "#5a6472",
              margin: 0,
              marginBottom: 20,
            }}
          >
            {mode === "login"
              ? "Entre para continuar sua trilha."
              : "Comece grátis, sem cartão."}
          </p>

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {mode === "register" && (
              <AuthInput
                label="Nome"
                id="auth-name"
                value={name}
                onChange={setName}
                placeholder="Seu nome"
                error={fieldErrors.name}
                autoComplete="name"
              />
            )}
            <AuthInput
              label="E-mail"
              id="auth-email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="seu@email.com"
              error={fieldErrors.email}
              autoComplete="email"
            />
            <AuthInput
              label="Senha"
              id="auth-password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder={
                mode === "register" ? "Mínimo 8 caracteres" : "••••••••"
              }
              error={fieldErrors.password}
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
            />

            {serverError && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  fontSize: 12.5,
                  background: "rgba(234,179,8,0.10)",
                  border: "1px solid rgba(234,179,8,0.30)",
                  color: "#c93b7c",
                }}
              >
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                width: "100%",
                height: 44,
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 14.5,
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                background: loading ? "#5a6472" : "#2f6bff",
                color: "#ffffff",
                fontFamily: "inherit",
                transition: "background .15s ease",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#1c4fd6";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = "#2f6bff";
              }}
            >
              {loading
                ? "Aguarde…"
                : mode === "login"
                ? "Entrar"
                : "Criar conta"}
            </button>
          </form>

          <p
            style={{
              fontSize: 12.5,
              textAlign: "center",
              marginTop: 18,
              color: "#5a6472",
            }}
          >
            {mode === "login" ? "Ainda não tem conta? " : "Já tem uma conta? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setServerError("");
                setFieldErrors({});
              }}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                fontWeight: 700,
                color: "#17202b",
                textDecoration: "underline",
                textUnderlineOffset: 2,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 12.5,
              }}
            >
              {mode === "login" ? "Criar conta" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function AuthInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "#5a6472",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 12,
          fontSize: 14,
          outline: "none",
          background: "#ffffff",
          border: `1px solid ${error ? "#eab308" : "#e4e7ec"}`,
          color: "#17202b",
          fontFamily: "inherit",
          transition: "border-color .15s ease",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#2f6bff")}
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = error ? "#eab308" : "#e4e7ec")
        }
      />
      {error && (
        <p style={{ fontSize: 12, marginTop: 6, color: "#e34e8a" }}>{error}</p>
      )}
    </div>
  );
}
