import { type ReactNode, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import { Clock } from '@/components/Clock'
import { Button } from '@/components/ui/Button'
import { TitleBarButton } from '@/components/ui/TitleBarButton'
import { TitleBarIcon } from '@/components/ui/TitleBarIcon'
import { Window } from '@/components/ui/Window'
import { WindowNav } from '@/components/WindowNav'
import styles from './XpWindow.module.css'

type XpWindowProps = {
  /** A página da rota atual; a janela só cuida da moldura e da navegação */
  children: ReactNode
  /** Sem ele (cena 3D indisponível), os botões de câmera livre não aparecem */
  onFreeCamera?: () => void
}

export function XpWindow({ children, onFreeCamera }: XpWindowProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  // Página nova começa do topo, como numa navegação normal
  useEffect(() => {
    if (pathname) panelRef.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <Window
      title="Rafael_OS — Portfólio de Rafael Dias"
      icon="🖥️"
      titleActions={
        <>
          {onFreeCamera && (
            <TitleBarButton label="Minimizar e explorar a cena 3D" onClick={onFreeCamera}>
              _
            </TitleBarButton>
          )}
          <TitleBarIcon>□</TitleBarIcon>
          <TitleBarIcon variant="close">✕</TitleBarIcon>
        </>
      }
      toolbar={
        <>
          {onFreeCamera && (
            <Button onClick={onFreeCamera}>
              <span aria-hidden="true">🎥</span>
              Câmera livre
            </Button>
          )}
        </>
      }
      statusBar={
        <>
          <span className={styles.panel}>
            <Clock />
          </span>
          <span className={styles.panel} aria-hidden="true">
            RAM: 512 MB
          </span>
          <span className={styles.panel}>
            Rafael_OS XP
            {/* Acesso discreto ao painel do dono; quem não tem login cai na tela de entrar */}
            <Link to="/painel" className={styles.lock} aria-label="Painel do dono" title="Painel">
              🔐
            </Link>
          </span>
        </>
      }
    >
      <WindowNav />
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: o painel rola, então precisa receber foco para rolar pelo teclado */}
      <div ref={panelRef} className={styles.content} tabIndex={0}>
        {children}
      </div>
    </Window>
  )
}
