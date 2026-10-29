import { z } from 'zod/mini'

// Linhas da tabela portfolio.featured_projects; a ordem vem do próprio pedido (position)
export const featuredRowsSchema = z.array(z.object({ repo_name: z.string() }))
