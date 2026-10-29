// Uma linha da tabela portfolio.messages, como o Supabase devolve
// (os nomes das colunas ficam em snake_case, iguais ao banco)
export type Message = {
  id: string
  name: string
  email: string
  message: string
  answered: boolean
  created_at: string
}
