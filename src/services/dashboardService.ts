import { getSupabase } from '@/services/supabaseClient'
import type { Message } from '@/types/message'

// Funções do dashboard. Todas exigem o dono logado: sem isso, as regras de acesso
// (RLS) do Supabase devolvem uma lista vazia ou recusam a alteração.

export async function fetchMessages(): Promise<Message[]> {
  const { data, error } = await getSupabase()
    .from('messages')
    .select('id, name, email, message, answered, created_at')
    .order('created_at', { ascending: false })
    .overrideTypes<Message[], { merge: false }>()
  if (error) throw new Error('Não foi possível carregar as mensagens.')
  return data
}

export async function setMessageAnswered(id: string, answered: boolean): Promise<void> {
  const { error } = await getSupabase().from('messages').update({ answered }).eq('id', id)
  if (error) throw new Error('Não foi possível atualizar a mensagem.')
}

// Troca a lista inteira de destaques numa transação só (função set_featured_projects,
// em supabase/migrations/002_dashboard.sql). A ordem do array vira a ordem no site.
export async function saveFeaturedProjects(repoNames: string[]): Promise<void> {
  const { error } = await getSupabase().rpc('set_featured_projects', { repo_names: repoNames })
  if (error) throw new Error('Não foi possível salvar os destaques.')
}
