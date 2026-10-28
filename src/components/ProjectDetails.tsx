import { formatDate } from '@/components/formatDate'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorDialog } from '@/components/ui/ErrorDialog'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useProject } from '@/hooks/useProjects'
import styles from './ProjectDetails.module.css'

type ProjectDetailsProps = {
  slug: string
}

export function ProjectDetails({ slug }: ProjectDetailsProps) {
  const { data: project, isPending, isError, error, refetch } = useProject(slug)

  if (isPending) {
    return (
      <div className={styles.loading}>
        <ProgressBar label="Carregando o projeto" />
        <Skeleton height="1.5em" width="60%" />
        <Skeleton height="5em" />
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorDialog
        title="Não foi possível carregar o projeto"
        message={error.message}
        onRetry={() => refetch()}
      />
    )
  }

  if (!project) {
    return <EmptyState icon="🔍" message={`O projeto "${slug}" não existe ou não é público.`} />
  }

  return (
    <article>
      <h2 className={styles.title}>📁 {project.name}</h2>
      <p>{project.description ?? 'Sem descrição.'}</p>

      <dl className={styles.facts}>
        <dt>Linguagem</dt>
        <dd>{project.language ?? 'não informada'}</dd>
        <dt>Estrelas</dt>
        <dd>{project.stars}</dd>
        <dt>Última atualização</dt>
        <dd>
          <time dateTime={project.updatedAt}>{formatDate(project.updatedAt)}</time>
        </dd>
      </dl>

      {project.topics.length > 0 && (
        <ul className={styles.topics} aria-label="Tópicos">
          {project.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      )}

      <p className={styles.links}>
        <a href={project.codeUrl} target="_blank" rel="noreferrer">
          Ver código no GitHub ↗
        </a>
        {project.siteUrl && (
          <a href={project.siteUrl} target="_blank" rel="noreferrer">
            Abrir o site ↗
          </a>
        )}
      </p>
    </article>
  )
}
