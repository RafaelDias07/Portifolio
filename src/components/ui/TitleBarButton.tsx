import type { ComponentProps } from 'react'
import styles from './TitleBarButton.module.css'

type TitleBarButtonProps = Omit<ComponentProps<'button'>, 'type'> & {
  /** Texto lido por leitores de tela; o símbolo visível é decorativo */
  label: string
  variant?: 'default' | 'close'
}

export function TitleBarButton({
  label,
  variant = 'default',
  children,
  ...props
}: TitleBarButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      data-variant={variant}
      aria-label={label}
      title={label}
      {...props}
    >
      <span aria-hidden="true">{children}</span>
    </button>
  )
}
