import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount: pergunta ao backend se o cookie de sessão é válido.
  useEffect(() => {
    api
      .get('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),

      async login(email, password) {
        const data = await api.post('/auth/login', { email, password })
        setUser(data.user)
        return data.user
      },

      async register(name, email, password) {
        const data = await api.post('/auth/register', { name, email, password })
        setUser(data.user)
        return data.user
      },

      async loginWithGoogle(credential) {
        const data = await api.post('/auth/google', { credential })
        setUser(data.user)
        return data.user
      },

      async logout() {
        try {
          await api.post('/auth/logout')
        } catch {
          // Ignora — vamos limpar estado local de qualquer forma
        }
        setUser(null)
      },

      // Sync local progress state to server (best-effort, non-blocking)
      async syncProgress(progress) {
        if (!user) return
        try {
          await api.post('/progress/sync', {
            completedLessons: progress.completedLessons,
            earScore: progress.ear.score,
            earAttempts: progress.ear.attempts,
          })
        } catch {
          // Silently fail — local state is source of truth for MVP
        }
      },

      // Fetch server progress (called after login to merge remote state)
      async fetchProgress() {
        if (!user) return null
        try {
          return await api.get('/progress')
        } catch {
          return null
        }
      },
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
