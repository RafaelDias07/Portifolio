import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { ThemeProvider } from '@/contexts/ThemeContext'
import '@/styles/global.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Elemento #root não encontrado no index.html')
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
