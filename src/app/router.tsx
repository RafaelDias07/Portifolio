import { createBrowserRouter } from 'react-router'
import { DesktopLayout } from '@/app/DesktopLayout'
import { ErrorPage } from '@/pages/ErrorPage'
import { HomePage } from '@/pages/HomePage'
import { MediaPage } from '@/pages/MediaPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { SkillsPage } from '@/pages/SkillsPage'

// Cada aba da janela é uma rota. O vercel.json manda toda URL para o index.html,
// então um link compartilhado (ex.: /projetos/WatchNext) abre certo ao atualizar
export const router = createBrowserRouter([
  {
    element: <DesktopLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'habilidades', element: <SkillsPage /> },
      { path: 'projetos', element: <ProjectsPage /> },
      { path: 'projetos/:slug', element: <ProjectDetailPage /> },
      {
        path: 'contato',
        // O formulário (React Hook Form) só é baixado quando alguém abre o contato
        lazy: () => import('@/pages/ContactPage').then((m) => ({ element: <m.ContactPage /> })),
      },
      { path: 'multimidia', element: <MediaPage /> },
      // A 404 abre dentro do monitor, numa janela de navegador antigo no lugar da janela XP
      { path: '*', element: <NotFoundPage />, handle: { ownWindow: true } },
    ],
  },
])
