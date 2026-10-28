import { Link, useParams } from 'react-router'
import styles from './pages.module.css'

// Provisório nesta branch: os dados do repositório entram com a integração do GitHub
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
      <h2 className={styles.heading}>📁 {slug}</h2>
    </>
  )
}
