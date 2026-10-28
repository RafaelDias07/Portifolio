import { lazy, Suspense, useCallback, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { GAMES, type GameId } from '@/content/media'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from './GameList.module.css'

// O GameHost importa o React DOM do portal e os loaders dos jogos: também fica fora do pacote inicial
const GameHost = lazy(() => import('@/components/GameHost').then((m) => ({ default: m.GameHost })))

// Os jogos usam teclado e mouse; em telas de toque eles aparecem, mas não abrem
const TOUCH_QUERY = '(pointer: coarse)'

export function GameList() {
  const [running, setRunning] = useState<GameId | null>(null)
  const isTouch = useMediaQuery(TOUCH_QUERY)
  const stop = useCallback(() => setRunning(null), [])

  return (
    <>
      <ul className={styles.list}>
        {GAMES.map((game) => (
          <li key={game.id} className={styles.card}>
            <span className={styles.icon} aria-hidden="true">
              {game.icon}
            </span>
            <div className={styles.text}>
              <h4 className={styles.title}>{game.title}</h4>
              <p className={styles.description}>{game.description}</p>
            </div>
            <Button disabled={isTouch} onClick={() => setRunning(game.id)}>
              <span aria-hidden="true">🎮</span> Jogar
            </Button>
          </li>
        ))}
      </ul>
      {isTouch && (
        <p className={styles.notice}>Os jogos precisam de teclado e mouse: abra no computador.</p>
      )}

      {running && (
        <Suspense fallback={null}>
          <GameHost game={running} onExit={stop} />
        </Suspense>
      )}
    </>
  )
}
