import { ProjectList } from '@/components/ProjectList'
import styles from './pages.module.css'

export function ProjectsPage() {
  return (
    <>
      <title>Projetos | Rafael Dias</title>
      <h2 className={styles.heading}>🚀 Projetos</h2>
      <p className={styles.intro}>Uma seleção dos meus projetos, com os dados direto do GitHub.</p>
      <ProjectList />
    </>
  )
}
