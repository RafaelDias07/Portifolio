// Dados pessoais exibidos no site. Ficam aqui para trocar o conteúdo sem mexer nos componentes.
// Textos baseados no LinkedIn e no README do perfil do GitHub do Rafael.
import photo from '@/assets/rafael-dias.webp'
import { CONTACT_EMAIL } from '@/content/contact'

export const PROFILE = {
  name: 'Rafael Dias',
  fullName: 'Rafael Dias Fontes',
  role: 'Engenheiro de Software',
  education: 'Engenharia de Software · FIAP',
  photo,
  /** Linha abaixo do nome, como "Dev · Produto · Sistemas" no RetroOffice */
  headline: 'Engenheiro de Software · IA · Planejamento Estratégico',
  /** Selos azuis abaixo da linha: onde atuo e estudo */
  badges: ['G4', 'AI For Business', 'FIAP'],
  // Caixa "Missão" da página inicial. A última frase aparece com o destaque em azul
  mission: [
    'Construo sistemas e planejamentos rápidos com IA, do problema à solução.',
    'Uso IA de verdade em problemas reais: resolver a dor de quem está do outro lado.',
  ],
  missionHighlight: 'Rápido + bem feito + IA como ferramenta.',
  missionClosing: 'A solução mais rápida e qualificada possível.',
}

// Caixa "Sistema Ativo" da página inicial
export const SYSTEM_INFO = [
  { label: 'Operador', value: PROFILE.fullName },
  // TODO(conteúdo): Rafael ainda vai definir o nome da função
  { label: 'Função', value: 'Resolver problemas reais com IA no dia a dia' },
  { label: 'Empresa', value: 'G4 · TechOps' },
  { label: 'Foco', value: 'Uso de IA no dia a dia para soluções de problemas reais' },
  { label: 'Status', value: '🟢 Aceitando missões' },
]

export type CareerStep = {
  /** Período, ex.: "2024 – 2025" */
  period: string
  company: string
  role: string
  description: string
  /** Onde estou agora: ganha o selo "atual" */
  current?: boolean
}

// Caixa "Trajetória" da página inicial, da mais recente para a mais antiga
export const CAREER: CareerStep[] = [
  {
    period: 'abr 2026 – hoje',
    company: 'G4',
    role: 'TechOps',
    description:
      'Numa empresa IA first, atuo entre os times de Agilidade e QA, prestando serviços de IA para os dois e resolvendo problemas do dia a dia de forma rápida e bem feita.',
    current: true,
  },
  {
    period: '2024 – 2025',
    company: 'AI For Business',
    role: 'Fundador · Desenvolvedor de automação',
    description:
      'Criei minha própria empresa e atuei como fundador e desenvolvedor de automações para negócios.',
  },
]

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
  { name: 'CSS Modules', usage: 'estilo por componente e cores por variáveis CSS' },
  { name: 'Claude Code', usage: 'desenvolvimento com IA, guiado pelo AGENTS.md, skills e hooks' },
  { name: 'Biome + Husky', usage: 'lint e padrão de commits antes de todo commit' },
  { name: 'Vercel', usage: 'publicação automática a cada push na main' },
]
