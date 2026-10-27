import { PROFILE_LINKS } from '@/content/profile'
import styles from './pages.module.css'

// Provisório: a lista vem da API do GitHub na etapa de rotas e projetos
export function ProjectsPage() {
  const github = PROFILE_LINKS[0]

  return (
    <>
      <h2 className={styles.heading}>🚀 Projetos</h2>
      <p>Os projetos chegam direto da API do GitHub, sem cadastro manual.</p>
      <p className={styles.note}>
        Enquanto isso, veja tudo em{' '}
        <a className={styles.link} href={github.href} target="_blank" rel="noreferrer">
          {github.label}
        </a>
        .
      </p>
    </>
  )
}
