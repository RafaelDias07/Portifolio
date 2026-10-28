// Parte da API do player do YouTube (IFrame API) que o site usa.
// O script vem do próprio YouTube, então os tipos ficam escritos à mão aqui.

export type YoutubePlayer = {
  loadVideoById: (videoId: string) => void
  playVideo: () => void
  pauseVideo: () => void
  setVolume: (volume: number) => void
  destroy: () => void
}

export type YoutubePlayerEvent = {
  target: YoutubePlayer
  /** Estado do player: 0 = terminou, 1 = tocando, 2 = pausado */
  data: number
}

export type YoutubePlayerOptions = {
  height: string
  width: string
  videoId: string
  host: string
  playerVars: Record<string, number>
  events: {
    onReady: (event: YoutubePlayerEvent) => void
    onStateChange: (event: YoutubePlayerEvent) => void
    onError: () => void
  }
}

export type YoutubeApi = {
  // biome-ignore lint/style/useNamingConvention: nome da classe na API do YouTube
  Player: new (
    element: HTMLElement,
    options: YoutubePlayerOptions,
  ) => YoutubePlayer
}
