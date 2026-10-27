import { useQuery } from '@tanstack/react-query'
import { fetchRepositories, GITHUB_USERNAME } from '@/services/githubService'

// Uma chamada por sessão: o queryClient guarda o resultado por 10 minutos
export function useGithubRepos() {
  return useQuery({
    queryKey: ['repos', GITHUB_USERNAME],
    queryFn: () => fetchRepositories(GITHUB_USERNAME),
  })
}

// O detalhe usa a mesma lista em cache: abrir um projeto não faz outra chamada
export function useGithubRepo(name: string) {
  return useQuery({
    queryKey: ['repos', GITHUB_USERNAME],
    queryFn: () => fetchRepositories(GITHUB_USERNAME),
    select: (repositories) =>
      repositories.find((repository) => repository.name.toLowerCase() === name.toLowerCase()) ??
      null,
  })
}
