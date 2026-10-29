import type { ReactNode } from 'react'
import styles from './Card.module.css'

type CardProps = {
  /** Emoji ao lado do título */
  icon: string
  title: string
  /** Nível do título, para seguir a hierarquia da página (h3 por padrão) */
  headingLevel?: 3 | 4
  description: string
  /** Etiquetas embaixo da descrição */
  tags: string[]
  /** O que vem depois das etiquetas (botões, detalhes) */
  children?: ReactNode
}

// Caixa larga de projeto, como os grupos das outras abas: título com ícone, descrição e etiquetas
export function Card({ icon, title, headingLevel = 3, description, tags, children }: CardProps) {
  const Heading = headingLevel === 4 ? 'h4' : 'h3'
  return (
    <article className={styles.card}>
      <Heading className={styles.title}>
        <span aria-hidden="true">{icon}</span>
        {title}
      </Heading>
      <p className={styles.description}>{description}</p>
      {tags.length > 0 && (
        <ul className={styles.tags} aria-label="Tecnologias">
          {tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
      )}
      {children}
    </article>
  )
}
