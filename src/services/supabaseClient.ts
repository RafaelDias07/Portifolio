import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// O schema "portfolio" separa as tabelas do portfólio das do CodeCam (AGENTS.md seção 4.5)
function createPortfolioClient(url: string, key: string) {
  return createClient(url, key, { db: { schema: 'portfolio' } })
}

let client: ReturnType<typeof createPortfolioClient> | null = null

// Cliente do Supabase, criado na primeira vez que é usado. Só o dashboard importa este
// arquivo, então o supabase-js fica fora do pacote inicial do site.
export function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      'Supabase não configurado: faltam VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.',
    )
  }
  client ??= createPortfolioClient(SUPABASE_URL, SUPABASE_KEY)
  return client
}
