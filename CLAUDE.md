# Portfólio Rafael Dias — instruções do projeto

Portfólio pessoal em React: um computador 3D numa cena espacial que abre uma janela no estilo Windows XP com os projetos, o contato e os jogos. Os projetos vêm da API do GitHub, as mensagens e o login ficam no Supabase e o deploy é na Vercel.

## Stack

- Vite + React 19 + TypeScript (modo `strict`)
- Three.js para a cena 3D e os jogos (`src/three/` e `src/games/`, carregados sob demanda)
- Biome para lint e formatação; Husky + lint-staged + commitlint nos commits
- Planejado: React Router, TanStack Query, React Hook Form + Zod, Supabase, Vitest + Testing Library

## Comandos

```bash
npm run dev        # servidor local
npm run build      # checa os tipos e gera o build
npm run lint       # Biome: lint + formatação (só verifica)
npm run format     # Biome: corrige o que der automaticamente
npm run typecheck  # só os tipos
```

Antes de dizer que algo está pronto, rode `npm run lint` e `npm run build` e confira que os dois passam.

## Arquitetura

```
src/
├── app/            # App, rotas e providers globais
├── components/     # componentes visuais reaproveitáveis
│   └── ui/         # peças base: Button, Window, Card, Spinner...
├── pages/          # uma pasta/arquivo por rota; só monta componentes
├── services/       # acesso a dados: API do GitHub, Supabase, e-mail
├── hooks/          # hooks personalizados (lógica de estado e dados)
├── contexts/       # contextos globais (tema, autenticação)
├── types/          # tipos compartilhados
├── styles/         # estilos globais e tokens (variáveis CSS)
├── three/          # cena 3D (computador, estrelas, câmera)
├── games/          # jogos em JavaScript (Fox 64 e B-Zero 64)
└── assets/         # imagens importadas pelo código
```

Regras:

- **Lógica fora da apresentação.** Componentes visuais não chamam `fetch` nem o Supabase. Chamadas ficam em `services/`; estado e efeitos ficam em hooks (`hooks/`). O componente recebe dados por props ou por um hook.
- **Reaproveitar antes de criar.** Antes de criar um botão, card ou janela, procure em `components/ui/`. Todas as páginas usam os mesmos componentes base.
- **Componentes pequenos.** Se um componente passar de ~150 linhas ou fizer duas coisas, divida.
- **Pesado só sob demanda.** Cena 3D, jogos e dashboard entram com `React.lazy` + `Suspense`, nunca no pacote inicial.
- **Todo dado de API tem três estados na tela:** carregando, erro e lista vazia.
- `src/games/` é código JavaScript legado dos jogos: não reescreva nem "melhore" sem pedido explícito.

## Nomenclatura

- Código (variáveis, funções, componentes, tipos) em **inglês**; textos da interface, comentários e commits em **português**.
- Componentes em `PascalCase`, um por arquivo, com o mesmo nome: `ProjectCard.tsx`.
- Estilos com CSS Modules ao lado do componente: `ProjectCard.module.css`. Cores, fontes e espaçamentos vêm das variáveis de `styles/global.css`.
- Hooks começam com `use`, em `camelCase`: `useGithubRepos.ts`.
- Services em `camelCase` terminando em `Service`: `githubService.ts`.
- Tipos e interfaces em `PascalCase`, sem prefixo `I`: `Repository`, `ContactMessage`.
- Constantes globais em `UPPER_SNAKE_CASE`: `GITHUB_USERNAME`.
- Imports internos usam o alias `@/` (`@/components/ui/Button`), nunca `../../..`.
- Exports nomeados; evite `export default` (exceto onde a ferramenta exige, como `React.lazy` e configs).

## Git: branches e commits

Fluxo **GitHub Flow**:

1. A `main` é protegida e sempre publicável. Nunca commite direto nela.
2. Cada funcionalidade nasce numa branch a partir da `main`:
   - `feature/<nome>` funcionalidade nova (`feature/dashboard`)
   - `fix/<nome>` correção
   - `chore/<nome>`, `docs/<nome>`, `test/<nome>`, `perf/<nome>`, `refactor/<nome>`
3. A branch volta para a `main` por pull request, depois que o CI passa. O merge na `main` dispara o deploy na Vercel.

Commits seguem **Conventional Commits**, com a descrição em português, no presente e em minúsculas:

```
<tipo>(<escopo opcional>): <descrição curta>

feat: adiciona validação do formulário de contato
fix(rotas): corrige 404 ao atualizar a página de projeto
chore: adiciona husky e commitlint
docs: explica como rodar o projeto no readme
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.

- Um commit = uma mudança com sentido. Prefira vários commits pequenos a um grande.
- O commitlint e o lint-staged rodam em todo commit. **Nunca use `--no-verify`**; se o hook falhar, corrija a causa.
- Para commitar, siga a skill `commit` (`.claude/skills/commit/SKILL.md`).

## Variáveis de ambiente

Ficam no `.env` (fora do Git). O `.env.example` lista todas as variáveis necessárias, sem valores reais. Toda variável usada no front começa com `VITE_`. Nunca leia, imprima ou commite o `.env`.

## Ritmo de trabalho

O projeto é construído em etapas diárias, uma branch por etapa, até a entrega em 03/11. Faça só a etapa pedida na sessão; não adiante funcionalidades de outros dias.
