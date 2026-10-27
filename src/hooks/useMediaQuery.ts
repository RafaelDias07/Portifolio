import { useSyncExternalStore } from 'react'

// Acompanha uma media query do CSS (ex.: largura mínima, prefers-reduced-motion)
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
