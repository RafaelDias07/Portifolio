import { GroupBox } from '@/components/ui/GroupBox'
import { TagList } from '@/components/ui/TagList'
import { SITE_STACK, SKILL_GROUPS } from '@/content/profile'
import styles from './pages.module.css'

export function SkillsPage() {
  return (
    <>
      <title>Habilidades | Rafael Dias</title>
      <h2 className={styles.heading}>⚙️ Habilidades</h2>

      <div className={styles.skillGrid}>
        {SKILL_GROUPS.map((group) => (
          <GroupBox key={group.title} title={group.title}>
            <TagList label={group.title} items={group.items} />
          </GroupBox>
        ))}
      </div>

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
