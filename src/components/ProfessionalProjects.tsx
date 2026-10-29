import { Link } from 'react-router'
import { ProfessionalProjectCard } from '@/components/ProfessionalProjectCard'
import { PROFESSIONAL_NOTICE, WORKPLACES } from '@/content/professionalProjects'
import styles from './ProfessionalProjects.module.css'
import listStyles from './ProjectList.module.css'

// Aba "Projetos Profissionais": aviso de confidencialidade e os projetos agrupados por empresa
export function ProfessionalProjects() {
  return (
    <>
      <div className={styles.notice}>
        <p className={styles.line}>
          <span aria-hidden="true">🔒 </span>
          <strong>{PROFESSIONAL_NOTICE.title}</strong>
        </p>
        <p className={styles.line}>{PROFESSIONAL_NOTICE.text}</p>
        <p className={styles.line}>
          {PROFESSIONAL_NOTICE.contact}{' '}
          <Link className={styles.link} to="/contato">
            Fale comigo
          </Link>
        </p>
      </div>

      {WORKPLACES.map((workplace) => (
        <section key={workplace.company} className={styles.workplace}>
          <h3 className={styles.company}>
            {workplace.logo ? (
              <img
                className={styles.logo}
                src={workplace.logo.src}
                alt={workplace.company}
                width={workplace.logo.width}
                height={workplace.logo.height}
              />
            ) : (
              workplace.company
            )}
            {workplace.role && <span className={styles.role}>· {workplace.role}</span>}
          </h3>
          <ul className={listStyles.grid}>
            {workplace.projects.map((project) => (
              <li key={project.id}>
                <ProfessionalProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  )
}
