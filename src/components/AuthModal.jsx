import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthModal({ onClose, initialMode = "login" }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
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

    if (mode === "register") {
      // No cadastro: exige força completa.
      if (password.length < 8)
        errs.password = "Senha deve ter ao menos 8 caracteres.";
      else if (!/[A-Z]/.test(password))
        errs.password = "Senha deve ter ao menos uma letra maiúscula.";
      else if (!/[^A-Za-z0-9]/.test(password))
        errs.password = "Senha deve ter ao menos um caractere especial.";

      if (!passwordConfirm)
        errs.passwordConfirm = "Confirme sua senha.";
      else if (password !== passwordConfirm)
        errs.passwordConfirm = "As senhas não conferem.";
    } else {
      // No login: só exige preenchido (a validação real é no back).
      if (!password) errs.password = "Senha é obrigatória.";
    }
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
            {mode === "register" && !fieldErrors.password && (
              <div
                style={{
                  fontSize: 11.5,
                  color: "#6b7482",
                  marginTop: -4,
                  lineHeight: 1.4,
                }}
              >
                Ao menos 8 caracteres, com uma letra maiúscula e um caractere
                especial (ex: <b>!@#$?%</b>).
              </div>
            )}

            {mode === "register" && (
              <AuthInput
                label="Confirmar senha"
                id="auth-password-confirm"
                type="password"
                value={passwordConfirm}
                onChange={setPasswordConfirm}
                placeholder="Repita a senha"
                error={fieldErrors.passwordConfirm}
                autoComplete="new-password"
              />
            )}

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
                setPasswordConfirm("");
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
