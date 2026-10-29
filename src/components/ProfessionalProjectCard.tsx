import type { ProfessionalProject } from '@/content/professionalProjects'
import styles from './ProfessionalProjectCard.module.css'
import cardStyles from './ProjectCard.module.css'

type ProfessionalProjectCardProps = {
  project: ProfessionalProject
}

// Card de projeto profissional: mesmo visual do ProjectCard, mas sem links (o código é
// privado). A explicação completa abre em "Ver detalhes"
export function ProfessionalProjectCard({ project }: ProfessionalProjectCardProps) {
  return (
    <article className={cardStyles.card}>
      <h4 className={cardStyles.name}>
        <span aria-hidden="true">{project.icon}</span>
        {project.name}
      </h4>
      <p className={cardStyles.description}>{project.summary}</p>
      <ul className={cardStyles.tags} aria-label="Tecnologias">
        {project.tags.map((tag) => (
          <li key={tag} className={cardStyles.tag}>
            {tag}
          </li>
        ))}
      </ul>
      <details className={styles.details}>
        <summary className={styles.toggle}>
          <span className={styles.more}>Ver detalhes</span>
          <span className={styles.less}>Esconder detalhes</span>
        </summary>
        <div className={styles.body}>
          {project.details.map((detail) => {
            const List = detail.ordered ? 'ol' : 'ul'
            return (
              <section key={detail.title} className={styles.section}>
                <h5 className={styles.title}>{detail.title}</h5>
                {detail.text && <p className={styles.text}>{detail.text}</p>}
                {detail.items && (
                  <List className={styles.list}>
                    {detail.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </List>
                )}
              </section>
            )
          })}
        </div>
      </details>
    </article>
  )
}
