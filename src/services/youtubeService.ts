import type { YoutubeApi } from '@/types/youtube'

type YoutubeWindow = Window & {
  // biome-ignore lint/style/useNamingConvention: nome global criado pelo script do YouTube
  YT?: YoutubeApi
  onYouTubeIframeAPIReady?: () => void
}

let loading: Promise<YoutubeApi> | null = null

// Carrega o script do player do YouTube uma vez só, quando alguém aperta play.
// Até lá nenhum script do YouTube entra na página
export function loadYoutubeApi(): Promise<YoutubeApi> {
  loading ??= new Promise((resolve, reject) => {
    const youtubeWindow = window as YoutubeWindow
    if (youtubeWindow.YT?.Player) {
      resolve(youtubeWindow.YT)
      return
    }
    // O script avisa que terminou de carregar chamando esta função global
    youtubeWindow.onYouTubeIframeAPIReady = () => {
      if (youtubeWindow.YT) resolve(youtubeWindow.YT)
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.onerror = () => {
      loading = null
      reject(new Error('Não foi possível carregar o player do YouTube.'))
    }
    document.head.append(script)
  })
  return loading
}
