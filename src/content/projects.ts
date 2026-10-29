// Nome e descrição dos projetos, por repositório. O que não estiver aqui usa os dados do GitHub.
// TODO(conteúdo): Rafael revisa os textos sugeridos abaixo.
export type ProjectText = {
  /** Nome do repositório no GitHub (maiúsculas e minúsculas não importam) */
  repo: string
  name: string
  /** Emoji ao lado do nome */
  icon: string
  description: string
  /** Etiquetas embaixo da descrição */
  tags: string[]
  /** Aba onde aparece; sem ele, "Projetos Pessoais" */
  category?: 'personal' | 'professional'
}

export const PROJECT_TEXTS: ProjectText[] = [
  {
    repo: 'Portifolio',
    name: 'Portfólio 3D — Rafael_OS',
    icon: '🖥️',
    description:
      'Este site: um computador dos anos 90 flutuando no espaço em Three.js, com uma janela do Windows XP em React. Tem jogos de nave e de corrida, player de música, painel com login e foi construído com IA, guiado por um harness de agentes.',
    tags: ['React', 'TypeScript', 'Three.js', 'IA', 'Harness'],
  },
  {
    repo: 'fastapi-auth-db-api',
    name: 'API com FastAPI e login',
    icon: '🐍',
    description:
      'API REST em Python com FastAPI: cadastro e login com sessão por cookie, rotas protegidas por middleware, CRUD com SQLite, validação com Pydantic, documentação automática no Swagger e testes com PyTest.',
    tags: ['Python', 'FastAPI', 'SQLite', 'PyTest'],
  },
  {
    repo: 'WatchNext',
    name: 'WatchNext',
    icon: '🎬',
    tags: ['React 19', 'API do TMDB'],
    description:
      'Descubra o que assistir pelo seu humor e pelo tempo que você tem. React 19 com a API do TMDB e lista pessoal salva no navegador.',
  },
  {
    repo: 'Bootstrap-Tailwind-e-React',
    name: 'Bootstrap, Tailwind e React',
    icon: '🎨',
    tags: ['Bootstrap', 'Tailwind', 'React'],
    description:
      'Três sites, uma ferramenta em cada: página de café com Bootstrap, o ateliê de livros "Fio & Prensa" com Tailwind e uma landing page animada do Homem-Aranha em React.',
  },
  {
    repo: 'code-cam-APP',
    name: 'CodeCam APP',
    icon: '📷',
    tags: ['IA', 'Acessibilidade', 'React', 'NestJS', 'PostgreSQL'],
    description:
      'Fotografe a lousa ou o caderno e receba resumo, tópicos e flashcards gerados por IA. Acessibilidade no centro: fonte OpenDyslexic, alto contraste e leitura em voz alta. Projeto em equipe com React, NestJS e PostgreSQL.',
  },
  {
    repo: 'LandingPage-CodeCam',
    name: 'CodeCam — Landing Page',
    icon: '🌐',
    tags: ['HTML', 'CSS Grid', 'Responsivo'],
    description:
      'Página de apresentação do CodeCam para o Challenge JOVI, feita só com HTML e CSS: o problema, a solução, a galeria de telas do app e a equipe, com CSS Grid e layout para celular, tablet e desktop.',
  },
]

// Repositórios de fora da minha conta (ex.: de organizações) que também entram na lista
export const EXTRA_REPOSITORIES = ['Code-Cam-Solutions/code-cam-APP']

// Só estes repositórios aparecem no site, nesta ordem. Os dados vêm da API do GitHub;
// para mostrar outro, acrescente o nome do repositório aqui
export const SHOWN_REPOSITORIES = [
  'Portifolio',
  'fastapi-auth-db-api',
  'LandingPage-CodeCam',
  'code-cam-APP',
  'WatchNext',
  'Bootstrap-Tailwind-e-React',
]
