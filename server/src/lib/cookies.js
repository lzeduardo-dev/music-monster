// Centraliza nome do cookie de sessão + opções.
// httpOnly → JS do browser não lê (mitiga XSS)
// secure   → só via HTTPS em prod
// sameSite → em dev usamos 'strict' (front + back mesma origem via proxy Vite).
//            Em prod o front (Vercel) e o back (Railway) ficam em domínios
//            diferentes; browsers descartam cookies cross-site que não sejam
//            'none' + 'secure'. Usamos 'none' explicitamente pra permitir isso.

export const SESSION_COOKIE = 'mm_session'

export function sessionCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'strict',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias, alinhado ao JWT_EXPIRY default
  }
}
