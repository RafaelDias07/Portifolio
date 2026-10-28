import { z } from 'zod/mini'

// Schema único do formulário de contato: o navegador valida enquanto a pessoa digita
// e a função /api/contact valida de novo no servidor (nunca confie só no front).
// Este arquivo não usa o alias "@/" porque também é importado pela função da Vercel.
export const contactSchema = z.object({
  name: z
    .string()
    .check(
      z.trim(),
      z.minLength(2, 'Digite seu nome (pelo menos 2 letras).'),
      z.maxLength(80, 'O nome pode ter no máximo 80 caracteres.'),
    ),
  email: z
    .string()
    .check(
      z.trim(),
      z.minLength(1, 'Digite seu e-mail.'),
      z.email('Esse e-mail não parece válido. Confira se tem @ e domínio.'),
      z.maxLength(254, 'O e-mail é longo demais.'),
    ),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(10, 'Escreva uma mensagem com pelo menos 10 caracteres.'),
      z.maxLength(2000, 'A mensagem pode ter no máximo 2000 caracteres.'),
    ),
  // Armadilha para robôs: campo escondido que pessoas não preenchem
  trap: z.optional(z.string()),
})

export type ContactInput = z.input<typeof contactSchema>
export type ContactMessage = z.output<typeof contactSchema>

export const MESSAGE_MAX_LENGTH = 2000
