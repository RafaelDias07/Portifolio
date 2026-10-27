import { useState } from 'react'
import { Clock } from '@/components/Clock'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { type TabItem, Tabs } from '@/components/ui/Tabs'
import { TitleBarButton } from '@/components/ui/TitleBarButton'
import { Window } from '@/components/ui/Window'
import styles from './XpWindow.module.css'

type XpWindowProps = {
  /** As abas (páginas) vêm de fora: a janela só cuida da moldura e da navegação */
  tabs: TabItem[]
  /** Sem ele (cena 3D indisponível), os botões de câmera livre não aparecem */
  onFreeCamera?: () => void
}

export function XpWindow({ tabs, onFreeCamera }: XpWindowProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

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
      <Tabs label="Seções do portfólio" items={tabs} activeId={activeTab} onChange={setActiveTab} />
    </Window>
  )
}
