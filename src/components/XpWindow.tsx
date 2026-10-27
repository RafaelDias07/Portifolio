import { useState } from 'react'
import { Clock } from '@/components/Clock'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { type TabItem, Tabs } from '@/components/ui/Tabs'
import { TitleBarButton } from '@/components/ui/TitleBarButton'
import { Window } from '@/components/ui/Window'
import { ContactPage } from '@/pages/ContactPage'
import { HomePage } from '@/pages/HomePage'
import { MediaPage } from '@/pages/MediaPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { SkillsPage } from '@/pages/SkillsPage'
import styles from './XpWindow.module.css'

const TABS: TabItem[] = [
  { id: 'home', icon: '🧭', label: 'Início', content: <HomePage /> },
  { id: 'skills', icon: '⚙️', label: 'Habilidades', content: <SkillsPage /> },
  { id: 'projects', icon: '🚀', label: 'Projetos', content: <ProjectsPage /> },
  { id: 'contact', icon: '📬', label: 'Contato', content: <ContactPage /> },
  { id: 'media', icon: '💿', label: 'Multimídia', content: <MediaPage /> },
]

type XpWindowProps = {
  /** Sem ele (cena 3D indisponível), os botões de câmera livre não aparecem */
  onFreeCamera?: () => void
}

export function XpWindow({ onFreeCamera }: XpWindowProps) {
  const [activeTab, setActiveTab] = useState(TABS[0].id)

  return (
    <Window
      title="Rafael_OS — Portfólio de Rafael Dias"
      icon="🖥️"
      titleActions={
        onFreeCamera && (
          <TitleBarButton label="Minimizar e explorar a cena 3D" onClick={onFreeCamera}>
            _
          </TitleBarButton>
        )
      }
      toolbar={
        <>
          {onFreeCamera && (
            <Button onClick={onFreeCamera}>
              <span aria-hidden="true">🎥</span>
              Câmera livre
            </Button>
          )}
          <ThemeToggle />
        </>
      }
      statusBar={
        <>
          <span className={styles.panel}>
            <Clock />
          </span>
          <span className={styles.panel}>Rafael_OS XP</span>
        </>
      }
    >
      <Tabs label="Seções do portfólio" items={TABS} activeId={activeTab} onChange={setActiveTab} />
    </Window>
  )
}
