// Projeto como o site mostra: junta os dados da API do GitHub com o nome e a
// descrição escritos à mão em src/content/projects.ts
export type Project = {
  /** Usado na URL: /projetos/:slug (é o nome do repositório) */
  slug: string
  name: string
  description: string | null
  language: string | null
  /** Data do último push */
  updatedAt: string
  stars: number
  topics: string[]
  codeUrl: string
  siteUrl: string | null
}
