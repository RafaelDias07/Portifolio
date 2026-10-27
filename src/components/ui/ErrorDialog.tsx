import { Button } from '@/components/ui/Button'
import styles from './ErrorDialog.module.css'

type ErrorDialogProps = {
  title?: string
  message: string
  onRetry?: () => void
}

// Caixa de erro do XP, usada quando uma API falha. role="alert" faz o leitor de tela anunciar
export function ErrorDialog({ title = 'Erro', message, onRetry }: ErrorDialogProps) {
  return (
    <div className={styles.dialog} role="alert">
      <span className={styles.icon} aria-hidden="true">
        ✖
      </span>
      <div className={styles.text}>
        <strong>{title}</strong>
        <p>{message}</p>
        {onRetry && <Button onClick={onRetry}>Tentar de novo</Button>}
      </div>
    </div>
  )
}
