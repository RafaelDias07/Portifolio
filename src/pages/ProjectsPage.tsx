import { ProjectList } from '@/components/ProjectList'
import styles from './pages.module.css'

export function ProjectsPage() {
  return (
    <>
      <title>Projetos | Rafael Dias</title>
      <h2 className={styles.heading}>🚀 Projetos</h2>
      <p className={styles.intro}>
        Destaques primeiro; os demais vêm direto do meu GitHub, do mais recente para o mais antigo.
      </p>
      <ProjectList />
    </>
  )
}
