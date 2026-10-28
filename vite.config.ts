import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

// No `npm run dev` não existe a Vercel: este plugin atende POST /api/contact chamando
// a mesma função de api/contact.ts, para o formulário funcionar localmente
function vercelApiInDev(): Plugin {
  return {
    name: 'vercel-api-in-dev',
    apply: 'serve',
    configureServer(server) {
      // Variáveis sem prefixo VITE_ (como RESEND_API_KEY) só existem no servidor
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))

      server.middlewares.use('/api/contact', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end()
          return
        }

        const chunks: Buffer[] = []
        for await (const chunk of req) chunks.push(chunk as Buffer)

        const { POST } = await server.ssrLoadModule('/api/contact.ts')
        const response: Response = await POST(
          new Request('http://localhost/api/contact', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: Buffer.concat(chunks),
          }),
        )

        res.statusCode = response.status
        res.setHeader('content-type', 'application/json')
        res.end(await response.text())
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), vercelApiInDev()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // O chunk da cena 3D (Three.js, ~140 KB gzip) passa de 500 KB sem compressão,
    // mas é carregado sob demanda e não entra no pacote inicial
    chunkSizeWarningLimit: 600,
  },
})
