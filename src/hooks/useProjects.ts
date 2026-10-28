import { useQuery } from '@tanstack/react-query'
import { EXTRA_REPOSITORIES, FEATURED_SLUGS, PROJECT_TEXTS } from '@/content/projects'
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
    description: texts?.description ?? repository.description,
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

// Destaques primeiro, na ordem de FEATURED_SLUGS; o resto mantém a ordem da API (mais recente)
function featuredRank(project: Project) {
  const index = FEATURED_SLUGS.findIndex(
    (slug) => slug.toLowerCase() === project.slug.toLowerCase(),
  )
  return index === -1 ? FEATURED_SLUGS.length : index
}

export function buildProjects(repositories: Repository[]): Project[] {
  return repositories
    .map(toProject)
    .map((project, order) => ({ project, order }))
    .sort((a, b) => featuredRank(a.project) - featuredRank(b.project) || a.order - b.order)
    .map(({ project }) => project)
}

// Uma busca por sessão (1 chamada + 1 por repositório extra): o cache vale 10 minutos
export function useProjects() {
  return useQuery({
    queryKey: ['repos', GITHUB_USERNAME],
    queryFn: fetchAllRepositories,
    select: buildProjects,
  })
}

// O detalhe usa a mesma lista em cache: abrir um projeto não faz outra chamada
export function useProject(slug: string) {
  return useQuery({
    queryKey: ['repos', GITHUB_USERNAME],
    queryFn: fetchAllRepositories,
    select: (repositories) =>
      buildProjects(repositories).find(
        (project) => project.slug.toLowerCase() === slug.toLowerCase(),
      ) ?? null,
  })
}
