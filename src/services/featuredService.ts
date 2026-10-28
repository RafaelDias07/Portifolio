import { featuredRowsSchema } from '@/types/featured'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Nomes dos repositórios em destaque, na ordem escolhida no dashboard.
// Usa a API REST do Supabase com fetch, sem o supabase-js: esta leitura roda em toda
// visita, e o cliente completo só é baixado por quem abre o dashboard.
export async function fetchFeaturedRepoNames(): Promise<string[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return []

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/featured_projects?select=repo_name&order=position`,
    // Accept-Profile escolhe o schema "portfolio" (AGENTS.md seção 4.5)
    { headers: { apikey: SUPABASE_KEY, 'accept-profile': 'portfolio' } },
  )
  if (!response.ok) throw new Error(`O Supabase respondeu ${response.status}`)

  const rows = featuredRowsSchema.parse(await response.json())
  return rows.map((row) => row.repo_name)
}
