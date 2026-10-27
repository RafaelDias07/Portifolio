import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { TabItem } from '@/components/ui/Tabs'
import { XpWindow } from '@/components/XpWindow'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ContactPage } from '@/pages/ContactPage'
import { HomePage } from '@/pages/HomePage'
import { MediaPage } from '@/pages/MediaPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { SkillsPage } from '@/pages/SkillsPage'
import type { CameraMode } from '@/three'
import styles from './App.module.css'

// Three.js fica num chunk separado: só baixa quando a cena vai aparecer
const Scene3D = lazy(() => import('@/components/Scene3D').then((m) => ({ default: m.Scene3D })))

// Cada aba da janela é uma página; na etapa de rotas cada uma ganha a sua URL
const TABS: TabItem[] = [
  { id: 'home', icon: '🧭', label: 'Início', content: <HomePage /> },
  { id: 'skills', icon: '⚙️', label: 'Habilidades', content: <SkillsPage /> },
  { id: 'projects', icon: '🚀', label: 'Projetos', content: <ProjectsPage /> },
  { id: 'contact', icon: '📬', label: 'Contato', content: <ContactPage /> },
  { id: 'media', icon: '💿', label: 'Multimídia', content: <MediaPage /> },
]

// A janela só é encaixada no monitor 3D em telas largas; abaixo disso ela ocupa a tela
const DESKTOP_QUERY = '(min-width: 64rem)'

export function App() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<CameraMode>('focus')
  const [focused, setFocused] = useState(false)
  const [sceneFailed, setSceneFailed] = useState(false)

  const docked = isDesktop && !sceneFailed
  // No celular a cena só é baixada quando o visitante pede a câmera livre
  const showScene = !sceneFailed && (docked || mode === 'free')
  const windowVisible = mode === 'focus' && (!docked || focused)
  const loading = docked && mode === 'focus' && !focused

  // Ao voltar da câmera livre, devolve o foco do teclado para a janela
  const restoreFocusRef = useRef(false)
  useEffect(() => {
    if (!windowVisible || !restoreFocusRef.current) return
    restoreFocusRef.current = false
    overlayRef.current?.querySelector('button')?.focus()
  }, [windowVisible])

  function backToWindow() {
    restoreFocusRef.current = true
    setMode('focus')
  }

  useEffect(() => {
    if (mode !== 'free') return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      restoreFocusRef.current = true
      setMode('focus')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode])

  function handleSceneUnavailable() {
    setSceneFailed(true)
    setMode('focus')
  }

  return (
    <>
      {showScene && (
        <Suspense fallback={null}>
          <Scene3D
            overlayRef={overlayRef}
            mode={mode}
            onFocusChange={setFocused}
            onUnavailable={handleSceneUnavailable}
          />
        </Suspense>
      )}

      <main
        ref={overlayRef}
        className={styles.dock}
        data-docked={docked}
        data-visible={windowVisible}
        inert={!windowVisible}
      >
        <XpWindow tabs={TABS} onFreeCamera={sceneFailed ? undefined : () => setMode('free')} />
      </main>

      {loading && (
        <p className={styles.hint} role="status">
          Iniciando Rafael_OS…
        </p>
      )}

      {mode === 'free' && (
        <div className={styles.freeBar}>
          <p className={styles.freeHint}>Arraste para girar · role ou pince para dar zoom</p>
          <button
            type="button"
            className={styles.backButton}
            onClick={backToWindow}
            // biome-ignore lint/a11y/noAutofocus: a janela some; o foco precisa ir para a única ação disponível
            autoFocus
          >
            🖥️ Voltar ao portfólio
          </button>
        </div>
      )}
    </>
  )
}
