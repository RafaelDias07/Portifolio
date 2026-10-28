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
      'Numa empresa AI First, atuo entre os times de Agilidade e QA: construo automações e dashboards e resolvo os problemas do dia a dia com IA, de forma rápida e bem feita.',
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

export type SkillLevel = {
  label: string
  /** De 0 a 100 */
  value: number
}

// Caixa "Tecnologias" da aba Habilidades, da mais forte para a mais fraca
export const SKILL_LEVELS: SkillLevel[] = [
  { label: 'IA aplicada', value: 90 },
  { label: 'Automação', value: 85 },
  { label: 'Arquitetura Harness', value: 85 },
  { label: 'Agentes de IA', value: 80 },
  { label: 'Git/GitHub', value: 80 },
  { label: 'Python', value: 70 },
  { label: 'Integrações (APIs)', value: 70 },
  { label: 'JavaScript', value: 65 },
]

export type Solution = {
  /** Parte em negrito */
  title: string
  detail: string
}

// Caixa "O que eu realmente resolvo" da aba Habilidades
export const SOLUTIONS: Solution[] = [
  { title: 'Resolvo problemas reais com IA', detail: 'do diagnóstico à solução funcionando' },
  {
    title: 'Automatizo processos',
    detail: 'o que aprendi como fundador da AI For Business',
  },
  { title: 'Planejo rápido', detail: 'planejamentos estratégicos com IA em pouco tempo' },
  {
    title: 'Construo automações e dashboards com IA',
    detail: 'e resolvo os problemas dos times de Agilidade e QA no G4',
  },
  { title: 'Uso IA com critério', detail: 'rapidez sem abrir mão da qualidade' },
  { title: 'Conecto sistemas', detail: 'integrações por APIs para os dados andarem sozinhos' },
]
