import { type PointerEvent, useState } from 'react'
import { createPortal } from 'react-dom'
import { TitleBarButton } from '@/components/ui/TitleBarButton'
import { PLAYLIST } from '@/content/media'
import { useMusicPlayer } from '@/contexts/MusicPlayerContext'
import { useYoutubePlayer } from '@/hooks/useYoutubePlayer'
import styles from './MusicPlayerWindow.module.css'

type Position = { x: number; y: number }

// Janela flutuante do Music Player, como a do RetroOffice: arrasta pela barra de
// título, minimiza, e continua tocando enquanto o visitante navega pelas abas
export function MusicPlayerWindow() {
  const { isOpen } = useMusicPlayer()
  // Fechada, a janela sai da tela inteira, e o player do YouTube junto
  return isOpen ? createPortal(<PlayerWindow />, document.body) : null
}

function PlayerWindow() {
  const { close } = useMusicPlayer()
  const [index, setIndex] = useState(0)
  const [started, setStarted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [volume, setVolume] = useState(80)
  const [minimized, setMinimized] = useState(false)
  // null = posição padrão (canto inferior direito); depois de arrastar, fica onde soltar
  const [position, setPosition] = useState<Position | null>(null)
  const [drag, setDrag] = useState<Position | null>(null)
  const player = useYoutubePlayer(next)
  const track = PLAYLIST[index]

  function play(trackIndex: number) {
    const item = PLAYLIST[trackIndex]
    if (!item) return
    setIndex(trackIndex)
    setStarted(true)
    player.play(item.youtubeId)
  }

  function next() {
    if (repeat) return play(index)
    if (shuffle) return play(Math.floor(Math.random() * PLAYLIST.length))
    play((index + 1) % PLAYLIST.length)
  }

  function changeVolume(value: number) {
    setVolume(value)
    player.setVolume(value)
  }

  // Arrastar: guarda a distância entre o ponteiro e o canto da janela
  function startDrag(event: PointerEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('button')) return
    const box = event.currentTarget.parentElement?.getBoundingClientRect()
    if (!box) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setDrag({ x: event.clientX - box.left, y: event.clientY - box.top })
  }

  function moveDrag(event: PointerEvent<HTMLElement>) {
    if (!drag) return
    const box = event.currentTarget.parentElement?.getBoundingClientRect()
    if (!box) return
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - box.width, event.clientX - drag.x)),
      y: Math.max(0, Math.min(window.innerHeight - box.height, event.clientY - drag.y)),
    })
  }

  return (
    <section
      className={styles.window}
      aria-label="Music Player"
      style={
        position ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' } : undefined
      }
    >
      <header
        className={styles.titleBar}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={() => setDrag(null)}
      >
        <span aria-hidden="true">🎵</span>
        <h2 className={styles.title}>Rafael_OS — Music Player</h2>
        <TitleBarButton
          label={minimized ? 'Restaurar' : 'Minimizar'}
          aria-expanded={!minimized}
          onClick={() => setMinimized(!minimized)}
        >
          ─
        </TitleBarButton>
        <TitleBarButton label="Fechar o player" variant="close" onClick={close}>
          ✕
        </TitleBarButton>
      </header>

      {/* O vídeo do YouTube fica aqui, com altura zero: só o som importa */}
      <div ref={player.hostRef} className={styles.host} aria-hidden="true" />

      <div className={styles.body} hidden={minimized}>
        <div className={styles.nowPlaying} aria-live="polite">
          <span className={styles.emoji} aria-hidden="true">
            {started && track ? track.emoji : '🎵'}
          </span>
          <div className={styles.nowText}>
            <p className={styles.nowTitle}>
              {started && track ? track.title : 'Selecione uma música'}
            </p>
            <p className={styles.nowArtist}>
              {started && track ? track.artist : 'Rafael_OS Music Player'}
            </p>
          </div>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.control}
            aria-label="Anterior"
            onClick={() => play((index - 1 + PLAYLIST.length) % PLAYLIST.length)}
          >
            ⏮
          </button>
          <button
            type="button"
            className={`${styles.control} ${styles.playButton}`}
            aria-label={player.isPlaying ? 'Pausar' : 'Tocar'}
            onClick={() => {
              setStarted(true)
              if (track) player.toggle(track.youtubeId)
            }}
          >
            {player.isPlaying ? '⏸' : '▶'}
          </button>
          <button type="button" className={styles.control} aria-label="Próxima" onClick={next}>
            ⏭
          </button>
          <span className={styles.separator} />
          <button
            type="button"
            className={styles.control}
            data-toggle
            aria-label="Aleatório"
            aria-pressed={shuffle}
            onClick={() => setShuffle(!shuffle)}
          >
            🔀
          </button>
          <button
            type="button"
            className={styles.control}
            data-toggle
            aria-label="Repetir"
            aria-pressed={repeat}
            onClick={() => setRepeat(!repeat)}
          >
            🔁
          </button>
          <label className={styles.volume}>
            <span aria-hidden="true">🔊</span>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              aria-label="Volume"
              onChange={(event) => changeVolume(Number(event.target.value))}
            />
            <span className={styles.volumeLabel}>{volume}%</span>
          </label>
        </div>

        {player.error && (
          <p className={styles.error} role="alert">
            ⚠ {player.error}
          </p>
        )}

        <div className={styles.playlistHeader}>
          <span>🎶 Playlist</span>
          <span className={styles.count}>{PLAYLIST.length} músicas</span>
        </div>
        <ol className={styles.playlist}>
          {PLAYLIST.map((item, itemIndex) => {
            const current = started && itemIndex === index
            return (
              <li key={item.youtubeId}>
                <button
                  type="button"
                  className={styles.item}
                  aria-current={current}
                  onClick={() => play(itemIndex)}
                >
                  <span className={styles.number}>{current ? '♪' : itemIndex + 1}</span>
                  <img
                    className={styles.thumb}
                    src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
                    alt=""
                    width={52}
                    height={32}
                    loading="lazy"
                  />
                  <span className={styles.itemText}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={styles.itemArtist}>{item.artist}</span>
                  </span>
                  <span className={styles.itemPlay} aria-hidden="true">
                    ▶
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
