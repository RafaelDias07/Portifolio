import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FEATURED_QUERY_KEY } from '@/hooks/useFeaturedProjects'
import { saveFeaturedProjects } from '@/services/dashboardService'

// Fica separado do useFeaturedProjects: ele usa o supabase-js, que só o dashboard baixa
export function useSaveFeaturedProjects() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveFeaturedProjects,
    // A lista pública (início e /projetos) passa a mostrar os destaques novos na hora
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FEATURED_QUERY_KEY }),
  })
}
