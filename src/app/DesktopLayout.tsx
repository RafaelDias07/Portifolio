import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Outlet, useMatches } from 'react-router'
import { FreeCameraBar } from '@/components/FreeCameraBar'
import { MusicPlayerWindow } from '@/components/MusicPlayerWindow'
import { XpWindow } from '@/components/XpWindow'
import { MusicPlayerProvider } from '@/contexts/MusicPlayerContext'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import type { CameraMode } from '@/three'
import styles from './DesktopLayout.module.css'

// Three.js fica num chunk separado: só baixa quando a cena vai aparecer
const Scene3D = lazy(() => import('@/components/Scene3D').then((m) => ({ default: m.Scene3D })))

// A janela só é encaixada no monitor 3D em telas largas; abaixo disso ela ocupa a tela
const DESKTOP_QUERY = '(min-width: 64rem)'

// Uma rota com handle { ownWindow: true } desenha a própria janela (ex.: a 404)
function hasOwnWindow(handle: unknown) {
  return typeof handle === 'object' && handle !== null && 'ownWindow' in handle
}

// Layout de todas as rotas do portfólio: a cena 3D fica montada enquanto o visitante
// troca de página, e só o conteúdo da janela (o <Outlet />) muda
export function DesktopLayout() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const ownWindow = useMatches().some((match) => hasOwnWindow(match.handle))
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
    <MusicPlayerProvider>
      {showScene && (
        <Suspense fallback={null}>
          <Scene3D
            overlayRef={overlayRef}
            mode={mode}
            onFocusChange={setFocused}
            onUnavailable={handleSceneUnavailable}
            onScreenClick={backToWindow}
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
        {ownWindow ? (
          <Outlet />
        ) : (
          <XpWindow onFreeCamera={sceneFailed ? undefined : () => setMode('free')}>
            <Outlet />
          </XpWindow>
        )}
      </main>

      {loading && (
        <p className={styles.hint} role="status">
          Iniciando Rafael_OS…
        </p>
      )}

      {mode === 'free' && <FreeCameraBar onBack={backToWindow} />}

      {/* Fica fora da janela: a música continua ao trocar de aba ou na câmera livre */}
      <MusicPlayerWindow />
    </MusicPlayerProvider>
  )
}
