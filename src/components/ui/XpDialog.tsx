import { type ReactNode, useId } from 'react'
import styles from './XpDialog.module.css'

type XpDialogProps = {
  title: string
  /** Ícone de informação (bola azul com "i"), desenhado em CSS como nas caixas do XP */
  showInfoIcon?: boolean
  children: ReactNode
  /** Botões da caixa (ex.: OK) */
  actions?: ReactNode
}

// Caixa de mensagem no estilo do Windows XP (tema Luna): barra de título azul arredondada,
// botão de fechar vermelho e corpo bege.
// Fica no fluxo da página (não é modal), então não prende o foco do teclado.
export function XpDialog({ title, showInfoIcon, children, actions }: XpDialogProps) {
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
