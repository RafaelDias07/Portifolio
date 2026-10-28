import { ContactForm } from '@/components/ContactForm'
import { GroupBox } from '@/components/ui/GroupBox'
import { PROFILE_LINKS } from '@/content/profile'
import styles from './pages.module.css'

export function ContactPage() {
  return (
    <>
      <title>Contato | Rafael Dias</title>
      <h2 className={styles.heading}>📬 Contato</h2>

      <GroupBox title="✉️ Enviar mensagem">
        <ContactForm />
      </GroupBox>

      <GroupBox title="🔗 Onde me encontrar">
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
      </GroupBox>
    </>
  )
}
