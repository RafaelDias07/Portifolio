import styles from './TagList.module.css'

type TagListProps = {
  /** Nome da lista, lido por leitores de tela */
  label: string
  items: string[]
}

// Etiquetas pequenas lado a lado, para tecnologias e assuntos
export function TagList({ label, items }: TagListProps) {
  return (
    <ul className={styles.list} aria-label={label}>
      {items.map((item) => (
        <li key={item} className={styles.tag}>
          {item}
        </li>
      ))}
    </ul>
  )
}
