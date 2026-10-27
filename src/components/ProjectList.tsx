import { ProjectCard } from '@/components/ProjectCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorDialog } from '@/components/ui/ErrorDialog'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useGithubRepos } from '@/hooks/useGithubRepos'
import styles from './ProjectList.module.css'

const SKELETON_KEYS = ['a', 'b', 'c', 'd']

// Lista de projetos com os três estados obrigatórios: carregando, erro e vazio
export function ProjectList() {
  const { data, isPending, isError, error, refetch, isRefetching } = useGithubRepos()

  if (isPending) {
    return (
      <div className={styles.loading}>
        <ProgressBar label="Carregando projetos do GitHub" />
        <ul className={styles.grid}>
          {SKELETON_KEYS.map((key) => (
            <li key={key}>
              <Skeleton height="6.5em" />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (isError) {
    return (
      <ErrorDialog
        title="Não foi possível carregar os projetos"
        message={error.message}
        onRetry={isRefetching ? undefined : () => refetch()}
      />
    )
  }

  if (data.length === 0) return <EmptyState message="Nenhum projeto público ainda." />

  return (
    <ul className={styles.grid}>
      {data.map((repo) => (
        <li key={repo.id}>
          <ProjectCard repo={repo} />
        </li>
      ))}
    </ul>
  )
}
