import { type RefObject, useEffect, useRef } from 'react'
import { type CameraMode, createScene, type SceneHandle } from '@/three'
import styles from './Scene3D.module.css'

const BOOT_LINES = [
  'RAFAEL_OS v1.0',
  '> KERNEL: OK',
  '> VIDEO: CRT_EMULATION_ON',
  '> STATUS: ATIVO',
]

type Scene3DProps = {
  /** Elemento que a cena encaixa sobre a tela do monitor (a janela XP) */
  overlayRef: RefObject<HTMLElement | null>
  mode: CameraMode
  onFocusChange: (focused: boolean) => void
  /** Chamado quando o navegador não consegue criar a cena (sem WebGL) */
  onUnavailable: () => void
}

// Ponte entre o React e a cena Three.js imperativa de src/three (AGENTS.md seção 10)
export function Scene3D({ overlayRef, mode, onFocusChange, onUnavailable }: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<SceneHandle | null>(null)
  const lastModeRef = useRef(mode)
  const callbacksRef = useRef({ onFocusChange, onUnavailable })

  useEffect(() => {
    callbacksRef.current = { onFocusChange, onUnavailable }
  })

  // A cena é criada uma vez; o modo inicial vem do primeiro render
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let scene: SceneHandle
    try {
      scene = createScene({
        container,
        overlay: overlayRef.current,
        bootLines: BOOT_LINES,
        initialMode: lastModeRef.current,
        skipIntro: reducedMotion,
        onFocusChange: (focused) => callbacksRef.current.onFocusChange(focused),
      })
    } catch {
      callbacksRef.current.onUnavailable()
      return
    }
    sceneRef.current = scene

    return () => {
      scene.dispose()
      sceneRef.current = null
    }
  }, [overlayRef])

  useEffect(() => {
    if (lastModeRef.current === mode) return
    lastModeRef.current = mode
    sceneRef.current?.setMode(mode)
  }, [mode])

  return <div ref={containerRef} className={styles.scene} data-mode={mode} />
}
