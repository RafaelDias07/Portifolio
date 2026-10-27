import { lazy, Suspense, useRef, useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from './App.module.css'

// Three.js fica num chunk separado: só baixa quando a cena vai aparecer
const Scene3D = lazy(() => import('@/components/Scene3D').then((m) => ({ default: m.Scene3D })))

// A janela só é encaixada no monitor 3D em telas largas; abaixo disso ela ocupa a tela
const DESKTOP_QUERY = '(min-width: 64rem)'

export function App() {
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const overlayRef = useRef<HTMLElement>(null)
  const [focused, setFocused] = useState(false)

  return (
    <>
      {isDesktop && (
        <Suspense fallback={null}>
          <Scene3D overlayRef={overlayRef} mode="focus" onFocusChange={setFocused} />
        </Suspense>
      )}

      <main
        ref={overlayRef}
        className={styles.screen}
        data-visible={!isDesktop || focused}
        data-docked={isDesktop}
      >
        <p>&gt; RAFAEL_OS v1.0</p>
        <p>&gt; PORTFÓLIO DE RAFAEL DIAS</p>
        <p>&gt; STATUS: EM CONSTRUÇÃO</p>
      </main>
    </>
  )
}
