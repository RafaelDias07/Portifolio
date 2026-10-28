// Dados pessoais exibidos no site. Ficam aqui para trocar o conteúdo sem mexer nos componentes.
// Textos baseados no LinkedIn e no README do perfil do GitHub do Rafael.
import photo from '@/assets/rafael-dias.webp'

export const PROFILE = {
  name: 'Rafael Dias',
  fullName: 'Rafael Dias Fontes',
  role: 'Desenvolvedor de software',
  education: 'Engenharia de Software · FIAP',
  photo,
  badges: ['Back-end', 'Automação', 'IA'],
  // Resumo do "Sobre" do LinkedIn do Rafael
  about: [
    'Eternamente aprendiz: sou estudante de Engenharia de Software na FIAP e entusiasta de programação. Quero evoluir como desenvolvedor aprofundando lógica de programação, estruturas de dados e boas práticas.',
    'Tenho perfil analítico e disciplinado, gosto de desafios técnicos e de aprender na prática. Acredito que organização, consistência e processos bem definidos são a base de um código de qualidade.',
    'Também trabalho com automação de processos, integrações entre ferramentas e Inteligência Artificial para otimizar rotinas. Me interesso muito por modelos generativos e pelo impacto deles no trabalho, sempre com fundamentos sólidos de programação por trás.',
    'Mais do que programar, quero usar a tecnologia para gerar valor real e facilitar a vida das pessoas.',
  ],
}

export type ProfileLink = {
  label: string
  href: string
  icon: string
}

export const PROFILE_LINKS: ProfileLink[] = [
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
    title: '⚙️ Back-end',
    items: ['Python', 'Django', 'FastAPI', 'APIs REST', 'Autenticação (OAuth2)'],
  },
  { title: '🗄️ Dados', items: ['PostgreSQL', 'MongoDB', 'SQL', 'Análise de dados'] },
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
  {
    title: '🔗 Automação',
    items: [
      'Automação de processos',
      'Integrações entre ferramentas',
      'Otimização de rotinas com IA',
    ],
  },
  {
    title: '🎨 Front-end',
    items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Tailwind', 'Bootstrap'],
  },
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
