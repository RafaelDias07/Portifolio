import { Link } from 'react-router'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorDialog } from '@/components/ui/ErrorDialog'
import { Skeleton } from '@/components/ui/Skeleton'
import { useProjects } from '@/hooks/useProjects'
import styles from './FeaturedProjects.module.css'

// Projetos escolhidos como destaque no dashboard, na página inicial
export function FeaturedProjects() {
  const { data, isPending, isError, refetch, isRefetching } = useProjects()

  if (isPending) return <Skeleton height="4.5em" />

  if (isError) {
    return (
      <ErrorDialog
        title="Não foi possível carregar os destaques"
        message="O GitHub não respondeu agora."
        onRetry={isRefetching ? undefined : () => refetch()}
      />
    )
  }

  const featured = data.filter((project) => project.featured)
  if (featured.length === 0) {
    return (
      <EmptyState icon="⭐" message="Nenhum destaque escolhido ainda. Veja todos em Projetos." />
    )
  }

  return (
    <ul className={styles.list}>
      {featured.map((project) => (
        <li key={project.slug}>
          <Link to={`/projetos/${project.slug}`} className={styles.link}>
            <span aria-hidden="true">⭐ </span>
            {project.name}
          </Link>
          {project.description && <p className={styles.description}>{project.description}</p>}
        </li>
      ))}
    </ul>
  )
}
