import type { ReactNode } from 'react'
import styles from './GroupBox.module.css'

type GroupBoxProps = {
  title: string
  children: ReactNode
}

// Caixa com título, como os grupos de opções das janelas do XP
export function GroupBox({ title, children }: GroupBoxProps) {
  return (
    <section className={styles.group}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.body}>{children}</div>
    </section>
  )
}
