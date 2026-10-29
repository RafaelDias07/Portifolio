import { ContactForm } from '@/components/ContactForm'
import { GroupBox } from '@/components/ui/GroupBox'
import { CONTACT_STATUS } from '@/content/contact'
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
              <a
                className={styles.link}
                href={link.href}
                // O e-mail (mailto:) abre o app de e-mail; os sites abrem em outra aba
                {...(link.href.startsWith('http') && { target: '_blank', rel: 'noreferrer' })}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </GroupBox>

      <div className={styles.note}>
        <p className={styles.line}>
          <span aria-hidden="true">🟢 </span>
          <strong>{CONTACT_STATUS.title}</strong>
        </p>
        <p className={styles.line}>{CONTACT_STATUS.text}</p>
        <p className={styles.line}>
          <span aria-hidden="true">📬 </span>
          {CONTACT_STATUS.reply}
        </p>
      </div>
    </>
  )
}
