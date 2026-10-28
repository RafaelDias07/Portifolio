import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/contexts/AuthContext'

type ProtectedRouteProps = {
  children: ReactNode
}

// Só mostra o conteúdo para quem está logado. Sem login, manda para /painel/login e
// guarda de onde a pessoa veio, para voltar para lá depois de entrar
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <ProgressBar label="Verificando o login" />
  if (!session) {
    return <Navigate to="/painel/login" replace state={{ from: location.pathname }} />
  }
  return children
}
