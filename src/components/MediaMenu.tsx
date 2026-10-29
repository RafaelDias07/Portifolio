import { lazy, Suspense, useCallback, useState } from 'react'
import { PhotoGallery } from '@/components/PhotoGallery'
import { GAMES, type GameId } from '@/content/media'
import { useMusicPlayer } from '@/contexts/MusicPlayerContext'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from './MediaMenu.module.css'

// O GameHost (e cada jogo) fica fora do pacote inicial: só baixa ao clicar no ícone
const GameHost = lazy(() => import('@/components/GameHost').then((m) => ({ default: m.GameHost })))

// Os jogos usam teclado e mouse; em telas de toque o ícone aparece, mas não abre
const TOUCH_QUERY = '(pointer: coarse)'

// Ícones da aba Multimídia, como no RetroOffice: Fotos abre a galeria no lugar dos
// ícones, Música abre o player flutuante e os jogos abrem em tela cheia
export function MediaMenu() {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [running, setRunning] = useState<GameId | null>(null)
  const isTouch = useMediaQuery(TOUCH_QUERY)
  const musicPlayer = useMusicPlayer()
  const stop = useCallback(() => setRunning(null), [])

  if (galleryOpen) return <PhotoGallery onClose={() => setGalleryOpen(false)} />

  return (
    <>
      <ul className={styles.grid}>
        <li>
          <button type="button" className={styles.item} onClick={() => setGalleryOpen(true)}>
            <span className={styles.icon} aria-hidden="true">
              📷
            </span>
            <span className={styles.title}>Fotos</span>
            <span className={styles.status} data-tone="link">
              Ver Galeria
            </span>
          </button>
        </li>
        <li>
          <button type="button" className={styles.item} onClick={musicPlayer.open}>
            <span className={styles.icon} aria-hidden="true">
              🎵
            </span>
            <span className={styles.title}>Música</span>
            <span className={styles.status} data-tone="link">
              {musicPlayer.isOpen ? 'Player aberto' : 'Abrir Player'}
            </span>
          </button>
        </li>
        {GAMES.map((game) => (
          <li key={game.id}>
            <button
              type="button"
              className={styles.item}
              disabled={isTouch}
              onClick={() => setRunning(game.id)}
            >
              <span className={styles.icon} aria-hidden="true">
                {game.icon}
              </span>
              <span className={styles.title}>{game.title}</span>
              <span className={styles.status} data-tone={game.id}>
                {isTouch ? 'Só no computador' : game.action}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {running && (
        <Suspense fallback={null}>
          <GameHost game={running} onExit={stop} />
        </Suspense>
      )}
    </>
  )
}
