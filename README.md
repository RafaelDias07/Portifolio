# Portfólio — Rafael Dias

Portfólio interativo em React: um computador 3D numa cena espacial que, ao ser clicado, abre uma janela no estilo Windows XP com meus projetos, contato, galeria, player de música e dois jogos.

> 🚧 **Em construção.** O projeto é desenvolvido em etapas diárias até 03/11/2026.

## Tecnologias

| Área | Escolha |
|---|---|
| Base | [Vite](https://vite.dev) + [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| 3D e jogos | [Three.js](https://threejs.org) |
| Lint e formatação | [Biome](https://biomejs.dev) |
| Padrão de commits | [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged) + [commitlint](https://commitlint.js.org) |
| CI | GitHub Actions (lint + tipos + build em todo PR) |
| Deploy | [Vercel](https://vercel.com) |

Ainda vão entrar: React Router, TanStack Query, React Hook Form + Zod, Supabase e Vitest + Testing Library.

## Como rodar

Pré-requisito: Node.js 22 ou mais novo.

```bash
git clone <url-do-repositório>
cd <pasta-do-projeto>
npm install
cp .env.example .env   # preencha os valores
npm run dev
```

O site abre em `http://localhost:5173`.

### Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | checa os tipos e gera o build de produção em `dist/` |
| `npm run preview` | serve o build localmente |
| `npm run lint` | lint e formatação com o Biome (só verifica) |
| `npm run format` | corrige automaticamente o que o Biome conseguir |
| `npm run typecheck` | checa só os tipos |

## Variáveis de ambiente

Todas estão listadas no [`.env.example`](.env.example). O `.env` fica fora do Git.

| Variável | Para quê |
|---|---|
| `VITE_GITHUB_USERNAME` | usuário do GitHub de onde vêm os projetos |
| `VITE_SUPABASE_URL` | URL do projeto no Supabase |
| `VITE_SUPABASE_ANON_KEY` | chave pública (anon) do Supabase |

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
├── styles/       # estilos globais e variáveis CSS
├── three/        # cena 3D
├── games/        # jogos (JavaScript)
└── assets/       # imagens
```

## Padrões do projeto

### Nomenclatura

- Componentes em `PascalCase`, um por arquivo: `ProjectCard.tsx` + `ProjectCard.module.css`
- Hooks começam com `use`: `useGithubRepos.ts`
- Services terminam em `Service`: `githubService.ts`
- Código em inglês; textos da interface, comentários e commits em português
- Imports internos com o alias `@/`

### Branches (GitHub Flow)

- `main` protegida e sempre publicável; todo merge nela gera um deploy na Vercel
- uma branch por funcionalidade: `feature/<nome>`, `fix/<nome>`, `chore/<nome>`, `docs/<nome>`, `test/<nome>`, `perf/<nome>`
- toda branch volta para a `main` por pull request, com o CI passando

### Commits (Conventional Commits)

```
feat: adiciona validação do formulário de contato
fix(rotas): corrige 404 ao atualizar a página de projeto
chore: adiciona husky e commitlint
```

O commitlint recusa mensagens fora do padrão, e o lint-staged roda o Biome nos arquivos de cada commit.

## Harness de IA

O projeto é desenvolvido com o [Claude Code](https://claude.com/claude-code). A configuração fica versionada no repositório:

| Arquivo | Função |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | instruções do projeto: arquitetura, nomes, branches e commits |
| [`.claude/settings.json`](.claude/settings.json) | permissões e hooks |
| [`.claude/hooks/guard-git.mjs`](.claude/hooks/guard-git.mjs) | bloqueia commit na `main`, `--no-verify` e push forçado |
| [`.claude/hooks/format-file.mjs`](.claude/hooks/format-file.mjs) | roda o Biome em todo arquivo que a IA edita |
| [`.claude/skills/commit`](.claude/skills/commit/SKILL.md) | passo a passo para commitar no padrão |
| [`.claude/skills/novo-componente`](.claude/skills/novo-componente/SKILL.md) | como criar componentes no padrão |
| [`.claude/agents/revisor.md`](.claude/agents/revisor.md) | agente que revisa a branch antes do PR |
