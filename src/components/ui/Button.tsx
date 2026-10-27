import type { ComponentProps } from 'react'
import styles from './Button.module.css'

type ButtonProps = ComponentProps<'button'>

// Botão padrão do XP. Usa type="button" por padrão para não enviar formulários sem querer
export function Button({ type = 'button', className, ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={className ? `${styles.button} ${className}` : styles.button}
      {...props}
    />
  )
}
