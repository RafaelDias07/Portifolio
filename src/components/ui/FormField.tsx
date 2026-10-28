import { cloneElement, type ReactElement, useId } from 'react'
import styles from './FormField.module.css'

type FieldControlProps = {
  id?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

type FormFieldProps = {
  label: string
  /** Mensagem de erro do campo; quando existe, o campo fica marcado como inválido */
  error?: string
  hint?: string
  /** O <input> ou <textarea>; recebe id e atributos de acessibilidade */
  children: ReactElement<FieldControlProps>
}

// Rótulo + campo + erro, já ligados entre si para leitores de tela
export function FormField({ label, error, hint, children }: FormFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {cloneElement(children, {
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
      })}
      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className={styles.error}>
          <span aria-hidden="true">⚠ </span>
          {error}
        </span>
      )}
    </div>
  )
}
