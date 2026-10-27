import { QueryClient } from '@tanstack/react-query'

// Padrões de cache para o site inteiro. A API do GitHub permite 60 requisições por hora
// sem login, então o resultado vale por 10 minutos e não é refeito ao focar a janela.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
