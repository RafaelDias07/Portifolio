// Conteúdo da aba Multimídia: fotos da galeria, playlist do player e dados dos jogos.
// TODO(conteúdo): Rafael manda mais fotos (com legenda) e escolhe as músicas da playlist.
import { PROFILE } from '@/content/profile'

export type Photo = {
  src: string
  /** Texto alternativo: descreve a foto para quem não a vê */
  alt: string
  title: string
  caption: string
  width: number
  height: number
}

export const PHOTOS: Photo[] = [
  {
    src: PROFILE.photo,
    alt: `Foto de ${PROFILE.name}`,
    title: PROFILE.name,
    caption: `${PROFILE.role} · ${PROFILE.education}`,
    width: 288,
    height: 288,
  },
]

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
  description: string
}

export const GAMES: GameInfo[] = [
  {
    id: 'fox64',
    title: 'Fox 64',
    icon: '🚀',
    description:
      'Pilote a nave e defenda o computador de ondas de meteoros. Mouse para mirar e atirar.',
  },
  {
    id: 'bzero64',
    title: 'B-Zero 64',
    icon: '🏎️',
    description: 'Corrida espacial contra três pilotos rivais, com tiros e meteoros na pista.',
  },
]

// Como o visitante aparece nos jogos: o piloto é o Rafael
export const GAME_PLAYER = { name: 'RAFA', photo: PROFILE.photo }
