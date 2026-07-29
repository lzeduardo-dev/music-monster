import { z } from 'zod'

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'ai']),
        text: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(40),
  currentRoute: z.string().max(80).optional(),
  currentPageLabel: z.string().max(120).optional(),
})
