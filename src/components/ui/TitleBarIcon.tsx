import type { ReactNode } from 'react'
import styles from './TitleBarButton.module.css'

type TitleBarIconProps = {
  variant?: 'default' | 'close'
  children: ReactNode
}

// Botão da barra de título só de enfeite (maximizar, fechar), para a janela ficar
// igual à do XP. Não é clicável e fica escondido dos leitores de tela
export function TitleBarIcon({ variant = 'default', children }: TitleBarIconProps) {
  return (
    <span className={styles.button} data-variant={variant} data-decorative aria-hidden="true">
      {children}
    </span>
  )
}
