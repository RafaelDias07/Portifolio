// Conteúdo da aba Multimídia: fotos da galeria, playlist do player e dados dos jogos.
// TODO(conteúdo): Rafael manda as fotos (com legenda) e escolhe as músicas da playlist.
import { PROFILE } from '@/content/profile'

export type Photo = {
  /** Imagem importada de src/assets (WebP, até 200 KB) */
  src: string
  /** Texto alternativo: descreve a foto para quem não a vê */
  alt: string
  title: string
  caption: string
  width: number
  height: number
}

// Vazia por enquanto: a galeria mostra o aviso de "nenhuma foto"
export const PHOTOS: Photo[] = []

export type Track = {
  /** Id do vídeo no YouTube (o que vem depois de "watch?v=") */
  youtubeId: string
  title: string
  artist: string
  emoji: string
}

// Músicas provisórias (lo-fi de jogos), públicas no YouTube
export const PLAYLIST: Track[] = [
  { youtubeId: 'sQ6f9tFbWNA', title: 'Nintendo 64 Lo-fi', artist: 'LoFi Mix', emoji: '🎮' },
  { youtubeId: 'Z3GA0GQCE2M', title: 'Zelda Lo-fi', artist: 'LoFi Mix', emoji: '🗡️' },
  { youtubeId: '-iVACinS6EY', title: 'Pokémon Lo-fi', artist: 'Matcha', emoji: '🐾' },
]

export type GameId = 'fox64' | 'bzero64'

export type GameInfo = {
  id: GameId
  title: string
  icon: string
  /** Texto do ícone, como no RetroOffice ("Jogar Agora") */
  action: string
}

export const GAMES: GameInfo[] = [
  {
    id: 'fox64',
    title: 'Fox 64',
    icon: '🚀',
    action: 'Jogar Agora',
  },
  {
    id: 'bzero64',
    title: 'B-Zero 64',
    icon: '🏎️',
    action: 'Correr Agora',
  },
]

// Como o visitante aparece nos jogos: o piloto é o Rafael
export const GAME_PLAYER = { name: 'RAFA', photo: PROFILE.photo }
