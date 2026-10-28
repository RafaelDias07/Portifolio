import type { Session } from '@supabase/supabase-js'
import { getSupabase } from '@/services/supabaseClient'
import type { LoginCredentials } from '@/types/auth'

export async function signIn({ email, password }: LoginCredentials): Promise<void> {
  const { error } = await getSupabase().auth.signInWithPassword({ email, password })
  if (!error) return
  // Mesma mensagem para e-mail e senha errados: não conta para ninguém qual e-mail existe
  if (error.code === 'invalid_credentials') throw new Error('E-mail ou senha incorretos.')
  throw new Error('Não foi possível entrar agora. Tente de novo em instantes.')
}

export async function signOut(): Promise<void> {
  await getSupabase().auth.signOut()
}

// Avisa sempre que o login muda (entrou, saiu, token renovado). O Supabase chama logo
// ao assinar com a sessão salva no navegador, então serve também para a leitura inicial.
// Devolve a função que cancela a assinatura.
export function onAuthChange(callback: (session: Session | null) => void): () => void {
  const { data } = getSupabase().auth.onAuthStateChange((_event, session) => callback(session))
  return () => data.subscription.unsubscribe()
}
