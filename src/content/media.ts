// Conteúdo da aba Multimídia: fotos da galeria, playlist do player e dados dos jogos.
// TODO(conteúdo): Rafael escolhe as músicas da playlist.
import familyPhoto from '@/assets/familia.webp'
import childhoodPhoto from '@/assets/infancia.webp'
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

export const PHOTOS: Photo[] = [
  {
    src: PROFILE.photo,
    alt: `Foto de ${PROFILE.name}`,
    title: `🧠 ${PROFILE.fullName}`,
    caption:
      'Engenheiro de Software e IA — e agora, construindo com IA todos os dias. Minha obsessão por tecnologia não é à toa: acredito que sistemas bem construídos, com IA usada de verdade, mudam realidades. Cada projeto é uma missão, e eu levo isso a sério.',
    width: 288,
    height: 288,
  },
  {
    src: familyPhoto,
    alt: `${PROFILE.name} com a família, num passeio`,
    title: '💙 Eles são meu sistema central',
    caption:
      'Minha família não é só companhia — é minha base de operações. Nos momentos mais difíceis e nas conquistas mais importantes, eles estavam lá. Tudo que construo faz mais sentido com eles do meu lado.',
    width: 800,
    height: 888,
  },
  {
    src: childhoodPhoto,
    alt: `${PROFILE.name} criança, de camiseta azul, fazendo sinal de "hang loose"`,
    title: '🕹️ Desde o início...',
    caption:
      'Já nessa época eu sabia que tecnologia seria minha área. Cresci desmontando coisas pra ver como funcionavam. Spoiler: nem sempre conseguia montar de volta — mas aprendi muito no processo.',
    width: 800,
    height: 782,
  },
]

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
