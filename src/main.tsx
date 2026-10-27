import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { queryClient } from '@/app/queryClient'
import { router } from '@/app/router'
import { ThemeProvider } from '@/contexts/ThemeContext'
import '@/styles/global.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Elemento #root não encontrado no index.html')
}

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
