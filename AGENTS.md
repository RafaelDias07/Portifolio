# AGENTS.md — Portfólio Rafael Dias

Este arquivo é a **fonte única de verdade** do projeto para qualquer agente de IA (Claude Code, Codex, Cursor, Copilot, Gemini) e para qualquer pessoa que mexa no código. Ele explica o que o projeto é, por que cada decisão foi tomada, como o código é organizado e como trabalhar nele.

**Regras de leitura:**

- Leia este arquivo inteiro antes da primeira alteração de cada sessão.
- Se um pedido conflitar com uma regra daqui, **pare e pergunte** antes de agir. Não "resolva" o conflito sozinho.
- Se uma decisão nova for tomada (dependência, padrão, rota), **atualize este arquivo no mesmo PR**.
- Itens marcados como _planejado_ ainda não existem no código: siga o plano descrito quando for implementá-los.

---

## 1. O projeto

Portfólio pessoal de **Rafael Dias**, desenvolvedor front-end (com foco também em IA) e estudante de Engenharia de Software na FIAP, feito em React.

**A experiência:**

1. O site abre numa **cena 3D no espaço**, com estrelas e um computador antigo flutuando.
2. A câmera dá uma volta e para em frente ao monitor; a **janela no estilo Windows XP** aparece encaixada na tela dele. O botão **Câmera livre** deixa girar a cena com o mouse.
   No celular a janela ocupa a tela inteira e a cena 3D só é baixada quando o visitante toca em **Câmera livre**.
3. A janela tem abas: apresentação, habilidades, **projetos (vindos da API do GitHub)**, contato e multimídia (galeria de fotos, player de música e dois jogos: **Fox 64**, de nave, e **B-Zero 64**, de corrida).
4. O dono do site tem um **dashboard protegido por login** para ler as mensagens do contato e escolher os projetos em destaque.

**Contexto da entrega:** atividade CP3 da faculdade ("Portfolio — Stack e Harness Engineering"). Entrega em **03/11/2026**:

- repositório público no GitHub, com histórico de commits distribuído ao longo do prazo;
- site publicado na Vercel: **https://portifolio-rafaeldias.vercel.app** (deploy automático a cada push na `main`);
- vídeo de até 8 minutos, simulando uma entrevista técnica, explicando a stack, as justificativas e este harness de IA.

O dono do projeto precisa conseguir **explicar cada linha** no vídeo. Por isso: código simples e legível vale mais que código esperto; toda decisão precisa ter uma justificativa registrada na seção 3.

**Comandos** (Node 22.22.1 ou mais novo):

```bash
npm ci                # instala exatamente o que está no package-lock.json
npm run dev           # servidor local em http://localhost:5173
npm run build         # checa os tipos e gera o build em dist/
npm run lint          # Biome: lint + formatação (só verifica)
npm run format        # Biome: corrige o que der automaticamente
npm run typecheck     # só os tipos
npm run test:hooks    # testes dos hooks do harness de IA
```

---

## 2. Requisitos obrigatórios e onde cada um vive

Todos são obrigatórios. Esta tabela é o checklist do projeto: nada é "pronto" sem cumprir a linha correspondente.

| #   | Requisito                                                                                                                                             | Como atendemos                                                                                                                                                              | Onde no código                                              | Status                                          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------- |
| 1   | Rotas: link próprio por projeto, 404 amigável, página de erro de API, link compartilhado abre certo ao atualizar                                      | React Router; `vercel.json` reescreve tudo para `index.html`; 404 como página "File not found" num navegador antigo dentro do monitor; erro de API como caixa de erro do XP | `src/app/router.tsx`, `src/pages/`, `vercel.json`           | ✅ feito                                        |
| 2   | Estados: carregando, erro e vazio em todo dado de API; indicador visual; botão de enviar travado durante o envio                                      | TanStack Query (`isPending`, `isError`, lista vazia); skeleton e barra de progresso no estilo XP; `disabled` + spinner no envio                                             | `src/components/ui/`, `src/hooks/`                          | ✅ feito                                        |
| 3   | Projetos pela API do GitHub, sem cadastro manual; card com descrição, linguagem e data da última atualização                                          | `githubService` + `useProjects`;    cache para não estourar o limite de requisições                                                                                         | `src/services/githubService.ts`, `src/hooks/useProjects.ts` | ✅ feito                                        |
| 4   | Formulário de contato: validação por campo com mensagem específica; mensagem enviada por e-mail e salva; feedback                                     | React Hook Form + Zod; mensagem salva no Supabase e enviada por e-mail ao dono                                                                                              | `src/components/ContactForm.tsx`, `api/contact.ts`          | ✅ código pronto; falta ligar Supabase e Resend |
| 5   | Dashboard: login com redirecionamento; mensagens com "marcar como respondida"; escolha dos destaques da home                                          | Supabase Auth; componente `ProtectedRoute`; tabelas `messages` e `featured_projects`                                                                                        | `src/pages/dashboard/`, `src/contexts/AuthContext.tsx`      | ✅ feito                                        |
| 6   | Tema claro/escuro salvo entre visitas                                                                                                                 | `ThemeContext` + `localStorage`; na primeira visita segue `prefers-color-scheme`                                                                                            | `src/contexts/ThemeContext.tsx`                             | ✅ feito                                        |
| 7   | Interface: responsiva (celular e desktop); componentes reaproveitados; identidade própria com 3D interativo                                           | CSS Modules + variáveis CSS; peças base em `components/ui/`; cena 3D que reage ao mouse                                                                                     | `src/components/ui/`, `src/three/`                          | ✅ feito (conteúdo pessoal pendente)            |
| 8   | Performance: Lighthouse mobile ≥ 80; imagens otimizadas e com lazy; 3D e dashboard sob demanda; sem layout shift; sem requisições repetidas ao GitHub | `React.lazy` + `Suspense`; WebP/AVIF com `width`/`height` e `loading="lazy"`; `staleTime` no TanStack Query                                                                 | todo o projeto (ver seção 8)                                | _contínuo; auditoria no dia 8_                  |
| 9   | Testes automatizados: validação do formulário e bloqueio do dashboard sem login (mínimo)                                                              | Vitest + Testing Library                                                                                                                                                    | `src/**/*.test.tsx`                                         | _planejado (dia 8)_                             |
| 10  | Deploy: URL pública; publicação automática a cada push na `main`                                                                                      | Integração Git da Vercel                                                                                                                                                    | Vercel + `vercel.json`                                      | ✅ deploy automático (`vercel.json` no dia 4)   |
| 11  | Versionamento: padrão de mensagem; branch por funcionalidade; padrões no README e nas instruções da IA                                                | Conventional Commits + commitlint (no commit e no CI); GitHub Flow com a `main` protegida                                                                                   | `commitlint.config.js`, `.husky/`, seção 6                  | ✅ feito                                        |
| 12  | Arquitetura: pastas com responsabilidade clara; lógica separada da apresentação; nomes definidos; padrão verificado automaticamente                   | Estrutura por tipo de arquivo; services + hooks; Biome no pre-commit, no hook da IA e no CI                                                                                 | `src/`, `biome.json`, seções 4 e 5                          | ✅ feito                                        |
| —   | Repositório: público; `.env` fora do Git com `.env.example`; README com projeto, tecnologias e como rodar                                             | `.gitignore`, `.env.example`, `README.md`                                                                                                                                   | raiz                                                        | ✅ feito (README final no dia 9)                |

---

## 3. Stack e justificativas

Cada linha registra **o que foi comparado, o critério e o que aceitamos perder**. É a base da parte "Justificativas da stack" do vídeo. Ao adicionar uma dependência nova, acrescente uma linha aqui no mesmo PR.

| Área              | Escolha                                                         | Comparamos com                     | Critério                                                                                                          | O que aceitamos perder                                                                 |
| ----------------- | --------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Base              | **Vite + React** (SPA)                                          | Next.js                            | Site sem necessidade de SSR; build e dev server rápidos; menos conceitos para explicar                            | SSR/SEO automático; precisamos configurar o rewrite de rotas na Vercel                 |
| Linguagem         | **TypeScript** (`strict`)                                       | JavaScript                         | Erros de formato de dados (GitHub, Supabase, formulário) aparecem no editor; a IA erra menos com tipos            | Um pouco mais de código no começo (tipos de props e de dados)                          |
| Lint e formatação | **Biome**                                                       | ESLint + Prettier                  | Uma ferramenta só, uma config só, muito mais rápida                                                               | O ecossistema de plugins do ESLint                                                     |
| Padrão de commits | **Husky + lint-staged + commitlint**                            | Só convenção escrita               | O padrão é **verificado**, não só combinado: commit fora do padrão é recusado                                     | Commits ficam alguns segundos mais lentos                                              |
| Fluxo de branches | **GitHub Flow**                                                 | Git Flow, trunk-based              | Projeto de uma pessoa, com deploy contínuo: uma `main` e branches curtas bastam                                   | As branches `develop`/`release` do Git Flow                                            |
| Estilo            | **CSS Modules + variáveis CSS**                                 | Tailwind, shadcn/ui, MUI           | O visual XP é todo customizado; bibliotecas de UI ajudariam pouco e brigariam com o estilo                        | Utilitários e componentes prontos                                                      |
| 3D                | **Three.js imperativo** dentro de um componente React           | React Three Fiber, Spline          | A cena e os jogos são código Three.js imperativo; envolvê-los num componente é mais simples que reescrever        | O estilo declarativo do R3F                                                            |
| Rotas             | **React Router**                                                | TanStack Router, wouter            | Padrão de mercado, documentação ampla, rotas aninhadas para o dashboard                                           | A tipagem forte de rotas do TanStack Router                                            |
| Dados de API      | **TanStack Query**                                              | SWR, `useEffect` + `useState`      | Cache entre páginas (sem refazer chamadas ao GitHub), estados de carregamento/erro prontos                        | Mais uma dependência (~13 KB gzip)                                                     |
| Formulário        | **React Hook Form + Zod**                                       | Formik + Yup, validação manual     | Menos re-renderizações; o schema Zod gera os tipos e as mensagens de erro                                         | Curva de aprendizado de duas bibliotecas                                               |
| Validação         | **`zod/mini`** (a versão enxuta do Zod 4)                       | `zod` completo, Valibot            | Mesmo Zod, mas só entra no pacote o que é usado: o JS inicial caiu de 139 KB para 121 KB gzip                     | A sintaxe encadeada (`z.string().nullable()` vira `z.nullable(z.string())`)            |
| Backend           | **Supabase** (mensagens, destaques e login do dashboard)        | Firebase, PocketBase, Node próprio | Postgres + Auth + regras de acesso (RLS) num serviço grátis, sem manter servidor                                  | Dependência de um serviço externo                                                      |
| Login             | **`@supabase/supabase-js`** (só no chunk de `/painel`)          | Chamar a API de Auth com `fetch`   | Login, sessão salva e renovação do token prontos e testados; a leitura pública dos destaques continua com `fetch` | ~50 KB gzip, mas só para quem abre o painel                                            |
| Testes            | **Vitest + Testing Library** _(planejado)_                      | Jest, Playwright                   | Roda com a mesma config do Vite; testa como o usuário usa a tela                                                  | Testes ponta a ponta em navegador real                                                 |
| E-mail            | **Resend**, chamado por uma função da Vercel (`api/contact.ts`) | EmailJS, Edge Function do Supabase | A chave fica só no servidor; a mesma função valida, salva e manda o e-mail; plano grátis basta                    | O remetente de teste (`onboarding@resend.dev`) só envia para o e-mail do dono da conta |
| Deploy            | **Vercel**                                                      | Netlify, GitHub Pages              | Pedido da atividade; deploy automático por push e preview por PR                                                  | Controle fino de servidor                                                              |
| Testes do harness | **`node:test`** (test runner nativo do Node)                    | Vitest, Jest                       | Os hooks são scripts `.mjs` soltos; o runner nativo testa sem dependência nem configuração                        | Relatórios e modo watch mais completos                                                 |

---

## 4. Arquitetura

### 4.1 Visão geral

```
navegador
   │
main.tsx ──► ThemeProvider ──► QueryClientProvider ──► RouterProvider   (AuthProvider só em /painel)
                       │
                     Router ──► Layout "Desktop"
                                  ├── Scene3D (lazy)        → src/components/Scene3D.tsx → src/three/
                                  └── XpWindow              → src/components/XpWindow.tsx (peças de ui/)
                                        └── páginas (abas)  → src/pages/
                                              │
                                            hooks (useProjects, useContactForm…)
                                              │
                                            services (githubService, contactService…)
                                              │
                              API do GitHub (REST)  ·  Supabase (Postgres + Auth)
```

### 4.2 Fluxo de dados

1. A **página** monta componentes e chama um **hook**.
2. O **hook** usa o TanStack Query (`useQuery`/`useMutation`) e chama uma função de **service**.
3. O **service** faz a chamada (`fetch` ou cliente do Supabase), trata o HTTP e devolve **dados tipados** (tipos em `src/types/`).
4. O componente recebe `{ data, isPending, isError }` e renderiza **carregando, erro, vazio ou conteúdo**.
5. O cache do TanStack Query guarda o resultado: ao voltar para uma página, os dados aparecem sem nova chamada.

### 4.2.1 Projetos

- `useProjects` / `useProject(slug)` buscam os repositórios uma vez por sessão (`githubService`) e montam a lista com `buildProjects`, que junta três fontes de `src/content/projects.ts`:
  - `PROJECT_TEXTS`: lista com nome e descrição escritos à mão para cada repositório (campo `repo`) (o resto usa os dados do GitHub);
  - `EXTRA_REPOSITORIES`: repositórios de fora da conta (ex.: `Code-Cam-Solutions/code-cam-APP`), buscados pela API em paralelo; se um falhar, só ele some da lista;
  - `SHOWN_REPOSITORIES`: **só estes repositórios aparecem**, nesta ordem; os dados de cada um continuam vindo da API.
- Os componentes recebem o tipo `Project` (`src/types/project.ts`), não o formato cru da API.
- Destaques: o dashboard escolhe quais destes ficam em destaque (tabela `featured_projects`). `useFeaturedProjects` lê a tabela com `fetch` (`featuredService`, sem o `supabase-js`) e `buildProjects` põe os destaques primeiro, com o selo "★ Destaque". A página inicial lista só os destaques (`FeaturedProjects`). Se a leitura falhar, a lista aparece sem destaques.

### 4.2.3 Dashboard (`/painel`)

1. A rota `painel/*` carrega com `React.lazy` o `DashboardApp` (`src/pages/dashboard/`), um chunk com o login, o painel e o `supabase-js`. Ele tem as rotas internas `login` e a inicial.
2. `AuthProvider` (`src/contexts/AuthContext.tsx`) assina `onAuthChange` do `authService`: o Supabase devolve a sessão salva no navegador e avisa quando ela muda.
3. `ProtectedRoute` mostra uma barra de progresso enquanto a sessão é lida; sem sessão, redireciona para `/painel/login` guardando a página de origem, e o login volta para ela.
4. O painel usa `dashboardService` (cliente do Supabase com o schema `portfolio`): lista as mensagens, marca como respondida e salva os destaques pela função `set_featured_projects` (troca a lista numa transação só).
5. A segurança está no banco (`supabase/migrations/002_dashboard.sql`): as políticas usam `portfolio.is_owner()`, que compara o e-mail do login com o do dono. Estar logado não basta, porque o projeto Supabase é compartilhado com o CodeCam.

### 4.2.2 Fluxo do contato

1. `ContactForm` (apresentação) usa o hook `useContactForm`: React Hook Form + `zodResolver(contactSchema)` validam cada campo; o envio é um `useMutation`.
2. `contactService.sendContactMessage` faz `POST /api/contact`.
3. A função `api/contact.ts` (Vercel, servidor) **valida de novo** com o mesmo `contactSchema`, salva em `portfolio.messages` pela API REST do Supabase e manda o e-mail pelo Resend para `CONTACT_EMAIL` (`src/content/contact.ts`; não é segredo, já aparece no site). Se o e-mail falhar, a mensagem já está salva e aparece no dashboard.
4. Campo escondido `trap` é uma armadilha para robôs: se vier preenchido, a função responde sucesso e não salva nada.
5. No `npm run dev`, o plugin `vercelApiInDev` do `vite.config.ts` atende `/api/contact` com a mesma função.
6. O schema, a tabela, as permissões e as regras de acesso estão em `supabase/migrations/001_messages.sql`.

### 4.3 Pastas e responsabilidades

| Pasta                | Responsabilidade                                                       | Pode importar                                 | Não pode                                  |
| -------------------- | ---------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------- |
| `src/app/`           | `App`, rotas, providers globais                                        | tudo                                          | —                                         |
| `src/pages/`         | uma página por rota; só compõe                                         | `components`, `hooks`, `types`, `content`     | chamar `services` direto                  |
| `src/components/`    | blocos de uma área (lista de projetos, formulário)                     | `components/ui`, `hooks`, `contexts`, `types` | chamar `fetch`/Supabase; importar `pages` |
| `src/components/ui/` | peças base reaproveitadas (Button, Window, Card, Skeleton, Spinner)    | só React, estilos e `types`                   | hooks de dados, `services`                |
| `src/hooks/`         | estado, efeitos e acesso a dados via TanStack Query                    | `services`, `types`, `content`                | JSX de página                             |
| `src/services/`      | comunicação com APIs; funções puras assíncronas                        | `types`, `lib` de clientes                    | React (nada de hooks)                     |
| `src/contexts/`      | estado global: tema e autenticação                                     | `services`, `types`                           | —                                         |
| `src/types/`         | tipos compartilhados (`Repository`, `ContactMessage`)                  | nada                                          | —                                         |
| `src/content/`       | textos pessoais (`profile.ts`) e dos projetos (`projects.ts`)          | nada                                          | —                                         |
| `src/styles/`        | `global.css` com reset e **tokens** (variáveis CSS)                    | —                                             | —                                         |
| `src/three/`         | cena 3D (computador, estrelas, câmera) em Three.js (seção 10)          | `three`                                       | React                                     |
| `src/games/`         | jogos em JavaScript (ver seção 10)                                     | `three`                                       | —                                         |
| `src/assets/`        | imagens importadas pelo código                                         | —                                             | —                                         |
| `api/`               | funções serverless da Vercel (rodam no servidor, com segredos)         | `src/types` (com caminho relativo e `.js`)    | React; o alias `@/`                       |
| `supabase/`          | SQL das tabelas e regras de acesso (RLS), rodado no painel do Supabase | —                                             | —                                         |

Arquivos estáticos que não passam pelo bundler (favicon, `robots.txt`) ficam em `public/`.

### 4.4 Rotas (`src/app/router.tsx`)

| Rota              | Página                               | Observação                                          |
| ----------------- | ------------------------------------ | --------------------------------------------------- |
| `/`               | apresentação (aba inicial da janela) | cena 3D ao fundo                                    |
| `/habilidades`    | tecnologias e níveis                 |                                                     |
| `/projetos`       | lista de projetos do GitHub          | destaques escolhidos no dashboard aparecem primeiro |
| `/projetos/:slug` | detalhe do projeto                   | `slug` = nome do repositório                        |
| `/contato`        | formulário                           |                                                     |
| `/multimidia`     | player e jogos                       | cada jogo é um chunk, baixado ao clicar em Jogar    |
| `/painel/login`   | login do dono                        | quem já está logado vai para `/painel`              |
| `/painel`         | dashboard protegido                  | sem login → `/painel/login`                         |
| `*`               | 404 "File not found"                 | dentro do monitor, num navegador antigo             |
- As rotas do portfólio são filhas do `DesktopLayout` (`src/app/DesktopLayout.tsx`): a cena 3D e a janela ficam montadas e só o `<Outlet />` troca. As abas são `NavLink` (`src/components/WindowNav.tsx`), com `aria-current="page"` na atual.
- A 404 é filha do layout com `handle: { ownWindow: true }`: o `DesktopLayout` não desenha a janela XP e a página mostra a própria janela (o "Rafael_OS Explorer"), então a cena 3D continua ao fundo.
- Cada página define o próprio `<title>` (React 19 leva a tag para o `<head>`).
- Erros: uma página que quebra cai no `errorElement` (`ErrorPage`, caixa de erro do XP); erro de API aparece dentro da página com o `ErrorDialog` e o botão "Tentar de novo".
- `vercel.json` reescreve toda URL (menos `/api/`) para o `index.html`, então atualizar ou abrir um link direto funciona.

### 4.5 Dados no Supabase (schema `portfolio`)

O projeto Supabase é compartilhado com o CodeCam, cujas tabelas (Prisma) ficam no schema `public`. Tudo do portfólio fica no schema **`portfolio`**, para não misturar nem ser afetado pelas migrações do Prisma. Por isso:

- o schema precisa estar em **Project Settings > Data API > Exposed schemas**;
- chamadas REST mandam o cabeçalho `Content-Profile: portfolio` (escrita) ou `Accept-Profile: portfolio` (leitura);
- o cliente do Supabase (`src/services/supabaseClient.ts`) é criado com `{ db: { schema: 'portfolio' } }`.


| Tabela                        | Colunas                                                           | Acesso (RLS)                                                             |
| ----------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `portfolio.messages`          | `id`, `name`, `email`, `message`, `answered` (bool), `created_at` | qualquer visitante **insere**; só o dono (`is_owner()`)**lê e atualiza** |
| `portfolio.featured_projects` | `repo_name`, `position`, `updated_at`                             | qualquer visitante **lê**; só o dono **altera**                          |

---

## 5. Convenções de código

### 5.1 Nomes

| O quê                      | Padrão                        | Exemplo                    |
| -------------------------- | ----------------------------- | -------------------------- |
| Componente (e seu arquivo) | `PascalCase`, um por arquivo  | `ProjectCard.tsx`          |
| Estilo do componente       | CSS Module com o mesmo nome   | `ProjectCard.module.css`   |
| Hook                       | `use` + `camelCase`           | `useProjects.ts`           |
| Service                    | `camelCase` + `Service`       | `githubService.ts`         |
| Tipo / interface           | `PascalCase`, sem prefixo `I` | `Repository`               |
| Props                      | `<Componente>Props`           | `ProjectCardProps`         |
| Constante global           | `UPPER_SNAKE_CASE`            | `GITHUB_USERNAME`          |
| Variável CSS               | `--<categoria>-<nome>`        | `--color-bg`, `--space-md` |
| Teste                      | arquivo testado + `.test`     | `ContactForm.test.tsx`     |

**Idioma:** identificadores no código em **inglês**; textos da interface, comentários e commits em **português**.

**Propriedades de objetos e tipos** em `camelCase`. `snake_case` só quando o nome vem de fora (ex.: `pushed_at` da API do GitHub, colunas do Supabase); o Biome aceita os dois e recusa o resto.

### 5.2 TypeScript

- `strict` ligado. **`any` é erro** (Biome). Use `unknown` e estreite o tipo.
- Props com `type <Nome>Props = { … }`.
- Dados externos (GitHub, Supabase, formulário) sempre têm um tipo em `src/types/`. Valide com Zod o que vem de fora quando fizer sentido, importando de `zod/mini` e tirando o tipo do schema (`z.infer`), como em `src/types/github.ts`.
- As variáveis `VITE_*` são tipadas em `src/vite-env.d.ts` (o único arquivo em que o Biome aceita nomes em `UPPER_SNAKE_CASE` nas propriedades, por um `override` no `biome.json`).
- Evite `!` (non-null assertion). Trate o caso nulo.
- Imports internos com `@/` (`@/components/ui/Button`), nunca `../../..`.
- Exports **nomeados**. `export default` só onde a ferramenta exige (configs, `React.lazy`).

### 5.3 React

- Só componentes de função e hooks.
- **Lógica fora da apresentação:** componente visual não chama `fetch` nem Supabase.
- Componente com mais de ~150 linhas ou com duas responsabilidades → divida.
- Antes de criar botão, card, janela ou campo, **procure em `components/ui/`**.
- `key` estável em listas (id ou nome do repositório, nunca o índice).
- `useMemo`/`memo` só quando houver um problema de desempenho medido.
- Tudo que é pesado (cena 3D, jogos, dashboard) entra com `React.lazy` + `Suspense`.

O padrão de referência para dados de API:

```ts
// src/services/githubService.ts — só comunicação, sem React
export async function fetchRepositories(username: string): Promise<Repository[]> {
  const response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed`)
  if (!response.ok) throw new Error(`GitHub respondeu ${response.status}`)
  return response.json()
}
```

```ts
// src/hooks/useProjects.ts — estado e cache
export function useProjects() {
  return useQuery({
    queryKey: ['repos', GITHUB_USERNAME],
    queryFn: () => fetchRepositories(GITHUB_USERNAME),
    staleTime: 10 * 60 * 1000, // 10 min sem refazer a chamada
  })
}
```

```tsx
// src/components/ProjectList.tsx — só apresentação, com os 3 estados
export function ProjectList() {
  const { data, isPending, isError, refetch } = useProjects()

  if (isPending) return <ProjectListSkeleton />
  if (isError)
    return <ErrorDialog message="Não foi possível carregar os projetos." onRetry={refetch} />
  if (data.length === 0) return <EmptyState message="Nenhum projeto público ainda." />

  return (
    <ul>
      {data.map((repo) => (
        <ProjectCard key={repo.id} repo={repo} />
      ))}
    </ul>
  )
}
```

### 5.4 CSS

- CSS Modules ao lado do componente. Estilos globais só em `src/styles/global.css`.
- Cores, fontes, espaçamentos e sombras vêm de **variáveis CSS** (tokens). Nada de cor solta no meio do código.
- O tema escuro troca os valores das variáveis (`[data-theme='dark']`), não reescreve componentes.
- Mobile-first: estilo base para celular; `@media (min-width: …)` para telas maiores.
- Unidades `rem` para texto e espaçamento; evite `!important`.
- Teste em **375 px** e **1440 px** de largura.
- Pontos de quebra do layout: até `40rem` a janela ocupa a tela toda; de `40rem` a `64rem` ela fica com uma margem sobre o céu estrelado; a partir de `64rem` a cena 3D carrega e a janela é encaixada no monitor (o tamanho do texto acompanha a altura dela, com `cqh`).
- Em telas de toque (`pointer: coarse`), botões e abas têm pelo menos 2,5rem de altura.
- O tema é aplicado por um script no `index.html` antes da primeira pintura (sem piscar), e o `ThemeContext` assume a partir daí. A chave no `localStorage` é `theme`.

### 5.5 Acessibilidade

- Imagens com `alt` (vazio só se for decorativa).
- `<button>` para ações; `<a>`/`<Link>` para navegação.
- Campos de formulário com `<label>`; erros ligados ao campo com `aria-describedby`.
- Foco visível em tudo que é clicável; a janela XP precisa funcionar só com teclado.
- Respeite `prefers-reduced-motion` nas animações e na câmera 3D.

### 5.6 Comentários

Comente o **porquê**, não o quê. Em português. Sem código comentado "para depois": apague, o Git guarda.

---

## 6. Git: branches, commits e pull requests

### 6.1 Branches (GitHub Flow)

- A `main` é **protegida** por um ruleset no GitHub: só recebe mudanças por pull request, com o check **"Lint, tipos e build"** verde e merge do tipo merge commit; push forçado e exclusão são bloqueados. Ela é sempre publicável, e todo merge nela gera um deploy na Vercel.
- Toda mudança nasce numa branch a partir da `main` atualizada:

| Prefixo     | Uso                                   | Exemplo             |
| ----------- | ------------------------------------- | ------------------- |
| `feature/`  | funcionalidade nova                   | `feature/dashboard` |
| `fix/`      | correção                              | `fix/rota-projeto`  |
| `chore/`    | configuração, dependências            | `chore/setup`       |
| `docs/`     | documentação                          | `docs/readme`       |
| `test/`     | testes                                | `test/formulario`   |
| `perf/`     | desempenho                            | `perf/imagens`      |
| `refactor/` | reorganização sem mudar comportamento | `refactor/services` |
- Nomes em minúsculas, com hífen, curtos.

### 6.2 Commits (Conventional Commits)

```
<tipo>(<escopo opcional>): <descrição em português, no presente, em minúsculas>

<corpo opcional: o porquê, em até 3 linhas>
```

| Tipo                     | Quando                                   |
| ------------------------ | ---------------------------------------- |
| `feat`                   | funcionalidade nova para quem usa o site |
| `fix`                    | correção de bug                          |
| `refactor`               | muda o código sem mudar o comportamento  |
| `style`                  | só formatação                            |
| `perf`                   | desempenho                               |
| `test`                   | testes                                   |
| `docs`                   | documentação                             |
| `build` / `ci` / `chore` | build, pipeline, configuração            |
| `revert`                 | desfaz um commit anterior                |

Bons: `feat: adiciona validação do formulário de contato` · `fix(rotas): corrige 404 ao atualizar /projetos/:slug` · `perf: carrega a cena 3d sob demanda`

Ruins: `update`, `ajustes`, `wip`, `Added form`, `feat: Adiciona…` (maiúscula), títulos com mais de 72 caracteres.

- **Um commit = uma mudança com sentido.** Vários commits pequenos são melhores que um grande.
- O commitlint (mensagem) e o lint-staged (Biome nos arquivos) rodam em **todo** commit. No PR, o CI roda o commitlint de novo em todos os commits da branch.

### 6.3 Pull requests

1. Antes de abrir: `npm run lint`, `npm run build`, `npm run test:hooks` (e `npm test`, quando houver testes) passando, e o agente `revisor` rodado.
2. Título no padrão Conventional Commits. Descrição com: o que muda, como testar, prints se mudou algo visual, e qual requisito da seção 2 atende.
3. O CI (commitlint, lint, testes dos hooks, tipos e build) precisa passar: o ruleset da `main` não deixa fazer merge sem ele.
4. Merge com **"Create a merge commit"** (não squash), para preservar os commits pequenos no histórico.
5. Apague a branch depois do merge.

### 6.4 Proibido

- Commitar direto na `main`.
- `--no-verify` para pular os hooks.
- `git push --force` e reescrever histórico já enviado.
- Commitar `.env`, chaves ou tokens.
- Alterar a data de commits.
- Adicionar `Co-Authored-By` ou assinatura de ferramenta de IA nas mensagens de commit ou de PR.

---

## 7. Definition of Done

Uma tarefa só está pronta quando:

- [ ] `npm run lint`, `npm run build` e `npm run test:hooks` passam (e `npm test`, quando houver testes).
- [ ] Todo dado de API mostra carregando, erro e vazio.
- [ ] Funciona em 375 px e em 1440 px, nos temas claro e escuro.
- [ ] Imagens novas em WebP/AVIF, com `width`/`height` e `loading="lazy"` (exceto a primeira dobra).
- [ ] Nada pesado entrou no pacote inicial sem `React.lazy`.
- [ ] Sem `console.log`, código comentado ou `TODO` sem dono.
- [ ] Commits no padrão, na branch certa.
- [ ] Este arquivo e o README atualizados, se a mudança alterou um padrão, rota, variável ou dependência.

---

## 8. Orçamento de performance

| Métrica                         | Meta                                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| Lighthouse mobile (performance) | **≥ 80** (obrigatório); objetivo 90                                                      |
| JavaScript inicial (gzip)       | ≤ 150 KB, **sem Three.js**                                                               |
| CLS (saltos de layout)          | < 0,1                                                                                    |
| Imagem individual               | ≤ 200 KB, em WebP/AVIF                                                                   |
| Chamadas ao GitHub              | uma por sessão: `staleTime` de 10 min, sem refazer ao trocar de página ou focar a janela |

Medido no dia 5: JS inicial com 122 KB gzip (React, React Router, TanStack Query e `zod/mini`). Fora dele: a cena 3D (140 KB) e a rota `/contato` com o React Hook Form (15 KB, `lazy` no `router.tsx`).

Como garantir:

- Cena 3D, jogos e dashboard em chunks separados (`React.lazy`). Abaixo de 64rem (1024 px) a cena 3D **não é baixada**: o fundo é um céu estrelado em CSS e o Three.js só carrega se o visitante tocar em **Câmera livre**. Por isso o Lighthouse mobile mede só o pacote inicial.
- Reservar espaço com `width`/`height` ou `aspect-ratio` em imagens, cards e skeletons.
- Conferir o tamanho dos chunks no `npm run build` a cada PR que adiciona dependência.

---

## 9. Segurança e segredos

- Segredos ficam no `.env`, fora do Git. O `.env.example` lista as variáveis **sem valores reais**.
- **Toda variável `VITE_*` vai para o navegador e é pública.** Nunca coloque com esse prefixo a `service_role` do Supabase, tokens do GitHub ou chaves de e-mail; esses só existem em ambiente de servidor.
- A proteção dos dados do Supabase vem das regras de acesso (RLS, seção 4.5), não de esconder a chave publishable.
- **Projeto compartilhado:** o Supabase é o mesmo do CodeCam. A chave publishable dá acesso de visitante a todos os schemas expostos na Data API, então as tabelas do CodeCam no `public` precisam ter RLS ligado para não ficarem abertas.
- **Risco conhecido:** `/api/contact` não tem limite de envios por IP. O campo-armadilha segura robôs simples; um ataque em loop poderia lotar o e-mail e a cota grátis do Resend. Aceito para um portfólio; se acontecer, a saída é um limite por IP (ex.: Vercel Firewall ou uma tabela de tentativas no Supabase).
- Agentes não leem, não imprimem, não copiam e não commitam o `.env`. Isso é garantido em três pontos: o `deny` do `.claude/settings.json` (ferramentas de leitura e edição), o hook `guard-bash` (comandos de terminal como `cat .env` e `git add -f .env`) e o `.gitignore`.

Variáveis atuais:

| Variável                        | Uso                                                           |
| ------------------------------- | ------------------------------------------------------------- |
| `VITE_GITHUB_USERNAME`          | usuário do GitHub de onde vêm os projetos                     |
| `VITE_SUPABASE_URL`             | URL do projeto Supabase                                       |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | chave publishable (`sb_publishable_...`, pública) do Supabase |
| `RESEND_API_KEY`                | **só servidor**: chave do Resend (e-mail)                     |

Na Vercel, todas ficam em Settings > Environment Variables. A função `api/contact.ts` lê `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` pelo `process.env`.

---

## 10. Cena 3D e jogos (`src/three/` e `src/games/`)

- São código **Three.js imperativo em JavaScript**. Ficam **fora do lint** do Biome (`files.includes` do `biome.json`) e não seguem as regras de React.
- **Não reescreva, renomeie ou "melhore"** esse código sem um pedido explícito. Mudanças de conteúdo (textos, nomes de personagens, imagens) são bem-vindas; mudanças de lógica, só quando pedidas.
- A integração com o React acontece num **único componente de ponte** por módulo, que fica em `src/components/` e importa de `@/three` ou `@/games` (ex.: `src/components/Scene3D.tsx`). Esse componente:
  1. cria a cena dentro de um `useEffect`, num `<div>`/`<canvas>` referenciado por `useRef`;
  2. **limpa tudo ao desmontar**: `cancelAnimationFrame`, remoção de listeners, `dispose()` de geometrias, materiais, texturas e do renderer;
  3. é carregado com `React.lazy`, fora do pacote inicial.
- Three.js vem do npm (`import * as THREE from 'three'`), nunca de CDN.
- A cena expõe uma API pequena, tipada em `src/three/index.d.ts`: `createScene({ container, overlay, title, initialMode, skipIntro, onFocusChange, onScreenClick })` devolve `{ setMode, dispose }`. A cada quadro em foco ela projeta os cantos da tela do monitor e escreve `left`/`top`/`width`/`height` no `overlay` (a janela XP); no `dispose` remove esses estilos.
- A tela do monitor é uma textura de canvas (`monitorScreen.js`), e não o `CSS3DRenderer` do projeto original: uma cena e um renderer a menos. Durante a abertura ela mostra uma caixa "Carregando..." no estilo do Windows XP (barra de blocos verdes), cuja barra enche junto com o voo da câmera (para em 95% até a câmera chegar); depois mostra a área de trabalho do Rafael_OS, vista na câmera livre. Só redesenha quando muda um bloco da barra.
- Com `prefers-reduced-motion`, o voo de abertura é pulado e a câmera já começa em foco.
- Na câmera livre aparece uma barra de tarefas do XP (`FreeCameraBar`): o botão verde "iniciar" com a bandeira do XP (`XpFlag`, SVG; marca da Microsoft, usada como homenagem) volta ao portfólio, e a bandeja mostra o relógio.
- Na câmera livre, clicar na tela do monitor (um `Raycaster` testa se o clique acertou a malha da tela) chama `onScreenClick`, que volta para o portfólio. Arrastar mais de 6 px conta como girar a cena, não como clique; o cursor vira mãozinha sobre a tela.
- Textos e dados pessoais (nomes, falas, legendas, playlist) ficam em arquivos de dados separados, para trocar sem mexer na lógica.

### Jogos (`src/games/`)

- **Fox 64** (`fox64/`, nave que defende o computador de ondas de meteoros) e **B-Zero 64** (`bzero64/`, corrida contra três rivais) foram portados do RetroOffice. Lá eles rodavam dentro da cena principal; aqui cada um é independente: cria o próprio renderer, cena, câmera e loop.
- Contrato em `src/games/types.d.ts`: `startGame({ container, player, onExit })` devolve `{ dispose }`. Todo HTML do jogo (HUD, menus, falas) e o CSS (um `<style>` com seletores dentro de `.fox64`/`.bzero64`) ficam dentro do `container`; nada vai para o `<body>` nem para o `window`.
- A lógica roda em passos fixos de 1/60 s, então a velocidade é a mesma em monitores de 60, 120 ou 144 Hz.
- Saída: botão "Sair", tecla Esc e "Voltar" nas telas finais chamam `onExit`; o React desmonta e o `dispose` cancela o loop e os timers, remove listeners, para o som e libera a GPU.
- Os sons são procedurais (Web Audio, `audio.js`, compartilhado pelos dois): nenhum arquivo de áudio.
- No Fox 64 só existe a nave de quem joga, sem seleção de piloto nem aliados; quem fala pelo rádio é a base (o computador). No B-Zero 64 o piloto é o Rafael (`GAME_PLAYER` em `src/content/media.ts`: nome e foto) e os rivais são personagens fictícios, com avatar em CSS. Nomes e falas ficam em `fox64/content.js` e `bzero64/content.js`. Nenhuma imagem nem texto pessoal do projeto original foi copiado.
- Ponte: `GameHost` (`src/components/GameHost.tsx`, um para os dois jogos) importa o jogo sob demanda, monta numa camada de tela cheia (portal no `<body>`, porque a janela XP fica presa ao monitor) e chama `dispose` ao sair. `MediaMenu` abre o `GameHost` com `React.lazy`.
- Em telas de toque (`pointer: coarse`) o botão "Jogar" fica desativado: os jogos precisam de teclado e mouse.

### Aba Multimídia (`/multimidia`)

- Igual à aba "Modo Livre" do RetroOffice, sem a galeria de fotos: `MediaMenu` mostra os ícones Música, Fox 64 e B-Zero 64. Música abre o `MusicPlayer` embaixo dos ícones; os jogos abrem em tela cheia.
- O player toca a `PLAYLIST` de `src/content/media.ts` pelo embed do YouTube (`youtube-nocookie.com`), criado só quando o visitante aperta play: até lá nenhum script ou cookie do YouTube entra na página.

---

## 11. Como um agente deve trabalhar

1. **Entender:** leia este arquivo e o pedido. Descubra em que etapa do cronograma (seção 13) o pedido se encaixa.
2. **Escopo do dia:** faça só a etapa pedida. Não adiante funcionalidades de outros dias.
3. **Branch:** saia da `main` atualizada para uma branch com o prefixo certo (seção 6.1).
4. **Planejar pequeno:** divida em passos que viram commits independentes.
5. **Implementar** seguindo as seções 4 e 5. Reaproveite `components/ui/` antes de criar.
6. **Validar:** lint, build, testes; abrir o site e conferir em 375 px e 1440 px.
7. **Commitar** em commits pequenos, no padrão (seção 6.2).
8. **Revisar:** rode o agente `revisor` e corrija o que ele apontar.
9. **Abrir o PR** conforme a seção 6.3.

**Pergunte antes de:**

- adicionar uma dependência (traga as alternativas, o critério e o que se perde, para a seção 3);
- mudar a arquitetura, as rotas ou o modelo de dados;
- mexer em deploy, CI, hooks ou segredos;
- escrever qualquer informação pessoal do Rafael (bio, cargo, empresas, fotos, links). **Nunca invente esses dados**: use um texto provisório marcado com `TODO(conteúdo)` e avise.

**Quando algo falhar** (hook, lint, build, teste): leia o erro, corrija a causa e tente de novo. Nunca desligue a verificação.

---

## 12. O harness de IA

O harness funciona em **camadas**: cada camada pega o que a anterior deixou passar.

| Camada             | Arquivo                                                            | O que faz                                                                                                                                                                                                          | Por quê                                                                 |
| ------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| 1. Instrução       | `AGENTS.md` (este arquivo)                                         | contexto e regras para qualquer agente                                                                                                                                                                             | padrão aberto, lido por Codex, Cursor, Copilot, Gemini e Claude Code    |
| 1. Instrução       | `.claude/CLAUDE.md`                                                | importa este arquivo e acrescenta o que é específico do Claude Code                                                                                                                                                | o Claude Code lê o `CLAUDE.md` automaticamente em toda sessão           |
| 2. Procedimentos   | `.claude/skills/commit/`                                           | passo a passo de commit no padrão                                                                                                                                                                                  | repetível: a IA segue o mesmo roteiro toda vez                          |
| 2. Procedimentos   | `.claude/skills/novo-componente/`                                  | como criar componente no padrão                                                                                                                                                                                    | garante o mesmo formato em todos os componentes                         |
| 2. Procedimentos   | `.claude/agents/revisor.md`                                        | agente que revisa a branch contra este arquivo antes do PR                                                                                                                                                         | uma segunda leitura, sem o viés de quem escreveu o código               |
| 3. Automação na IA | `.claude/settings.json`                                            | permissões: libera comandos de rotina, nega ler e editar o `.env` e suas variações                                                                                                                                 | menos interrupções e nenhum acesso a segredos                           |
| 3. Automação na IA | `.claude/hooks/guard-bash.mjs`                                     | analisa cada comando de terminal e bloqueia: commit, merge e push na `main`; pular hooks (`--no-verify`, `-n`, `HUSKY=0`, `core.hooksPath`); push forçado; comandos que descartam trabalho; ler ou copiar o `.env` | a regra de branches deixa de depender da memória da IA                  |
| 3. Automação na IA | `.claude/hooks/guard-bash.test.mjs`                                | 148 casos de teste do hook (o que bloqueia e o que deixa passar)                                                                                                                                                   | o próprio harness é testado e roda no CI                                |
| 3. Automação na IA | `.claude/hooks/format-file.mjs`                                    | roda o Biome em cada arquivo que a IA edita e devolve os erros para ela                                                                                                                                            | o código já sai no padrão, antes do commit                              |
| 3. Automação na IA | `.claude/launch.json`                                              | como subir o servidor de desenvolvimento no preview do app                                                                                                                                                         | a IA consegue abrir e conferir o site                                   |
| 4. Git hooks       | `.husky/`, `commitlint.config.js`, `lint-staged` no `package.json` | Biome nos arquivos e validação da mensagem em todo commit                                                                                                                                                          | vale para pessoas e para qualquer ferramenta de IA                      |
| 5. CI              | `.github/workflows/ci.yml`                                         | commitlint em todos os commits do PR, lint, testes dos hooks, tipos e build                                                                                                                                        | pega o que escapou localmente                                           |
| 6. GitHub          | ruleset da `main`                                                  | merge só por PR com o CI verde; sem push forçado nem exclusão                                                                                                                                                      | última barreira: nem pessoa nem IA publica na `main` sem passar pelo CI |

**Ferramenta e modelo:** Claude Code com Claude Opus. Escolhido por trabalhar direto no repositório (lê, edita, roda comandos e testa no navegador) e por suportar instruções, skills, agentes, hooks e MCPs versionados no projeto.

**Conectores (MCP)** _(planejado)_: Supabase (dia 5), para criar tabelas e regras de acesso direto pela IA. O GitHub é acessado pela CLI `gh`.

---

## 13. Cronograma e status

| Dia | Data  | Branch                            | Entrega                                                                     | Status                              |
| --- | ----- | --------------------------------- | --------------------------------------------------------------------------- | ----------------------------------- |
| 1   | 25/10 | `chore/setup`                     | Projeto base, Biome, Husky + commitlint, pastas, harness de IA, CI, README  | ✅                                  |
| 2   | 27/10 | `feature/cena-3d`                 | Cena 3D (computador e espaço) em React, sob demanda; deploy na Vercel       | ✅                                  |
| 3   | 27/10 | `feature/janela-xp`               | Janela XP com componentes reaproveitáveis, conteúdo, tema salvo, responsivo | ✅                                  |
| 4   | 27/10 | `feature/rotas`, `feature/github` | Rotas, `/projetos/:slug`, 404, projetos da API do GitHub com os 3 estados   | ✅                                  |
| 5   | 27/10 | `feature/contato`                 | Formulário validado, salvo no Supabase e enviado por e-mail                 | ✅ (falta ligar as contas)          |
| 6   | 28/10 | `feature/dashboard`               | Login, rota protegida, mensagens e destaques                                | ✅                                  |
| 7   | 28/10 | `feature/jogos`                   | Fox 64, B-Zero 64, galeria e player com conteúdo do Rafael                  | ✅ (sem galeria; faltam as músicas) |
| 8   | 01/11 | `test/…`, `perf/…`                | Testes automatizados e auditoria de performance                             | ⏳                                  |
| 9   | 02/11 | `docs/readme`                     | README final, revisão geral, vídeo                                          | ⏳                                  |
| —   | 03/11 | —                                 | Entrega                                                                     | ⏳                                  |

Ao concluir uma etapa, marque o status aqui e na seção 2 no mesmo PR.
