import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext.jsx";
import { LogoMark, MusicMonsterWordmark } from "../components/Layout.jsx";

// ─── Preview panel (mock do produto) ───────────────────────────────────────

function ProductPreview() {
  return (
    <div
      style={{
        position: "relative",
        width: "min(1000px, 92vw)",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 40px 90px -30px rgba(23,32,43,0.35)",
        border: "1px solid #1c2432",
        background: "#0e131c",
        textAlign: "left",
      }}
    >
      {/* Body: split */}
      <div style={{ display: "flex" }}>
        {/* Left: flowchart mock */}
        <div style={{ flex: 1.2, background: "#0e131c", padding: "22px 26px" }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 18,
              fontSize: 12.5,
              fontWeight: 700,
              color: "#7c8798",
            }}
          >
            <span style={{ color: "#8fb0ff" }}>Comece aqui</span>
            <span>Trilha</span>
            <span>Speedrun</span>
            <span>Modelos</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Diamond 1 */}
            <div
              style={{
                background: "#f5c344",
                color: "#17202b",
                fontWeight: 700,
                fontSize: 12.5,
                padding: "10px 14px",
                borderRadius: 8,
                transform: "rotate(45deg)",
                width: 90,
                textAlign: "center",
              }}
            >
              <span style={{ display: "block", transform: "rotate(-45deg)" }}>
                Ciclo das Quintas?
              </span>
            </div>
            <div style={{ height: 16, width: 2, background: "#33405a" }} />
            {/* Row: box + diamond */}
            <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
              <div
                style={{
                  background: "#7c8ff0",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12.5,
                  padding: "9px 14px",
                  borderRadius: 8,
                }}
              >
                Harmonia
              </div>
              <div
                style={{
                  background: "#f5c344",
                  color: "#17202b",
                  fontWeight: 700,
                  fontSize: 12.5,
                  padding: "10px 14px",
                  borderRadius: 8,
                  transform: "rotate(45deg)",
                  width: 90,
                  textAlign: "center",
                }}
              >
                <span style={{ display: "block", transform: "rotate(-45deg)" }}>
                  É tonal?
                </span>
              </div>
            </div>
            <div style={{ height: 16, width: 2, background: "#33405a" }} />
            <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
              <div
                style={{
                  background: "#7c8ff0",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12.5,
                  padding: "9px 14px",
                  borderRadius: 8,
                }}
              >
                CAGED
              </div>
              <div
                style={{
                  background: "#7c8ff0",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12.5,
                  padding: "9px 14px",
                  borderRadius: 8,
                }}
              >
                Blues
              </div>
            </div>
          </div>
        </div>

        {/* Right: Q&A block */}
        <div style={{ flex: 1, background: "#fff", padding: "26px 28px" }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 16,
              color: "#17202b",
              marginBottom: 10,
            }}
          >
            O que é isso?
          </div>
          <div
            style={{
              fontSize: 13.5,
              lineHeight: 1.6,
              color: "#4a525e",
              marginBottom: 18,
            }}
          >
            A trilha MusicMonster foi criada por músicos e educadores, a partir
            da análise de milhares de músicas para identificar os padrões comuns
            de harmonia e técnica.
          </div>
          <div
            style={{
              fontWeight: 800,
              fontSize: 16,
              color: "#17202b",
              marginBottom: 10,
            }}
          >
            Como usar?
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "#4a525e" }}>
            Os nós internos são decisões sobre a música; as caixas roxas são as
            técnicas necessárias. Percorra a árvore da raiz até a folha para
            descobrir o que estudar.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Landing page ──────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate();

  const [visible, setVisible] = useState({
    headline: false,
    sub: false,
    buttons: false,
    shot: false,
  });
  const [authOpen, setAuthOpen] = useState(false);

  const refs = useRef({});
  const setRef = (key) => (el) => {
    refs.current[key] = el;
  };

  // Reveal com IntersectionObserver + reveal imediato pra quem já está na tela
  useEffect(() => {
    const vh = window.innerHeight;
    const initially = {};
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const key = entry.target.dataset.revealKey;
            setVisible((v) => ({ ...v, [key]: true }));
          }
        });
      },
      { threshold: 0.15 }
    );

    const raf = requestAnimationFrame(() => {
      Object.entries(refs.current).forEach(([key, el]) => {
        if (!el) return;
        el.dataset.revealKey = key;
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.9 && rect.bottom > 0) {
          initially[key] = true;
        } else {
          observer.observe(el);
        }
      });
      if (Object.keys(initially).length) {
        setVisible((v) => ({ ...v, ...initially }));
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  const reveal = (isVisible, distance = 26) => ({
    opacity: isVisible ? 1 : 0,
    transform: `translateY(${isVisible ? 0 : distance}px)`,
  });

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#ffffff",
        backgroundImage:
          "linear-gradient(#eef0f3 1px, transparent 1px), linear-gradient(90deg, #eef0f3 1px, transparent 1px)",
        backgroundSize: "46px 46px",
        overflow: "hidden",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <header
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "26px clamp(20px, 5vw, 64px)",
          background: "#ffffff",
          zIndex: 2,
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
        <button
          onClick={() => setAuthOpen(true)}
          style={{
            fontWeight: 700,
            fontSize: 16,
            color: "#17202b",
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Entrar
        </button>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <main
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "70px 24px 0",
          zIndex: 1,
        }}
      >
        <h1
          ref={setRef("headline")}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(36px, 6.2vw, 56px)",
            lineHeight: 1.12,
            color: "#17202b",
            margin: 0,
            maxWidth: 780,
            letterSpacing: "-0.02em",
            ...reveal(visible.headline),
            transition:
              "opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)",
          }}
        >
          A forma mais{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #2f6bff, #12b8a6)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            estruturada
          </span>
          <br />
          de aprender música de verdade
        </h1>

        <p
          ref={setRef("sub")}
          style={{
            fontSize: 19,
            lineHeight: 1.6,
            color: "#5a6472",
            maxWidth: 620,
            margin: "26px 0 40px",
            ...reveal(visible.sub),
            transition:
              "opacity .8s cubic-bezier(.16,1,.3,1) .1s, transform .8s cubic-bezier(.16,1,.3,1) .1s",
          }}
        >
          Domine teoria, harmonia e o braço do violão com uma trilha completa —
          e ganhe o conhecimento sistemático para tocar qualquer música.
        </p>

        <div
          ref={setRef("buttons")}
          style={{
            display: "flex",
            gap: 14,
            marginBottom: 56,
            flexWrap: "wrap",
            justifyContent: "center",
            ...reveal(visible.buttons),
            transition:
              "opacity .8s cubic-bezier(.16,1,.3,1) .2s, transform .8s cubic-bezier(.16,1,.3,1) .2s",
          }}
        >
          <button
            onClick={() => navigate("/fundamentos")}
            style={{
              background: "#2f6bff",
              color: "#fff",
              border: "none",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 16,
              padding: "16px 28px",
              borderRadius: 14,
              cursor: "pointer",
              transition: "background .2s ease, transform .1s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1c4fd6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2f6bff")}
          >
            Começar pelos Fundamentos →
          </button>
          <button
            onClick={() => navigate("/roadmap")}
            style={{
              background: "#fff",
              color: "#17202b",
              border: "1.5px solid #e4e7ec",
              fontFamily: "inherit",
              fontWeight: 700,
              fontSize: 16,
              padding: "16px 26px",
              borderRadius: 14,
              cursor: "pointer",
              transition: "border-color .2s ease, background .2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#17202b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e4e7ec";
            }}
          >
            Ver a Trilha
          </button>
        </div>

        <div style={{ height: 90 }} />
      </main>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}

// ─── Modal de autenticação (layout split: visual + form) ──────────────────

function AuthModal({ onClose }) {
  const { login, register, loginWithGoogle } = useAuth();
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

  const handleGoogleSuccess = async (credentialResponse) => {
    setServerError("");
    setLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate("/inicio", { replace: true });
    } catch (err) {
      setServerError(err.message ?? "Erro ao entrar com o Google.");
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
          .auth-modal-grid {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
          }
          .auth-modal-visual { display: none !important; }
          .auth-modal-form { padding: 40px 28px !important; }
        }
      `}</style>
      <div
        className="auth-modal-grid"
        style={{
          width: "100%",
          maxWidth: 820,
          minHeight: 520,
          background: "#ffffff",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 40px 90px -25px rgba(23,32,43,0.45)",
          position: "relative",
          animation: "auth-pop-in .28s cubic-bezier(.16,1,.3,1) both",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: "#17202b",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
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
            background: "rgba(255,255,255,0.14)",
            border: "1px solid rgba(255,255,255,0.20)",
            color: "#ffffff",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
            zIndex: 2,
          }}
        >
          ✕
        </button>

        {/* ── Painel esquerdo (visual) ────────────────────────────────── */}
        <div
          className="auth-modal-visual"
          style={{
            background:
              "linear-gradient(150deg, #0e131c 0%, #12213b 60%, #1c2f5c 100%)",
            color: "#ffffff",
            padding: "44px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Orb de fundo */}

          <div style={{ position: "relative" }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 30,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                margin: 0,
                marginBottom: 12,
              }}
            >
              A forma mais{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #7ba4ff, #12b8a6)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                estruturada
              </span>{" "}
              de aprender música.
            </h3>
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.65,
                color: "#c6d1e0",
                margin: 0,
                maxWidth: 300,
              }}
            >
              Teoria, harmonia e braço do violão numa trilha completa — feita
              por músicos e educadores.
            </p>
          </div>

          <div style={{ position: "relative", display: "flex", gap: 18 }}>
            {[
              { label: "Trilhas", v: "20+" },
              { label: "Módulos", v: "70+" },
              { label: "Ferramentas", v: "5" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: 22,
                    color: "#ffffff",
                  }}
                >
                  {s.v}
                </div>
                <div style={{ fontSize: 11.5, color: "#8ea1bd", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Painel direito (form) ───────────────────────────────────── */}
        <div
          className="auth-modal-form"
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
              fontFamily: "'Space Grotesk', sans-serif",
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

          {/* Google */}
          <div style={{ marginBottom: 16 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                setServerError("Falha ao autenticar com o Google.")
              }
              text={mode === "login" ? "signin_with" : "signup_with"}
              shape="pill"
              locale="pt_BR"
              width="100%"
            />
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "10px 0 16px",
              color: "#a8afba",
              fontSize: 11.5,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#e4e7ec" }} />
            ou com e-mail
            <div style={{ flex: 1, height: 1, background: "#e4e7ec" }} />
          </div>

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
                  background: "rgba(244,114,182,0.10)",
                  border: "1px solid rgba(244,114,182,0.30)",
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
          border: `1px solid ${error ? "#f472b6" : "#e4e7ec"}`,
          color: "#17202b",
          fontFamily: "inherit",
          transition: "border-color .15s ease",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "#2f6bff")}
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = error ? "#f472b6" : "#e4e7ec")
        }
      />
      {error && (
        <p style={{ fontSize: 12, marginTop: 6, color: "#e34e8a" }}>{error}</p>
      )}
    </div>
  );
}
