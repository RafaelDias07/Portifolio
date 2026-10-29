import { useQuery } from '@tanstack/react-query'
import { EXTRA_REPOSITORIES, PROJECT_TEXTS, SHOWN_REPOSITORIES } from '@/content/projects'
import { fetchRepositories, fetchRepository, GITHUB_USERNAME } from '@/services/githubService'
import type { Repository } from '@/types/github'
import type { Project } from '@/types/project'

function toProject(repository: Repository): Project {
  const texts = PROJECT_TEXTS.find(
    (text) => text.repo.toLowerCase() === repository.name.toLowerCase(),
  )
  return {
    slug: repository.name,
    name: texts?.name ?? repository.name,
    icon: texts?.icon ?? '📁',
    description: texts?.description ?? repository.description,
    // Etiquetas escritas à mão; sem elas, a linguagem e os tópicos do GitHub
    tags: texts?.tags ?? [repository.language, ...repository.topics].filter((tag) => tag !== null),
    category: texts?.category ?? 'personal',
    language: repository.language,
    updatedAt: repository.pushed_at,
    stars: repository.stargazers_count,
    topics: repository.topics,
    codeUrl: repository.html_url,
    // A API devolve "" quando o repositório não tem site
    siteUrl: repository.homepage || null,
  }
}

// Meus repositórios + os de fora (EXTRA_REPOSITORIES), em paralelo. Se um extra falhar
// (apagado, virou privado), ele só some da lista; a lista principal continua aparecendo
async function fetchAllRepositories(): Promise<Repository[]> {
  const [own, extras] = await Promise.all([
    fetchRepositories(GITHUB_USERNAME),
    Promise.allSettled(EXTRA_REPOSITORIES.map(fetchRepository)),
  ])
  const found = extras.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []))
  return [...found, ...own]
}

// Fica só com os repositórios de SHOWN_REPOSITORIES, na ordem definida lá
export function buildProjects(repositories: Repository[]): Project[] {
  return SHOWN_REPOSITORIES.flatMap((name) => {
    const repository = repositories.find((repo) => repo.name.toLowerCase() === name.toLowerCase())
    return repository ? [toProject(repository)] : []
  })
}

// Uma busca por sessão (1 chamada + 1 por repositório extra): o cache vale 10 minutos
export function useProjects() {
  return useQuery({
    queryKey: ['repos', GITHUB_USERNAME],
    queryFn: fetchAllRepositories,
    select: buildProjects,
  })
}
