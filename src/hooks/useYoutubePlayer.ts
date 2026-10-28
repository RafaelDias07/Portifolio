import { useEffect, useRef, useState } from 'react'
import { loadYoutubeApi } from '@/services/youtubeService'
import type { YoutubePlayer } from '@/types/youtube'

const STATE_ENDED = 0
const STATE_PLAYING = 1

// Player do YouTube escondido (só o som), como no RetroOffice. O vídeo fica num <div>
// de altura zero (hostRef) e a tela mostra os controles do Rafael_OS
export function useYoutubePlayer(onEnded: () => void) {
  const hostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<Promise<YoutubePlayer> | null>(null)
  const volumeRef = useRef(80)
  const onEndedRef = useRef(onEnded)
  onEndedRef.current = onEnded
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function createPlayer(videoId: string) {
    return loadYoutubeApi().then(
      (youtube) =>
        new Promise<YoutubePlayer>((resolve, reject) => {
          const host = hostRef.current
          if (!host) return reject(new Error('O player foi fechado.'))
          const target = document.createElement('div')
          host.replaceChildren(target)
          new youtube.Player(target, {
            height: '100%',
            width: '100%',
            videoId,
            host: 'https://www.youtube-nocookie.com',
            playerVars: { autoplay: 1, controls: 0, rel: 0, fs: 0, iv_load_policy: 3 },
            events: {
              onReady: ({ target: player }) => {
                player.setVolume(volumeRef.current)
                player.playVideo()
                resolve(player)
              },
              onStateChange: ({ data }) => {
                setIsPlaying(data === STATE_PLAYING)
                if (data === STATE_ENDED) onEndedRef.current()
              },
              onError: () => setError('Esta música não pode tocar aqui. Tente outra.'),
            },
          })
        }),
    )
  }

  function play(videoId: string) {
    setError(null)
    if (playerRef.current) {
      playerRef.current.then((player) => player.loadVideoById(videoId))
      return
    }
    const created = createPlayer(videoId)
    playerRef.current = created
    created.catch((reason: unknown) => {
      playerRef.current = null
      setError(reason instanceof Error ? reason.message : 'Não foi possível tocar a música.')
    })
  }

  // Sem player ainda, o primeiro play carrega a música selecionada
  function toggle(videoId: string) {
    if (!playerRef.current) return play(videoId)
    playerRef.current.then((player) => (isPlaying ? player.pauseVideo() : player.playVideo()))
  }

  function setVolume(volume: number) {
    volumeRef.current = volume
    playerRef.current?.then((player) => player.setVolume(volume))
  }

  // Fechar a janela para a música e remove o iframe
  useEffect(() => () => void playerRef.current?.then((player) => player.destroy()), [])

  return { hostRef, isPlaying, error, play, toggle, setVolume }
}
