// Dados pessoais exibidos no site. Ficam aqui para trocar o conteúdo sem mexer nos componentes.
// TODO(conteúdo): Rafael completa a apresentação, as habilidades e os outros links.

export const PROFILE = {
  name: 'Rafael Dias',
  role: 'Desenvolvedor front-end',
  initials: 'RD',
  about: 'Apresentação em breve.',
}

export type ProfileLink = {
  label: string
  href: string
  icon: string
}

export const PROFILE_LINKS: ProfileLink[] = [
  { label: 'github.com/RafaelDias07', href: 'https://github.com/RafaelDias07', icon: '🐙' },
]

export type StackItem = {
  name: string
  usage: string
}

// Tecnologias usadas neste próprio site
export const SITE_STACK: StackItem[] = [
  { name: 'React 19 + TypeScript', usage: 'interface em componentes, com tipos em tudo' },
  { name: 'Three.js', usage: 'o computador e o espaço em 3D' },
  { name: 'Vite', usage: 'servidor de desenvolvimento e build' },
  { name: 'CSS Modules', usage: 'estilo por componente e tema por variáveis CSS' },
  { name: 'Biome + Husky', usage: 'lint e padrão de commits antes de todo commit' },
  { name: 'Vercel', usage: 'publicação automática a cada push na main' },
]
