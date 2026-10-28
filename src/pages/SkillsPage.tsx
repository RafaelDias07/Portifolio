import { GroupBox } from '@/components/ui/GroupBox'
import { SITE_STACK } from '@/content/profile'
import styles from './pages.module.css'

export function SkillsPage() {
  return (
    <>
      <title>Habilidades | Rafael Dias</title>
      <h2 className={styles.heading}>⚙️ Habilidades</h2>

      <GroupBox title="🔧 Tecnologias deste site">
        <ul className={styles.list}>
          {SITE_STACK.map((item) => (
            <li key={item.name} className={styles.row}>
              <span className={styles.label}>{item.name}:</span> {item.usage}
            </li>
          ))}
        </ul>
      </GroupBox>
    </>
  )
}
