import { useQuery } from '@tanstack/react-query'
import { fetchFeaturedRepoNames } from '@/services/featuredService'

export const FEATURED_QUERY_KEY = ['featured-projects']

// Repositórios em destaque escolhidos no dashboard, na ordem escolhida
export function useFeaturedProjects() {
  return useQuery({ queryKey: FEATURED_QUERY_KEY, queryFn: fetchFeaturedRepoNames })
}
