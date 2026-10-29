import { z } from 'zod/mini'

// Formulário de login do dashboard
export const loginSchema = z.object({
  email: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, 'Digite seu e-mail.'),
      z.email('Esse e-mail não parece válido. Confira se tem @ e domínio.'),
    ),
  password: z.string().check(z.minLength(1, 'Digite a senha.')),
})

export type LoginInput = z.input<typeof loginSchema>
export type LoginCredentials = z.output<typeof loginSchema>
