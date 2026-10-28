import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { PLAYLIST } from '@/content/media'
import styles from './MusicPlayer.module.css'

// Player no estilo do Windows Media Player. O vídeo do YouTube só é carregado quando o
// visitante aperta play: até lá, nenhum script nem cookie do YouTube entra na página
export function MusicPlayer() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const track = PLAYLIST[index]
  if (!track) return null

  function play(trackIndex: number) {
    setIndex(trackIndex)
    setPlaying(true)
  }

  const step = (direction: number) => play((index + direction + PLAYLIST.length) % PLAYLIST.length)

  return (
    <div className={styles.player}>
      <div className={styles.screen}>
        {playing ? (
          <iframe
            // A key troca o iframe a cada música, e o autoplay começa a tocar na hora
            key={track.youtubeId}
            className={styles.video}
            src={`https://www.youtube-nocookie.com/embed/${track.youtubeId}?autoplay=1`}
            title={`${track.title} — ${track.artist}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className={styles.idle}>
            <span aria-hidden="true">🎵</span>
            <p>Aperte ▶ para tocar</p>
          </div>
        )}
      </div>

      <p className={styles.nowPlaying} aria-live="polite">
        {playing ? 'Tocando: ' : 'Selecionada: '}
        <strong>{track.title}</strong> — {track.artist}
      </p>

      <div className={styles.controls}>
        <Button onClick={() => step(-1)} aria-label="Música anterior">
          ⏮
        </Button>
        <Button
          className={styles.main}
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? 'Parar' : 'Tocar'}
        >
          {playing ? '⏹' : '▶'}
        </Button>
        <Button onClick={() => step(1)} aria-label="Próxima música">
          ⏭
        </Button>
      </div>

      <ol className={styles.playlist}>
        {PLAYLIST.map((item, itemIndex) => (
          <li key={item.youtubeId}>
            <button
              type="button"
              className={styles.item}
              aria-current={itemIndex === index}
              onClick={() => play(itemIndex)}
            >
              <span className={styles.number}>{itemIndex + 1}.</span>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.artist}>{item.artist}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
