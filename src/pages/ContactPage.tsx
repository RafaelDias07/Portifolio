import { PROFILE_LINKS } from '@/content/profile'
import styles from './pages.module.css'

// Provisório: o formulário validado entra na etapa de contato
export function ContactPage() {
  return (
    <>
      <title>Contato | Rafael Dias</title>
      <h2 className={styles.heading}>📬 Contato</h2>
      <ul className={styles.list}>
        {PROFILE_LINKS.map((link) => (
          <li key={link.href} className={styles.linkRow}>
            <span aria-hidden="true">{link.icon}</span>
            <a className={styles.link} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.note}>O formulário de contato chega em breve.</p>
    </>
  )
}
