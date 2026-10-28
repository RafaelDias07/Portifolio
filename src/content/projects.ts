// Nome e descrição dos projetos. A chave é o nome do repositório no GitHub;
// o que não estiver aqui usa os dados do próprio GitHub.
// TODO(conteúdo): Rafael revisa os textos sugeridos abaixo.
export const PROJECT_TEXTS: Record<string, { name: string; description: string }> = {
  'CP4-Webdev-1ESPW': {
    name: 'WatchNext',
    description:
      'Descubra o que assistir pelo seu humor e pelo tempo que você tem. React 19 com a API do TMDB e lista pessoal salva no navegador. Projeto em grupo.',
  },
  'CP5-Frontend': {
    name: 'Bootstrap, Tailwind e React',
    description:
      'Três sites, uma ferramenta em cada: página de café com Bootstrap, o ateliê de livros "Fio & Prensa" com Tailwind e uma landing page animada do Homem-Aranha em React.',
  },
  'code-cam': {
    name: 'CodeCam',
    description:
      'Fotografe a lousa ou o caderno e receba resumo, tópicos e flashcards gerados por IA. Acessibilidade no centro: fonte OpenDyslexic, alto contraste e leitura em voz alta. Projeto em equipe com React, NestJS e PostgreSQL.',
  },
  'LandingPage-CodeCam': {
    name: 'CodeCam — Landing Page',
    description:
      'Página de apresentação do CodeCam para o Challenge JOVI, feita só com HTML e CSS: o problema, a solução, a galeria de telas do app e a equipe, com CSS Grid e layout para celular, tablet e desktop.',
  },
  'CP4-Frontend-1ESPW': {
    name: 'Grid & Responsividade',
    description:
      'Página feita só com HTML e CSS Grid, que se adapta do celular ao desktop: banner, galeria de fotos, depoimentos e contato. Projeto em dupla.',
  },
}

// Repositórios de fora da minha conta (ex.: de organizações) que também entram na lista
export const EXTRA_REPOSITORIES = ['Code-Cam-Solutions/code-cam']

// Ordem dos destaques no topo da lista (os demais vêm depois, do mais recente)
export const FEATURED_SLUGS = [
  'code-cam',
  'LandingPage-CodeCam',
  'CP4-Webdev-1ESPW',
  'CP5-Frontend',
  'CP4-Frontend-1ESPW',
]
