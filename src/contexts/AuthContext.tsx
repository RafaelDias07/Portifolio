import type { Session } from '@supabase/supabase-js'
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'
import { onAuthChange, signOut } from '@/services/authService'

type AuthContextValue = {
  session: Session | null
  /** true até o Supabase dizer se há uma sessão salva no navegador */
  isLoading: boolean
  signOut: () => Promise<void>
}

// Exportado para os testes montarem a rota protegida sem falar com o Supabase
export const AuthContext = createContext<AuthContextValue | null>(null)

// Guarda quem está logado no dashboard. Fica só em volta das rotas /painel,
// então o site público não carrega nada de autenticação.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      return onAuthChange((nextSession) => {
        setSession(nextSession)
        setIsLoading(false)
      })
    } catch {
      // Supabase não configurado: ninguém consegue entrar, e a tela de login mostra o erro
      setIsLoading(false)
    }
  }, [])

  return <AuthContext value={{ session, isLoading, signOut }}>{children}</AuthContext>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return context
}
