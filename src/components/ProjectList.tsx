import { ProjectCard } from '@/components/ProjectCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorDialog } from '@/components/ui/ErrorDialog'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/Skeleton'
import { useProjects } from '@/hooks/useProjects'
import type { ProjectCategory } from '@/types/project'
import styles from './ProjectList.module.css'

const SKELETON_KEYS = ['a', 'b', 'c', 'd']

type ProjectListProps = {
  category: ProjectCategory
}

// Lista de projetos de uma aba, com os três estados obrigatórios: carregando, erro e vazio
export function ProjectList({ category }: ProjectListProps) {
  const { data, isPending, isError, error, refetch, isRefetching } = useProjects()

  if (isPending) {
    return (
      <div className={styles.loading}>
        <ProgressBar label="Carregando projetos do GitHub" />
        <ul className={styles.grid}>
          {SKELETON_KEYS.map((key) => (
            <li key={key}>
              <Skeleton height="9em" />
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

  const projects = data.filter((project) => project.category === category)
  if (projects.length === 0) {
    return (
      <EmptyState
        message={
          category === 'professional'
            ? 'Nenhum projeto profissional publicado ainda.'
            : 'Nenhum projeto pessoal publicado ainda.'
        }
      />
    )
  }

  return (
    <ul className={styles.grid}>
      {projects.map((project) => (
        <li key={project.slug}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  )
}
