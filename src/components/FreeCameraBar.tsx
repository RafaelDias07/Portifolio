import { Clock } from '@/components/Clock'
import styles from './FreeCameraBar.module.css'

type FreeCameraBarProps = {
  onBack: () => void
}

// Barra de tarefas do Windows XP mostrada na câmera livre: o botão "iniciar" volta para o
// portfólio, o meio traz as dicas de controle e a bandeja mostra o relógio
export function FreeCameraBar({ onBack }: FreeCameraBarProps) {
  return (
    <nav className={styles.taskbar} aria-label="Câmera livre">
      <button
        type="button"
        className={styles.start}
        onClick={onBack}
        // biome-ignore lint/a11y/noAutofocus: a janela some; o foco precisa ir para a única ação disponível
        autoFocus
      >
        <span className={styles.flag} aria-hidden="true" />
        Voltar ao portfólio
      </button>

      <p className={styles.hint}>
        <span className={styles.hintDesktop}>
          Arraste para girar · role para dar zoom · clique na tela do monitor para voltar
        </span>
        <span className={styles.hintTouch}>Toque na tela para voltar</span>
      </p>

      <span className={styles.tray}>
        <Clock />
      </span>
    </nav>
  )
}
