import { z } from 'zod/mini'

// Formato dos repositórios que usamos da API do GitHub. O Zod valida a resposta:
// se a API mudar, o erro aparece aqui, e não como "undefined" no meio da tela.
// Os nomes em snake_case vêm da própria API.
export const repositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.nullable(z.string()),
  language: z.nullable(z.string()),
  html_url: z.url(),
  homepage: z.nullable(z.string()),
  stargazers_count: z.number(),
  topics: z._default(z.array(z.string()), []),
  fork: z.boolean(),
  pushed_at: z.string(),
})

export type Repository = z.infer<typeof repositorySchema>
