import styles from './ProgressBar.module.css'

type ProgressBarProps = {
  /** Texto lido pelo leitor de tela, ex.: "Carregando projetos" */
  label: string
}

// Barra de progresso indeterminada, com os blocos verdes do XP
export function ProgressBar({ label }: ProgressBarProps) {
  return (
    <div className={styles.track} role="progressbar" aria-label={label}>
      <span className={styles.blocks} />
    </div>
  )
}
