import type { Project } from '@/types/project'
import styles from './ProjectCard.module.css'

type ProjectCardProps = {
  project: Project
}

// Card de projeto no visual do RetroOffice: nome com ícone, descrição inteira,
// etiquetas e botões para o site (Explorar) e para o código no GitHub
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      <h3 className={styles.name}>
        <span aria-hidden="true">{project.icon}</span>
        {project.name}
        {project.featured && <span className={styles.featured}>★ Destaque</span>}
      </h3>
      <p className={styles.description}>{project.description ?? 'Sem descrição.'}</p>
      {project.tags.length > 0 && (
        <ul className={styles.tags} aria-label="Tecnologias">
          {project.tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              {tag}
            </li>
          ))}
        </ul>
      )}
      <div className={styles.actions}>
        {project.siteUrl && (
          <a className={styles.explore} href={project.siteUrl} target="_blank" rel="noreferrer">
            <span aria-hidden="true">▶</span> Explorar
          </a>
        )}
        <a className={styles.code} href={project.codeUrl} target="_blank" rel="noreferrer">
          <span aria-hidden="true">⌥</span> Ver Código
        </a>
      </div>
    </article>
  )
}
