import { Link } from 'react-router'
import { formatDate } from '@/components/formatDate'
import type { Project } from '@/types/project'
import styles from './ProjectCard.module.css'

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      <h3 className={styles.name}>
        <Link to={`/projetos/${project.slug}`} className={styles.link}>
          <span aria-hidden="true">📁 </span>
          {project.name}
        </Link>
      </h3>
      <p className={styles.description}>{project.description ?? 'Sem descrição.'}</p>
      <p className={styles.meta}>
        {project.language && <span className={styles.tag}>{project.language}</span>}
        {project.updatedAt ? (
          <span>
            Atualizado em <time dateTime={project.updatedAt}>{formatDate(project.updatedAt)}</time>
          </span>
        ) : (
          project.note && <span>🔒 Privado</span>
        )}
      </p>
    </article>
  )
}
