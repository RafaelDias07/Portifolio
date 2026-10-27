import { formatDate } from '@/components/formatDate'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorDialog } from '@/components/ui/ErrorDialog'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGithubRepo } from '@/hooks/useGithubRepos'
import styles from './ProjectDetails.module.css'

type ProjectDetailsProps = {
  name: string
}

export function ProjectDetails({ name }: ProjectDetailsProps) {
  const { data: repo, isPending, isError, error, refetch } = useGithubRepo(name)

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

  if (!repo) {
    return <EmptyState icon="🔍" message={`O projeto "${name}" não existe ou não é público.`} />
  }

  return (
    <article>
      <h2 className={styles.title}>📁 {repo.name}</h2>
      <p>{repo.description ?? 'Sem descrição.'}</p>

      <dl className={styles.facts}>
        <dt>Linguagem</dt>
        <dd>{repo.language ?? 'não informada'}</dd>
        <dt>Estrelas</dt>
        <dd>{repo.stargazers_count}</dd>
        <dt>Última atualização</dt>
        <dd>
          <time dateTime={repo.pushed_at}>{formatDate(repo.pushed_at)}</time>
        </dd>
      </dl>

      {repo.topics.length > 0 && (
        <ul className={styles.topics} aria-label="Tópicos">
          {repo.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      )}

      <p className={styles.links}>
        <a href={repo.html_url} target="_blank" rel="noreferrer">
          Ver código no GitHub ↗
        </a>
        {repo.homepage && (
          <a href={repo.homepage} target="_blank" rel="noreferrer">
            Abrir o site ↗
          </a>
        )}
      </p>
    </article>
  )
}
