/// <reference types="vite/client" />

// Variáveis públicas do .env (todas vão para o navegador; ver AGENTS.md seção 9)
interface ImportMetaEnv {
  readonly VITE_GITHUB_USERNAME?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
