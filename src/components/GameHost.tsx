import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ErrorDialog } from '@/components/ui/ErrorDialog'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { XpDialog } from '@/components/ui/XpDialog'
import { GAME_PLAYER, type GameId } from '@/content/media'
import type { GameHandle } from '@/games/types'
import styles from './GameHost.module.css'

// Cada jogo é um chunk separado: só é baixado quando o visitante clica em "Jogar"
const LOADERS = {
  fox64: () => import('@/games/fox64'),
  bzero64: () => import('@/games/bzero64'),
}

type GameHostProps = {
  game: GameId
  onExit: () => void
}

// Ponte entre o React e os jogos em Three.js (AGENTS.md seção 10): monta o jogo numa
// camada de tela cheia e chama dispose ao sair, liberando o canvas e a memória da GPU.
// Usa um portal no <body> porque a janela XP fica presa ao tamanho do monitor 3D
export function GameHost({ game, onExit }: GameHostProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  // O jogo guarda o onExit na criação; o ref sempre aponta para a versão atual
  const onExitRef = useRef(onExit)
  onExitRef.current = onExit

  useEffect(() => {
    let handle: GameHandle | null = null
    let cancelled = false

    LOADERS[game]()
      .then(({ startGame }) => {
        const container = containerRef.current
        if (cancelled || !container) return
        handle = startGame({
          container,
          player: GAME_PLAYER,
          onExit: () => onExitRef.current(),
        })
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      handle?.dispose()
    }
  }, [game])

  return createPortal(
    <div className={styles.host} role="application" aria-label="Jogo em tela cheia">
      <div ref={containerRef} className={styles.stage} />
      {status === 'loading' && (
        <div className={styles.overlay}>
          <XpDialog title="Carregando o jogo...">
            <ProgressBar label="Carregando o jogo" />
          </XpDialog>
        </div>
      )}
      {status === 'error' && (
        <div className={styles.overlay}>
          <ErrorDialog title="O jogo não abriu" message="Confira a conexão e tente de novo." />
          <button type="button" className={styles.close} onClick={onExit}>
            Voltar ao portfólio
          </button>
        </div>
      )}
    </div>,
    document.body,
  )
}
