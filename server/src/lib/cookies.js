// Centraliza nome do cookie de sessão + opções.
// httpOnly → JS do browser não lê (mitiga XSS)
// secure   → só via HTTPS em prod
// sameSite → 'strict' bloqueia envio em navegações cross-site (mitiga CSRF)

export const SESSION_COOKIE = 'mm_session'

export function sessionCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProd, // exige HTTPS em prod
    sameSite: 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias, alinhado ao JWT_EXPIRY default
  }
}
