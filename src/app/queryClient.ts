import { QueryClient } from '@tanstack/react-query'
import { GithubRateLimitError } from '@/services/githubService'

// Padrões de cache para o site inteiro. A API do GitHub permite 60 requisições por hora
// sem login, então o resultado vale por 10 minutos e não é refeito ao focar a janela.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      // Uma nova tentativa em falhas passageiras, mas nunca quando o limite do GitHub estourou
      retry: (failures, error) => failures < 1 && !(error instanceof GithubRateLimitError),
    },
  },
})
