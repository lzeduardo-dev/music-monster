import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// ─── Logo MusicMonster (fones oficiais — 78×62 viewBox) ────────────────────

function LogoMark({ height = 26 }) {
  const width = Math.round(height * (78 / 62))
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 78 62"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block', flex: 'none' }}
    >
      <path
        d="M9 47C9 25 24 11 39 11s30 14 30 36"
        stroke="#17202b"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="9" cy="50" r="9" fill="#17202b" />
      <circle cx="69" cy="50" r="9" fill="#17202b" />
    </svg>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────

function InputField({
  label,
  id,
  type = 'text',
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
          display: 'block',
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: '#5a6472',
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
          width: '100%',
          padding: '12px 14px',
          borderRadius: 12,
          fontSize: 14,
          outline: 'none',
          background: '#ffffff',
          border: `1px solid ${error ? '#f472b6' : '#e4e7ec'}`,
          color: '#17202b',
          fontFamily: 'inherit',
          transition: 'border-color .15s ease',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#2f6bff')}
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = error ? '#f472b6' : '#e4e7ec')
        }
      />
      {error && (
        <p style={{ fontSize: 12, marginTop: 6, color: '#e34e8a' }}>{error}</p>
      )}
    </div>
  )
}

// ─── Login page ────────────────────────────────────────────────────────────

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/inicio'

  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (mode === 'register' && name.trim().length < 2)
      errs.name = 'Nome deve ter ao menos 2 caracteres.'
    if (!email.includes('@')) errs.email = 'Informe um e-mail válido.'
    if (password.length < 8)
      errs.password = 'Senha deve ter ao menos 8 caracteres.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    const errs = validate()
    if (Object.keys(errs).length) {
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})
    setLoading(true)
    try {
      if (mode === 'login') await login(email, password)
      else await register(name, email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setServerError(err.message ?? 'Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: '#17202b',
      }}
    >
      {/* Top bar — só logo + link pra Landing */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '26px clamp(20px, 5vw, 64px)',
          background: '#ffffff',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: '#17202b',
          }}
        >
          <LogoMark height={26} />
          <span style={{ fontWeight: 800, fontSize: 22 }}>MusicMonster</span>
        </Link>
      </header>

      {/* Formulário centralizado */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 20px 80px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            background: '#ffffff',
            border: '1px solid #e4e7ec',
            borderRadius: 18,
            padding: 32,
            boxShadow: '0 20px 60px -30px rgba(23,32,43,0.20)',
          }}
        >
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: '-0.015em',
              margin: 0,
              marginBottom: 6,
            }}
          >
            {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h1>
          <p style={{ fontSize: 14, color: '#5a6472', margin: 0, marginBottom: 22 }}>
            {mode === 'login'
              ? 'Acesse sua trilha de aprendizado.'
              : 'Comece sua jornada musical agora.'}
          </p>

          {/* Toggle */}
          <div
            style={{
              display: 'flex',
              padding: 4,
              borderRadius: 12,
              background: '#f4f6f8',
              border: '1px solid #e4e7ec',
              marginBottom: 22,
            }}
          >
            {[
              ['login', 'Entrar'],
              ['register', 'Criar conta'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setMode(key)
                  setServerError('')
                  setFieldErrors({})
                }}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: mode === key ? '#17202b' : 'transparent',
                  color: mode === key ? '#ffffff' : '#5a6472',
                  fontFamily: 'inherit',
                  transition: 'background .15s ease, color .15s ease',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {mode === 'register' && (
              <InputField
                label="Nome"
                id="name"
                value={name}
                onChange={setName}
                placeholder="Seu nome"
                error={fieldErrors.name}
                autoComplete="name"
              />
            )}
            <InputField
              label="E-mail"
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="seu@email.com"
              error={fieldErrors.email}
              autoComplete="email"
            />
            <InputField
              label="Senha"
              id="password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder={
                mode === 'register' ? 'Mínimo 8 caracteres' : '••••••••'
              }
              error={fieldErrors.password}
              autoComplete={
                mode === 'register' ? 'new-password' : 'current-password'
              }
            />

            {serverError && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  fontSize: 13,
                  background: 'rgba(244,114,182,0.10)',
                  border: '1px solid rgba(244,114,182,0.30)',
                  color: '#c93b7c',
                }}
              >
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                width: '100%',
                height: 46,
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#5a6472' : '#2f6bff',
                color: '#ffffff',
                fontFamily: 'inherit',
                transition: 'background .15s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = '#1c4fd6'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = '#2f6bff'
              }}
            >
              {loading
                ? 'Aguarde…'
                : mode === 'login'
                ? 'Entrar'
                : 'Criar conta'}
            </button>
          </form>

          <p
            style={{
              fontSize: 12.5,
              textAlign: 'center',
              marginTop: 20,
              color: '#5a6472',
            }}
          >
            {mode === 'login' ? 'Ainda não tem conta? ' : 'Já tem uma conta? '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setServerError('')
                setFieldErrors({})
              }}
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                fontWeight: 700,
                color: '#17202b',
                textDecoration: 'underline',
                textUnderlineOffset: 2,
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 12.5,
              }}
            >
              {mode === 'login' ? 'Criar conta' : 'Entrar'}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}
