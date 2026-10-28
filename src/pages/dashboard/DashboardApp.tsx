import { Navigate, Route, Routes } from 'react-router'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { LoginPage } from '@/pages/dashboard/LoginPage'

// Quem já está logado não precisa ver o login de novo
function LoginRoute() {
  const { session, isLoading } = useAuth()
  if (!isLoading && session) return <Navigate to="/painel" replace />
  return <LoginPage />
}

// Tudo de /painel num chunk só (login, dashboard e o supabase-js), baixado com
// React.lazy apenas por quem abre o painel. As rotas internas ficam aqui dentro
export function DashboardApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginRoute />} />
        <Route
          index
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/painel" replace />} />
      </Routes>
    </AuthProvider>
  )
}
