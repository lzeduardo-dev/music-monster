import { z } from 'zod'

export const syncSchema = z.object({
  completedLessons: z.record(z.string(), z.number()).default({}),
  earScore: z.number().int().min(0).optional(),
  earAttempts: z.number().int().min(0).optional(),
})
