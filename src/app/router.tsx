import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router'
import { DesktopLayout } from '@/app/DesktopLayout'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Window } from '@/components/ui/Window'
import { ErrorPage } from '@/pages/ErrorPage'
import { HomePage } from '@/pages/HomePage'
import { MediaPage } from '@/pages/MediaPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { SkillsPage } from '@/pages/SkillsPage'

// O formulário (React Hook Form) só é baixado quando alguém abre o contato.
// Com Suspense, a janela e a cena aparecem na hora e só o conteúdo espera o download.
const ContactPage = lazy(() =>
  import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })),
)

// O painel inteiro (login, dashboard e o supabase-js) é outro chunk, só para quem abre /painel
const DashboardApp = lazy(() =>
  import('@/pages/dashboard/DashboardApp').then((m) => ({ default: m.DashboardApp })),
)

// Cada aba da janela é uma rota. O vercel.json manda toda URL para o index.html,
// então um link compartilhado (ex.: /projetos) abre certo ao atualizar
export const router = createBrowserRouter([
  {
    element: <DesktopLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'habilidades', element: <SkillsPage /> },
      { path: 'projetos', element: <ProjectsPage /> },
      {
        path: 'contato',
        element: (
          <Suspense fallback={<ProgressBar label="Carregando o contato" />}>
            <ContactPage />
          </Suspense>
        ),
      },
      { path: 'multimidia', element: <MediaPage /> },
      // O painel desenha a própria janela; as rotas /painel/login e /painel ficam no DashboardApp
      {
        path: 'painel/*',
        element: (
          <Suspense
            fallback={
              <Window title="Rafael_OS — Painel" icon="🔐">
                <ProgressBar label="Carregando o painel" />
              </Window>
            }
          >
            <DashboardApp />
          </Suspense>
        ),
        handle: { ownWindow: true },
      },
      // A 404 abre dentro do monitor, numa janela de navegador antigo no lugar da janela XP.
      // Quem cai direto nela vê o monitor na hora, sem o voo e a caixa de carregamento
      { path: '*', element: <NotFoundPage />, handle: { ownWindow: true, skipIntro: true } },
    ],
  },
])
