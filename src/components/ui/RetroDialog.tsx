import { type ReactNode, useId } from 'react'
import styles from './RetroDialog.module.css'

type RetroDialogProps = {
  title: string
  /** Ícone de informação desenhado em CSS, como nas caixas de aviso do Windows */
  showInfoIcon?: boolean
  children: ReactNode
  /** Botões da caixa; use a classe RETRO_BUTTON para o botão em relevo */
  actions?: ReactNode
}

// Caixa de diálogo do Windows clássico: fundo cinza com relevo, título em degradê azul.
// Fica no fluxo da página (não é modal), então não prende o foco do teclado.
export function RetroDialog({ title, showInfoIcon, children, actions }: RetroDialogProps) {
  const titleId = useId()

  return (
    <section className={styles.dialog} aria-labelledby={titleId}>
      <div className={styles.titleBar}>
        <h3 id={titleId} className={styles.title}>
          {title}
        </h3>
        <span className={styles.close} aria-hidden="true">
          ×
        </span>
      </div>
      <div className={styles.body}>
        {showInfoIcon && (
          <span className={styles.infoIcon} aria-hidden="true">
            i
          </span>
        )}
        <div className={styles.content}>{children}</div>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </section>
  )
}

export const RETRO_BUTTON = styles.button
