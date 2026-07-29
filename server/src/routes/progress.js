import { Router } from 'express'
import { db } from '../db/index.js'
import { authenticate } from '../middleware/authenticate.js'
import { validate } from '../middleware/validate.js'
import { syncSchema } from '../schemas/progress.js'

const router = Router()

// All progress routes require authentication
router.use(authenticate)

// GET /api/progress
router.get('/', async (req, res, next) => {
  try {
    await db.read()
    const entries = db.data.progress.filter((p) => p.userId === req.user.sub)

    const completedLessons = {}
    let earScore = 0
    let earAttempts = 0

    for (const entry of entries) {
      if (entry.type === 'lesson') {
        completedLessons[entry.key] = entry.completedAt
      } else if (entry.type === 'ear') {
        earScore = entry.score ?? 0
        earAttempts = entry.attempts ?? 0
      }
    }

    res.json({ completedLessons, earScore, earAttempts })
  } catch (err) {
    next(err)
  }
})

// POST /api/progress/sync — merge client state into server (client is source of truth)
router.post('/sync', validate(syncSchema), async (req, res, next) => {
  try {
    const { completedLessons, earScore, earAttempts } = req.validated
    await db.read()

    const userId = req.user.sub

    // Upsert each completed lesson
    for (const [key, ts] of Object.entries(completedLessons)) {
      const exists = db.data.progress.find(
        (p) => p.userId === userId && p.type === 'lesson' && p.key === key
      )
      if (!exists) {
        db.data.progress.push({ userId, type: 'lesson', key, completedAt: ts })
      }
    }

    // Upsert ear training stats (last-write wins)
    if (earAttempts !== undefined) {
      const earEntry = db.data.progress.find((p) => p.userId === userId && p.type === 'ear')
      if (earEntry) {
        earEntry.score = earScore ?? earEntry.score
        earEntry.attempts = earAttempts
      } else {
        db.data.progress.push({ userId, type: 'ear', score: earScore ?? 0, attempts: earAttempts })
      }
    }

    await db.write()
    res.json({ ok: true, syncedAt: Date.now() })
  } catch (err) {
    next(err)
  }
})

export default router
