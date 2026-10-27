import { Link } from 'react-router'
import { formatDate } from '@/components/formatDate'
import type { Repository } from '@/types/github'
import styles from './ProjectCard.module.css'

type ProjectCardProps = {
  repo: Repository
}

export function ProjectCard({ repo }: ProjectCardProps) {
  return (
    <article className={styles.card}>
      <h3 className={styles.name}>
        <Link to={`/projetos/${repo.name}`} className={styles.link}>
          <span aria-hidden="true">📁 </span>
          {repo.name}
        </Link>
      </h3>
      <p className={styles.description}>{repo.description ?? 'Sem descrição.'}</p>
      <p className={styles.meta}>
        {repo.language && <span className={styles.tag}>{repo.language}</span>}
        <span>
          Atualizado em <time dateTime={repo.pushed_at}>{formatDate(repo.pushed_at)}</time>
        </span>
      </p>
    </article>
  )
}
