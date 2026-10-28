import styles from './Spinner.module.css'

// Indicador de "trabalhando" para botões; decorativo, o texto do botão diz o que acontece
export function Spinner() {
  return <span className={styles.spinner} aria-hidden="true" />
}
