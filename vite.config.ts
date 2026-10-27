import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
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
