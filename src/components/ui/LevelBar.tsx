import styles from './LevelBar.module.css'

type LevelBarProps = {
  label: string
  /** De 0 a 100 */
  value: number
}

// Barra de nível azul do XP, com o rótulo à esquerda e a porcentagem à direita
export function LevelBar({ label, value }: LevelBarProps) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      {/* A barra é só visual: o leitor de tela lê o rótulo e a porcentagem em texto */}
      <div className={styles.track} aria-hidden="true">
        <span className={styles.fill} style={{ width: `${value}%` }} />
      </div>
      <span className={styles.value}>{value}%</span>
    </div>
  )
}
