import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center" style={{ background: 'var(--bg-body)' }}>
        <div className="flex flex-col items-center gap-4">
          <LogoMark size={48} />
          <div className="text-sm" style={{ color: 'var(--text-subtle)' }}>Verificando sessão...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Landing abre o modal automaticamente quando detecta state.from.
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}

function LogoMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="9" fill="url(#lg-priv)"/>
      <defs>
        <linearGradient id="lg-priv" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa"/>
          <stop offset="100%" stopColor="#1d4ed8"/>
        </linearGradient>
      </defs>
      <rect x="7"  y="16" width="4" height="13" rx="2" fill="white" opacity="0.95"/>
      <rect x="14" y="10" width="4" height="19" rx="2" fill="white" opacity="0.95"/>
      <rect x="21" y="13" width="4" height="16" rx="2" fill="white" opacity="0.95"/>
      <rect x="28" y="19" width="4" height="10" rx="2" fill="white" opacity="0.95"/>
    </svg>
  )
}
