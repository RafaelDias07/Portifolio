import { Card } from '@/components/ui/Card'
import type { Project } from '@/types/project'
import styles from './ProjectCard.module.css'

type ProjectCardProps = {
  project: Project
}

// Card de projeto no visual do RetroOffice: nome com ícone, descrição inteira,
// etiquetas e botões para o site (Explorar) e para o código no GitHub
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card
      icon={project.icon}
      title={project.name}
      description={project.description ?? 'Sem descrição.'}
      tags={project.tags}
    >
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
    </Card>
  )
}
