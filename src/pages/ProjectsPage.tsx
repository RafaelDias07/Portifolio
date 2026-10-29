import { ProjectTabs } from '@/components/ProjectTabs'
import styles from './pages.module.css'

export function ProjectsPage() {
  return (
    <>
      <title>Projetos | Rafael Dias</title>
      <h2 className={styles.heading}>🚀 Projetos em Órbita</h2>
      <ProjectTabs />
    </>
  )
}
