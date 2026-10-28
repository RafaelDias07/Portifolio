// Conteúdo da aba Multimídia: playlist do player e dados dos jogos.
// TODO(conteúdo): Rafael escolhe as músicas da playlist.
import { PROFILE } from '@/content/profile'

export type Track = {
  /** Id do vídeo no YouTube (o que vem depois de "watch?v=") */
  youtubeId: string
  title: string
  artist: string
}

// Músicas provisórias (lo-fi de jogos), públicas no YouTube
export const PLAYLIST: Track[] = [
  { youtubeId: 'sQ6f9tFbWNA', title: 'Nintendo 64 Lo-fi', artist: 'LoFi Mix' },
  { youtubeId: 'Z3GA0GQCE2M', title: 'Zelda Lo-fi', artist: 'LoFi Mix' },
  { youtubeId: '-iVACinS6EY', title: 'Pokémon Lo-fi', artist: 'Matcha' },
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
