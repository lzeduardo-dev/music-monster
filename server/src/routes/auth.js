import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import { db } from '../db/index.js'
import { signToken } from '../lib/tokens.js'
import { SESSION_COOKIE, sessionCookieOptions } from '../lib/cookies.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/authenticate.js'
import { registerSchema, loginSchema, googleSchema } from '../schemas/auth.js'

const BCRYPT_ROUNDS = 12
const router = Router()

// Sempre passe pelo `safeUser` antes de mandar pra fora.
function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}

function issueSession(res, user) {
  const token = signToken({ sub: user.id, email: user.email, name: user.name })
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions())
}

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.validated
    await db.read()

    if (db.data.users.find((u) => u.email === email)) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' })
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)
    const user = {
      id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name,
      email,
      passwordHash,
      createdAt: Date.now(),
    }
    db.data.users.push(user)
    await db.write()

    issueSession(res, user)
    res.status(201).json({ user: safeUser(user) })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.validated
    await db.read()

    const user = db.data.users.find((u) => u.email === email)

    // Constant-time comparison mesmo quando o usuário não existe (evita
    // enumeração de e-mails por timing).
    const hashToCompare =
      user?.passwordHash ??
      '$2b$12$invalidhashpadding000000000000000000000000000000000000'
    const match = await bcrypt.compare(password, hashToCompare)

    if (!user || !match) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' })
    }

    issueSession(res, user)
    res.json({ user: safeUser(user) })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/logout — encerra sessão do lado do servidor
router.post('/logout', (req, res) => {
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions())
  res.json({ ok: true })
})

// POST /api/auth/google — verifica ID token do Google e loga/cria usuário
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const googleClient = GOOGLE_CLIENT_ID
  ? new OAuth2Client(GOOGLE_CLIENT_ID)
  : null

if (!GOOGLE_CLIENT_ID) {
  console.warn(
    '[auth] GOOGLE_CLIENT_ID ausente — POST /api/auth/google vai retornar 503.'
  )
}

router.post('/google', validate(googleSchema), async (req, res, next) => {
  try {
    if (!googleClient) {
      return res
        .status(503)
        .json({ error: 'Login com Google não está configurado.' })
    }

    const { credential } = req.validated

    // Verifica assinatura + expiração + audience.
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload?.email || !payload.email_verified) {
      return res
        .status(401)
        .json({ error: 'E-mail do Google não verificado.' })
    }

    const email = payload.email.toLowerCase().trim()
    const name = payload.name?.trim() || email.split('@')[0]

    await db.read()
    let user = db.data.users.find((u) => u.email === email)

    if (!user) {
      // Cria conta ligada ao Google. Sem senha local.
      user = {
        id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name,
        email,
        passwordHash: null, // usuário Google não tem senha local
        googleId: payload.sub,
        createdAt: Date.now(),
      }
      db.data.users.push(user)
      await db.write()
    } else if (!user.googleId) {
      // Vincula conta existente ao Google
      user.googleId = payload.sub
      await db.write()
    }

    issueSession(res, user)
    res.json({ user: safeUser(user) })
  } catch (err) {
    console.error('[auth] google login error:', err?.message || err)
    return res
      .status(401)
      .json({ error: 'Não foi possível validar o login com Google.' })
  }
})

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user })
})

export default router
