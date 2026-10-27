// Projeto como o site mostra: junta os dados da API do GitHub com o nome e a
// descrição escritos à mão em src/content/projects.ts
export type Project = {
  /** Usado na URL: /projetos/:slug (é o nome do repositório) */
  slug: string
  name: string
  description: string | null
  language: string | null
  /** Data do último push; null em projeto cadastrado à mão */
  updatedAt: string | null
  stars: number | null
  topics: string[]
  /** null quando o repositório é privado */
  codeUrl: string | null
  siteUrl: string | null
  /** Aviso extra no card e no detalhe (ex.: repositório privado) */
  note: string | null
}
