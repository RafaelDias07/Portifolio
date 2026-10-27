import { type ReactNode, useId } from 'react'
import styles from './Window.module.css'

type WindowProps = {
  title: string
  icon?: ReactNode
  /** Botões da barra de título (minimizar, fechar…) */
  titleActions?: ReactNode
  toolbar?: ReactNode
  statusBar?: ReactNode
  children: ReactNode
}

// Moldura de janela no estilo Windows XP: barra de título, barra de ferramentas,
// conteúdo e barra de status. Ocupa 100% do elemento pai.
export function Window({ title, icon, titleActions, toolbar, statusBar, children }: WindowProps) {
  const titleId = useId()

  return (
    <section className={styles.window} aria-labelledby={titleId}>
      <header className={styles.titleBar}>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <h1 id={titleId} className={styles.title}>
          {title}
        </h1>
        {titleActions && <div className={styles.titleActions}>{titleActions}</div>}
      </header>

      {toolbar && <div className={styles.toolbar}>{toolbar}</div>}

      <div className={styles.body}>{children}</div>

      {statusBar && <footer className={styles.statusBar}>{statusBar}</footer>}
    </section>
  )
}
