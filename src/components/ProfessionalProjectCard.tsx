import { Card } from '@/components/ui/Card'
import type { ProfessionalProject } from '@/content/professionalProjects'
import styles from './ProfessionalProjectCard.module.css'

type ProfessionalProjectCardProps = {
  project: ProfessionalProject
}

// Card de projeto profissional: mesmo Card do ProjectCard, mas sem links (o código é
// privado). A explicação completa abre em "Ver detalhes"
export function ProfessionalProjectCard({ project }: ProfessionalProjectCardProps) {
  return (
    <Card
      icon={project.icon}
      title={project.name}
      headingLevel={4}
      description={project.summary}
      tags={project.tags}
    >
      <details className={styles.details}>
        <summary className={styles.toggle}>
          <span className={styles.more}>Ver detalhes</span>
          <span className={styles.less}>Esconder detalhes</span>
        </summary>
        <div className={styles.body}>
          {project.details.map((detail) => {
            const List = detail.ordered ? 'ol' : 'ul'
            return (
              <section key={detail.title}>
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
    </Card>
  )
}
