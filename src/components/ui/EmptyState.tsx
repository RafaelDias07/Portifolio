import styles from './EmptyState.module.css'

type EmptyStateProps = {
  icon?: string
  message: string
}

export function EmptyState({ icon = '📂', message }: EmptyStateProps) {
  return (
    <p className={styles.empty}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      {message}
    </p>
  )
}
