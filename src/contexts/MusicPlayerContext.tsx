import { createContext, type ReactNode, useContext, useState } from 'react'

type MusicPlayerContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null)

// Diz se a janela do player está aberta. Fica no layout, e não na aba Multimídia,
// para a música continuar tocando quando o visitante troca de aba
export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const value = { isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }
  return <MusicPlayerContext value={value}>{children}</MusicPlayerContext>
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (!context) throw new Error('useMusicPlayer precisa estar dentro de <MusicPlayerProvider>')
  return context
}
