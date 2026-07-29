import { verifyToken } from '../lib/tokens.js'
import { SESSION_COOKIE } from '../lib/cookies.js'

// Prioriza cookie httpOnly. Bearer fica só como fallback pra testes/curl.
export function authenticate(req, res, next) {
  const cookieToken = req.cookies?.[SESSION_COOKIE]
  const authHeader = req.headers['authorization']
  const bearerToken = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null

  const token = cookieToken || bearerToken
  if (!token) {
    return res
      .status(401)
      .json({ error: 'Sessão não encontrada. Faça login novamente.' })
  }

  try {
    req.user = verifyToken(token)
    next()
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Sessão expirada. Faça login novamente.'
        : 'Token inválido.'
    return res.status(401).json({ error: message })
  }
}
