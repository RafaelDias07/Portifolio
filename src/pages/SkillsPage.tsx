import { GroupBox } from '@/components/ui/GroupBox'
import { LevelBar } from '@/components/ui/LevelBar'
import { SKILL_LEVELS, SOLUTIONS } from '@/content/profile'
import styles from './pages.module.css'

// Aba Habilidades no visual do "Arsenal" do RetroOffice: barras de nível e o que eu resolvo
export function SkillsPage() {
  return (
    <>
      <title>Habilidades | Rafael Dias</title>
      <h2 className={styles.heading}>⚙️ Arsenal Técnico</h2>

      <GroupBox title="🔧 Tecnologias">
        {SKILL_LEVELS.map((skill) => (
          <LevelBar key={skill.label} label={skill.label} value={skill.value} />
        ))}
      </GroupBox>

      <GroupBox title="🧩 O que eu realmente resolvo">
        <ul className={styles.list}>
          {SOLUTIONS.map((item) => (
            <li key={item.title} className={styles.row}>
              <span aria-hidden="true">✦ </span>
              <strong>{item.title}</strong> — {item.detail}
            </li>
          ))}
        </ul>
      </GroupBox>
    </>
  )
}
