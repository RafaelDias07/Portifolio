import { z } from 'zod/mini'
import { type Repository, repositorySchema } from '@/types/github'

export const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'RafaelDias07'

// Erro de limite de acessos: tentar de novo na hora só gastaria mais uma das 60 chamadas por hora
export class GithubRateLimitError extends Error {
  constructor() {
    super('Limite de acessos à API do GitHub atingido. Tente de novo em alguns minutos.')
    this.name = 'GithubRateLimitError'
  }
}

function checkResponse(response: Response) {
  if (response.status === 403 || response.status === 429) throw new GithubRateLimitError()
  if (!response.ok) throw new Error(`O GitHub respondeu com erro ${response.status}.`)
}

// Busca os repositórios públicos do usuário, do mais recente para o mais antigo.
// Forks ficam de fora: o portfólio mostra só projetos próprios.
export async function fetchRepositories(username: string): Promise<Repository[]> {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=100`,
    { headers: { accept: 'application/vnd.github+json' } },
  )

  checkResponse(response)

  // Valida um por um: um repositório fora do formato some da lista, sem derrubar os outros
  const items = z.array(z.unknown()).parse(await response.json())
  return items.flatMap((item) => {
    const result = repositorySchema.safeParse(item)
    return result.success && !result.data.fork ? [result.data] : []
  })
}

// Busca um repositório específico (ex.: de uma organização) pelo nome completo "dono/repo"
export async function fetchRepository(fullName: string): Promise<Repository> {
  const response = await fetch(`https://api.github.com/repos/${fullName}`, {
    headers: { accept: 'application/vnd.github+json' },
  })
  checkResponse(response)
  return repositorySchema.parse(await response.json())
}
