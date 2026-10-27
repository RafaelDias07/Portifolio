import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef } from 'react'
import styles from './Tabs.module.css'

export type TabItem = {
  id: string
  label: string
  icon?: string
  content: ReactNode
}

type TabsProps = {
  /** Nome do conjunto de abas, lido por leitores de tela */
  label: string
  items: TabItem[]
  activeId: string
  onChange: (id: string) => void
}

// Abas acessíveis (padrão WAI-ARIA): setas, Home e End trocam de aba pelo teclado
export function Tabs({ label, items, activeId, onChange }: TabsProps) {
  const baseId = useId()
  const tabRefs = useRef(new Map<string, HTMLButtonElement>())
  const active = items.find((item) => item.id === activeId) ?? items[0]

  // No celular a lista de abas rola: garante que a aba ativa fique visível
  useEffect(() => {
    tabRefs.current.get(activeId)?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeId])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = items.findIndex((item) => item.id === active.id)
    let target: number
    switch (event.key) {
      case 'ArrowRight':
        target = index + 1
        break
      case 'ArrowLeft':
        target = index - 1
        break
      case 'Home':
        target = 0
        break
      case 'End':
        target = items.length - 1
        break
      default:
        return
    }

    event.preventDefault()
    const next = items[(target + items.length) % items.length]
    onChange(next.id)
    tabRefs.current.get(next.id)?.focus()
  }

  return (
    <div className={styles.tabs}>
      <div role="tablist" aria-label={label} className={styles.list} onKeyDown={handleKeyDown}>
        {items.map((item) => {
          const selected = item.id === active.id
          return (
            <button
              key={item.id}
              ref={(element) => {
                if (element) tabRefs.current.set(item.id, element)
                else tabRefs.current.delete(item.id)
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              className={styles.tab}
              onClick={() => onChange(item.id)}
            >
              {item.icon && <span aria-hidden="true">{item.icon}</span>}
              {item.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active.id}`}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: o painel rola, então precisa receber foco para rolar pelo teclado
        tabIndex={0}
        className={styles.panel}
      >
        {active.content}
      </div>
    </div>
  )
}
