# Portfólio — Rafael Dias

Portfólio interativo em React: um computador 3D numa cena espacial que, ao ser clicado, abre uma janela no estilo Windows XP com meus projetos, contato, galeria, player de música e dois jogos.

**Site:** https://portifolio-rafaeldias.vercel.app

> 🚧 **Em construção.** O projeto é desenvolvido em etapas diárias até 03/11/2026.

## Tecnologias

| Área              | Escolha                                                                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Base              | [Vite](https://vite.dev) + [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)                                         |
| Lint e formatação | [Biome](https://biomejs.dev)                                                                                                                    |
| Padrão de commits | [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) + [commitlint](https://commitlint.js.org) |
| Rotas             | [React Router](https://reactrouter.com): uma URL por aba, 404 dentro do monitor e página de erro                                                |
| Dados             | [TanStack Query](https://tanstack.com/query) (cache de 10 min dos projetos do GitHub) + [Zod](https://zod.dev) para validar as respostas        |
| 3D                | [Three.js](https://threejs.org), carregado sob demanda (fora do pacote inicial)                                                                 |
| CI                | GitHub Actions: commitlint, lint, testes dos hooks, tipos e build em todo PR                                                                    |
| Deploy            | [Vercel](https://vercel.com), publicação automática a cada push na `main`                                                                       |

Ainda vão entrar: React Hook Form, Supabase e Vitest + Testing Library.

## Como rodar

Pré-requisito: Node.js 22.22.1 ou mais novo (recomendado: 24).

```bash
git clone https://github.com/RafaelDias07/Portifolio.git
cd Portifolio
npm install
cp .env.example .env   # preencha os valores
npm run dev
```

O site abre em `http://localhost:5173`.

### Scripts

| Comando              | O que faz                                            |
| -------------------- | ---------------------------------------------------- |
| `npm run dev`        | servidor de desenvolvimento                          |
| `npm run build`      | checa os tipos e gera o build de produção em `dist/` |
| `npm run preview`    | serve o build localmente                             |
| `npm run lint`       | lint e formatação com o Biome (só verifica)          |
| `npm run format`     | corrige automaticamente o que o Biome conseguir      |
| `npm run typecheck`  | checa só os tipos                                    |
| `npm run test:hooks` | testa os hooks do harness de IA                      |

## Variáveis de ambiente

Todas estão listadas no [`.env.example`](.env.example). O `.env` fica fora do Git.

| Variável                 | Para quê                                  |
| ------------------------ | ----------------------------------------- |
| `VITE_GITHUB_USERNAME`   | usuário do GitHub de onde vêm os projetos |
| `VITE_SUPABASE_URL`      | URL do projeto no Supabase                |
| `VITE_SUPABASE_ANON_KEY` | chave pública (anon) do Supabase          |

## Estrutura de pastas

```
src/
├── app/          # App, rotas e providers globais
├── components/   # componentes reaproveitáveis (ui/ = peças base)
├── pages/        # uma página por rota
├── services/     # acesso a dados (GitHub, Supabase, e-mail)
├── hooks/        # hooks personalizados
├── contexts/     # tema e autenticação
├── types/        # tipos compartilhados
├── content/      # textos e links pessoais
├── styles/       # estilos globais e variáveis CSS
├── three/        # cena 3D
├── games/        # jogos (JavaScript)
└── assets/       # imagens
```

## Padrões do projeto

### Nomenclatura

- Componentes em `PascalCase`, um por arquivo: `ProjectCard.tsx` + `ProjectCard.module.css`
- Hooks começam com `use`: `useProjects.ts`
- Services terminam em `Service`: `githubService.ts`
- Código em inglês; textos da interface, comentários e commits em português
- Imports internos com o alias `@/`

### Branches (GitHub Flow)

- `main` protegida por um ruleset no GitHub: só recebe mudanças por pull request com o CI verde; push forçado e exclusão são bloqueados
- uma branch por funcionalidade: `feature/<nome>`, `fix/<nome>`, `chore/<nome>`, `docs/<nome>`, `test/<nome>`, `perf/<nome>`, `refactor/<nome>`
- toda branch volta para a `main` por pull request, com merge commit, para preservar o histórico

### Commits (Conventional Commits)

```
feat: adiciona validação do formulário de contato
fix(rotas): corrige 404 ao atualizar a página de projeto
chore: adiciona husky e commitlint
```

O commitlint recusa mensagens fora do padrão (título com no máximo 72 caracteres), e o lint-staged roda o Biome nos arquivos de cada commit. No pull request, o CI confere de novo todas as mensagens.

## Harness de IA

O projeto é desenvolvido com o [Claude Code](https://claude.com/claude-code). A configuração fica versionada no repositório. O ponto de partida é o [`AGENTS.md`](AGENTS.md), que explica o projeto inteiro (requisitos, stack e justificativas, arquitetura, padrões, fluxo de trabalho e o próprio harness) para qualquer agente de IA.

| Arquivo                                                                     | Função                                                                                                      |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [`AGENTS.md`](AGENTS.md)                                                    | fonte única de verdade do projeto para agentes e pessoas                                                    |
| [`.claude/CLAUDE.md`](.claude/CLAUDE.md)                                    | importa o `AGENTS.md` e explica o que é específico do Claude                                                |
| [`.claude/settings.json`](.claude/settings.json)                            | permissões e hooks                                                                                          |
| [`.claude/hooks/guard-bash.mjs`](.claude/hooks/guard-bash.mjs)              | barra commit/push na `main`, pular hooks, push forçado, comandos que descartam trabalho e leitura do `.env` |
| [`.claude/hooks/guard-bash.test.mjs`](.claude/hooks/guard-bash.test.mjs)    | 148 testes do hook (`npm run test:hooks`)                                                                   |
| [`.claude/hooks/format-file.mjs`](.claude/hooks/format-file.mjs)            | roda o Biome em todo arquivo que a IA edita                                                                 |
| [`.claude/skills/commit`](.claude/skills/commit/SKILL.md)                   | passo a passo para commitar no padrão                                                                       |
| [`.claude/skills/novo-componente`](.claude/skills/novo-componente/SKILL.md) | como criar componentes no padrão                                                                            |
| [`.claude/agents/revisor.md`](.claude/agents/revisor.md)                    | agente que revisa a branch antes do PR                                                                      |
| [`.claude/launch.json`](.claude/launch.json)                                | como subir o servidor no preview do app                                                                     |
