import { z } from 'zod'

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório.' })
    .min(2, 'Nome deve ter ao menos 2 caracteres.')
    .max(80, 'Nome muito longo.')
    .trim(),
  email: z
    .string({ required_error: 'E-mail é obrigatório.' })
    .email('E-mail inválido.')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Senha é obrigatória.' })
    .min(8, 'Senha deve ter ao menos 8 caracteres.')
    .max(100, 'Senha muito longa.'),
})

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'E-mail é obrigatório.' })
    .email('E-mail inválido.')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Senha é obrigatória.' })
    .min(1, 'Senha é obrigatória.'),
})

// ID token retornado pelo Google Identity Services (JWT).
export const googleSchema = z.object({
  credential: z
    .string({ required_error: 'credential é obrigatório.' })
    .min(20)
    .max(4000),
})
