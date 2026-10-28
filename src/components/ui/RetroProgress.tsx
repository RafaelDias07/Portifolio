import styles from './RetroProgress.module.css'

type RetroProgressProps = {
  /** Texto lido pelo leitor de tela, ex.: "Enviando a mensagem" */
  label: string
}

// Barra afundada com blocos azuis que vão enchendo, como nas cópias de arquivo do Windows
export function RetroProgress({ label }: RetroProgressProps) {
  return (
    <div className={styles.track} role="progressbar" aria-label={label}>
      <span className={styles.fill} />
    </div>
  )
}
