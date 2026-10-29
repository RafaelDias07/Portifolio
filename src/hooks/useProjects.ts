import { useQuery } from '@tanstack/react-query'
import { EXTRA_REPOSITORIES, PROJECT_TEXTS, SHOWN_REPOSITORIES } from '@/content/projects'
import { useFeaturedProjects } from '@/hooks/useFeaturedProjects'
import { fetchRepositories, fetchRepository, GITHUB_USERNAME } from '@/services/githubService'
import type { Repository } from '@/types/github'
import type { Project } from '@/types/project'

function toProject(repository: Repository, featured: boolean): Project {
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
    featured,
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

function sameName(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase()
}

// Fica só com os repositórios de SHOWN_REPOSITORIES, na ordem definida lá.
// Os destaques do dashboard (featured) vão para o começo, na ordem escolhida
export function buildProjects(repositories: Repository[], featured: string[] = []): Project[] {
  const projects = SHOWN_REPOSITORIES.flatMap((name) => {
    const repository = repositories.find((repo) => sameName(repo.name, name))
    if (!repository) return []
    return [
      toProject(
        repository,
        featured.some((repo) => sameName(repo, name)),
      ),
    ]
  })

  const rank = (project: Project) => {
    const position = featured.findIndex((repo) => sameName(repo, project.slug))
    return position === -1 ? featured.length : position
  }
  // O sort é estável: quem não é destaque mantém a ordem de SHOWN_REPOSITORIES
  return projects.sort((a, b) => rank(a) - rank(b))
}

// Uma busca por sessão (1 chamada + 1 por repositório extra): o cache vale 10 minutos.
// Os destaques vêm do Supabase numa busca à parte; se ela falhar, a lista aparece sem eles
export function useProjects() {
  const { data: featured = [] } = useFeaturedProjects()
  return useQuery({
    queryKey: ['repos', GITHUB_USERNAME],
    queryFn: fetchAllRepositories,
    select: (repositories) => buildProjects(repositories, featured),
  })
}

// O detalhe usa a mesma lista em cache: abrir um projeto não faz outra chamada
export function useProject(slug: string) {
  return useQuery({
    queryKey: ['repos', GITHUB_USERNAME],
    queryFn: fetchAllRepositories,
    select: (repositories) =>
      buildProjects(repositories).find((project) => sameName(project.slug, slug)) ?? null,
  })
}
