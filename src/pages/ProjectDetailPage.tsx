import { Link, useParams } from 'react-router'
import { ProjectDetails } from '@/components/ProjectDetails'
import styles from './pages.module.css'

export function ProjectDetailPage() {
  const { slug = '' } = useParams()

  return (
    <>
      <title>{`${slug} | Rafael Dias`}</title>
      <p>
        <Link to="/projetos" className={styles.link}>
          ← Voltar para projetos
        </Link>
      </p>
      <ProjectDetails name={slug} />
    </>
  )
}
