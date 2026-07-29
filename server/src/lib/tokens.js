import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET
const expiry = process.env.JWT_EXPIRY || '7d'

if (!secret || secret === 'change-me-to-a-strong-random-secret-in-production') {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production.')
  }
  console.warn('[tokens] Using default JWT secret. Set JWT_SECRET in .env for production.')
}

export function signToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: expiry, algorithm: 'HS256' })
}

export function verifyToken(token) {
  return jwt.verify(token, secret, { algorithms: ['HS256'] })
}
