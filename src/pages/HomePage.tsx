import { GroupBox } from '@/components/ui/GroupBox'
import { LevelBar } from '@/components/ui/LevelBar'
import { PROFILE, SKILL_LEVELS, SYSTEM_INFO } from '@/content/profile'
import styles from './pages.module.css'

// Página inicial no visual do RetroOffice: foto redonda, missão, sistema e trajetória
export function HomePage() {
  return (
    <>
      <title>Rafael Dias | Portfólio</title>
      <div className={styles.profile}>
        {/* Primeira dobra: carrega na hora, mas com tamanho fixo para não pular o layout */}
        <img
          className={styles.photo}
          src={PROFILE.photo}
          alt={`Foto de ${PROFILE.name}`}
          width={288}
          height={288}
          decoding="async"
        />
        <div className={styles.identity}>
          <h2 className={styles.name}>{PROFILE.name}</h2>
          <p className={styles.headline}>{PROFILE.headline}</p>
          <ul className={styles.badges} aria-label="Áreas">
            {PROFILE.badges.map((badge) => (
              <li key={badge} className={styles.badge}>
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <GroupBox title="🎯 Missão">
        {PROFILE.mission.map((line) => (
          <p key={line} className={styles.line}>
            {line}
          </p>
        ))}
        <p className={styles.line}>
          <strong className={styles.highlight}>{PROFILE.missionHighlight}</strong>{' '}
          {PROFILE.missionClosing}
        </p>
      </GroupBox>

      <GroupBox title="📡 Sistema Ativo">
        <ul className={styles.list}>
          {SYSTEM_INFO.map((item) => (
            <li key={item.label} className={styles.row}>
              <span className={styles.label}>{item.label}:</span> {item.value}
            </li>
          ))}
        </ul>
      </GroupBox>

      <GroupBox title="📊 Trajetória">
        {SKILL_LEVELS.map((skill) => (
          <LevelBar key={skill.label} label={skill.label} value={skill.value} />
        ))}
      </GroupBox>
    </>
  )
}
