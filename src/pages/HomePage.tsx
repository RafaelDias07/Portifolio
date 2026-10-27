import { GroupBox } from '@/components/ui/GroupBox'
import { PROFILE } from '@/content/profile'
import styles from './pages.module.css'

export function HomePage() {
  return (
    <>
      <div className={styles.profile}>
        <span className={styles.avatar} aria-hidden="true">
          {PROFILE.initials}
        </span>
        <div>
          <h2 className={styles.name}>{PROFILE.name}</h2>
          <p className={styles.role}>{PROFILE.role}</p>
        </div>
      </div>

      <GroupBox title="👋 Sobre mim">
        <p>{PROFILE.about}</p>
      </GroupBox>

      <GroupBox title="📡 Sistema">
        <ul className={styles.list}>
          <li className={styles.row}>
            <span className={styles.label}>Operador:</span> {PROFILE.name}
          </li>
          <li className={styles.row}>
            <span className={styles.label}>Sistema:</span> Rafael_OS v1.0
          </li>
          <li className={styles.row}>
            <span className={styles.label}>Dica:</span> use “Câmera livre” para girar o computador
            em 3D.
          </li>
        </ul>
      </GroupBox>
    </>
  )
}
