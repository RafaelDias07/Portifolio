/** Aba da página de projetos onde o projeto aparece */
export type ProjectCategory = 'personal' | 'professional'

// Projeto como o site mostra: junta os dados da API do GitHub com o nome e a
// descrição escritos à mão em src/content/projects.ts
export type Project = {
  /** Nome do repositório: identifica o projeto na lista */
  slug: string
  name: string
  /** Emoji ao lado do nome */
  icon: string
  description: string | null
  tags: string[]
  category: ProjectCategory
  language: string | null
  /** Data do último push */
  updatedAt: string
  stars: number
  topics: string[]
  codeUrl: string
  siteUrl: string | null
}
