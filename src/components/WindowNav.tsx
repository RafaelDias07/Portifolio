import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router'
import styles from './WindowNav.module.css'

const SECTIONS = [
  { to: '/', icon: '🧭', label: 'Início' },
  { to: '/habilidades', icon: '⚙️', label: 'Habilidades' },
  { to: '/projetos', icon: '🚀', label: 'Projetos' },
  { to: '/servicos', icon: '💼', label: 'Serviços' },
  { to: '/contato', icon: '📬', label: 'Contato' },
  { to: '/multimidia', icon: '💿', label: 'Multimídia' },
]

// Menu de abas da janela XP. Cada aba é um link de verdade (abre em nova aba,
// pode ser compartilhado); o NavLink marca a atual com aria-current="page"
export function WindowNav() {
  const listRef = useRef<HTMLUListElement>(null)
  const { pathname } = useLocation()

  // No celular o menu rola na horizontal: mantém a aba ativa visível
  useEffect(() => {
    if (!pathname) return
    listRef.current
      ?.querySelector('[aria-current="page"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [pathname])

  return (
    <nav aria-label="Seções do portfólio">
      <ul ref={listRef} className={styles.list}>
        {SECTIONS.map((section) => (
          <li key={section.to}>
            <NavLink to={section.to} end={section.to === '/'} className={styles.tab}>
              <span aria-hidden="true">{section.icon}</span>
              {section.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
