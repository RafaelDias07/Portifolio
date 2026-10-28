// Dados pessoais exibidos no site. Ficam aqui para trocar o conteúdo sem mexer nos componentes.
// Textos baseados no LinkedIn e no README do perfil do GitHub do Rafael.
import photo from '@/assets/rafael-dias.webp'
import { CONTACT_EMAIL } from '@/content/contact'

export const PROFILE = {
  name: 'Rafael Dias',
  fullName: 'Rafael Dias Fontes',
  role: 'Desenvolvedor front-end',
  education: 'Engenharia de Software · FIAP',
  photo,
  badges: ['Front-end', 'IA'],
  // Resumo do "Sobre" do LinkedIn do Rafael
  about: [
    'Eternamente aprendiz: sou estudante de Engenharia de Software na FIAP e entusiasta de programação. Quero evoluir como desenvolvedor aprofundando lógica de programação, a construção de interfaces modernas e boas práticas.',
    'Tenho perfil analítico e disciplinado, gosto de desafios técnicos e de aprender na prática. Acredito que organização, consistência e processos bem definidos são a base de um código de qualidade.',
    'No front-end, desenvolvo interfaces com React e TypeScript, cuidando de componentes reaproveitáveis, responsividade e acessibilidade. Também uso Inteligência Artificial no dia a dia de desenvolvimento e me interesso muito por modelos generativos e pelo impacto deles no trabalho, sempre com fundamentos sólidos de programação por trás.',
    'Mais do que programar, quero usar a tecnologia para gerar valor real e facilitar a vida das pessoas.',
  ],
}

export type ProfileLink = {
  label: string
  href: string
  icon: string
}

export const PROFILE_LINKS: ProfileLink[] = [
  { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}`, icon: '✉️' },
  {
    label: 'linkedin.com/in/rafael-dias-fontes',
    href: 'https://www.linkedin.com/in/rafael-dias-fontes-2a947b3a7/',
    icon: '💼',
  },
  { label: 'github.com/RafaelDias07', href: 'https://github.com/RafaelDias07', icon: '🐙' },
]

export type SkillGroup = {
  title: string
  items: string[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: '🎨 Front-end',
    items: [
      'React',
      'TypeScript',
      'JavaScript',
      'HTML',
      'CSS',
      'Tailwind',
      'Bootstrap',
      'Three.js',
    ],
  },
  {
    title: '🤖 Inteligência artificial',
    items: [
      'IA generativa',
      'Claude Code',
      'Agentes de IA',
      'Harness (instruções, skills e hooks)',
      'APIs de IA',
    ],
  },
  { title: '⚙️ Back-end', items: ['Python', 'Django', 'FastAPI', 'APIs REST'] },
  { title: '🧰 Ferramentas', items: ['Git', 'GitHub', 'VS Code', 'Vite', 'Vercel'] },
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
  { name: 'Claude Code', usage: 'desenvolvimento com IA, guiado pelo AGENTS.md, skills e hooks' },
  { name: 'Biome + Husky', usage: 'lint e padrão de commits antes de todo commit' },
  { name: 'Vercel', usage: 'publicação automática a cada push na main' },
]
