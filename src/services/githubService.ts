import { z } from 'zod/mini'
import { type Repository, repositorySchema } from '@/types/github'

export const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'RafaelDias07'

// Busca os repositórios públicos do usuário, do mais recente para o mais antigo.
// Forks ficam de fora: o portfólio mostra só projetos próprios.
export async function fetchRepositories(username: string): Promise<Repository[]> {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=100`,
    { headers: { accept: 'application/vnd.github+json' } },
  )

  if (response.status === 403 || response.status === 429) {
    throw new Error('Limite de acessos à API do GitHub atingido. Tente de novo em alguns minutos.')
  }
  if (!response.ok) throw new Error(`O GitHub respondeu com erro ${response.status}.`)

  const repositories = z.array(repositorySchema).parse(await response.json())
  return repositories.filter((repository) => !repository.fork)
}

// Busca um repositório específico (ex.: de uma organização) pelo nome completo "dono/repo"
export async function fetchRepository(fullName: string): Promise<Repository> {
  const response = await fetch(`https://api.github.com/repos/${fullName}`, {
    headers: { accept: 'application/vnd.github+json' },
  })
  if (!response.ok) throw new Error(`O GitHub respondeu com erro ${response.status}.`)
  return repositorySchema.parse(await response.json())
}
