import { type KeyboardEvent, useId, useRef, useState } from 'react'
import { ProfessionalProjects } from '@/components/ProfessionalProjects'
import { ProjectList } from '@/components/ProjectList'
import styles from './ProjectTabs.module.css'

type ProjectCategory = 'personal' | 'professional'

const TABS: { category: ProjectCategory; icon: string; label: string }[] = [
  { category: 'personal', icon: '🧑‍💻', label: 'Projetos Pessoais' },
  { category: 'professional', icon: '💼', label: 'Projetos Profissionais' },
]

// Para qual aba cada tecla leva (undefined = tecla que não troca de aba)
function nextIndex(key: string, index: number) {
  switch (key) {
    case 'ArrowRight':
      return (index + 1) % TABS.length
    case 'ArrowLeft':
      return (index - 1 + TABS.length) % TABS.length
    case 'Home':
      return 0
    case 'End':
      return TABS.length - 1
    default:
      return undefined
  }
}

// Abas internas da página de projetos, no estilo das abas do XP: os pessoais vêm do
// GitHub; os profissionais são escritos à mão, porque o código é privado
export function ProjectTabs() {
  const [current, setCurrent] = useState<ProjectCategory>('personal')
  const id = useId()
  const listRef = useRef<HTMLDivElement>(null)

  // Padrão de abas acessíveis: setas e Home/End trocam de aba e levam o foco junto
  function handleKeyDown(event: KeyboardEvent) {
    const index = TABS.findIndex((tab) => tab.category === current)
    const next = nextIndex(event.key, index)
    const tab = next === undefined ? undefined : TABS[next]
    if (!tab) return
    event.preventDefault()
    setCurrent(tab.category)
    listRef.current?.querySelector<HTMLElement>(`[data-category="${tab.category}"]`)?.focus()
  }

  return (
    <>
      <div
        ref={listRef}
        className={styles.tabs}
        role="tablist"
        aria-label="Tipo de projeto"
        onKeyDown={handleKeyDown}
      >
        {TABS.map((tab) => (
          <button
            key={tab.category}
            type="button"
            role="tab"
            id={`${id}-${tab.category}`}
            data-category={tab.category}
            aria-selected={tab.category === current}
            // Só a aba atual entra no Tab; as outras se alcançam pelas setas
            tabIndex={tab.category === current ? 0 : -1}
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
        {current === 'personal' ? <ProjectList /> : <ProfessionalProjects />}
      </div>
    </>
  )
}
