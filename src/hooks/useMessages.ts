import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchMessages, setMessageAnswered } from '@/services/dashboardService'

const MESSAGES_QUERY_KEY = ['messages']

// Mensagens do contato. Ao contrário dos projetos, voltar ao dashboard busca de novo:
// mensagem nova precisa aparecer sem esperar 10 minutos
export function useMessages() {
  return useQuery({ queryKey: MESSAGES_QUERY_KEY, queryFn: fetchMessages, staleTime: 0 })
}

export function useSetMessageAnswered() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, answered }: { id: string; answered: boolean }) =>
      setMessageAnswered(id, answered),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY }),
  })
}
