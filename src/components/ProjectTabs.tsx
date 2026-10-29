import { useId, useState } from 'react'
import { ProjectList } from '@/components/ProjectList'
import type { ProjectCategory } from '@/types/project'
import styles from './ProjectTabs.module.css'

const TABS: { category: ProjectCategory; icon: string; label: string }[] = [
  { category: 'personal', icon: '🧑‍💻', label: 'Projetos Pessoais' },
  { category: 'professional', icon: '💼', label: 'Projetos Profissionais' },
]

// Abas internas da página de projetos, no estilo das abas do XP: cada uma mostra
// a lista de uma categoria
export function ProjectTabs() {
  const [current, setCurrent] = useState<ProjectCategory>('personal')
  const id = useId()

  return (
    <>
      <div className={styles.tabs} role="tablist" aria-label="Tipo de projeto">
        {TABS.map((tab) => (
          <button
            key={tab.category}
            type="button"
            role="tab"
            id={`${id}-${tab.category}`}
            aria-selected={tab.category === current}
            aria-controls={`${id}-panel`}
            className={styles.tab}
            onClick={() => setCurrent(tab.category)}
          >
            <span aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-${current}`}
        className={styles.panel}
      >
        <ProjectList category={current} />
      </div>
    </>
  )
}
