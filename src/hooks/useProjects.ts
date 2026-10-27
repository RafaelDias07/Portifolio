import { useQuery } from '@tanstack/react-query'
import { FEATURED_SLUGS, MANUAL_PROJECTS, PROJECT_TEXTS } from '@/content/projects'
import { fetchRepositories, GITHUB_USERNAME } from '@/services/githubService'
import type { Repository } from '@/types/github'
import type { Project } from '@/types/project'

function toProject(repository: Repository): Project {
  const texts = PROJECT_TEXTS[repository.name]
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
    note: null,
  }
}

// Destaques primeiro, na ordem de FEATURED_SLUGS; o resto mantém a ordem da API (mais recente)
function featuredRank(project: Project) {
  const index = FEATURED_SLUGS.findIndex(
    (slug) => slug.toLowerCase() === project.slug.toLowerCase(),
  )
  return index === -1 ? FEATURED_SLUGS.length : index
}

export function buildProjects(repositories: Repository[]): Project[] {
  const projects = [...MANUAL_PROJECTS, ...repositories.map(toProject)]
  return projects
    .map((project, order) => ({ project, order }))
    .sort((a, b) => featuredRank(a.project) - featuredRank(b.project) || a.order - b.order)
    .map(({ project }) => project)
}

// Uma chamada ao GitHub por sessão: o queryClient guarda o resultado por 10 minutos
export function useProjects() {
  return useQuery({
    queryKey: ['repos', GITHUB_USERNAME],
    queryFn: () => fetchRepositories(GITHUB_USERNAME),
    select: buildProjects,
  })
}

// O detalhe usa a mesma lista em cache: abrir um projeto não faz outra chamada
export function useProject(slug: string) {
  return useQuery({
    queryKey: ['repos', GITHUB_USERNAME],
    queryFn: () => fetchRepositories(GITHUB_USERNAME),
    select: (repositories) =>
      buildProjects(repositories).find(
        (project) => project.slug.toLowerCase() === slug.toLowerCase(),
      ) ?? null,
  })
}
