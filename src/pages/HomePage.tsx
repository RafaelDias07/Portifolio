import { GroupBox } from '@/components/ui/GroupBox'
import { TagList } from '@/components/ui/TagList'
import { PROFILE } from '@/content/profile'
import styles from './pages.module.css'

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
          <p className={styles.role}>{PROFILE.role}</p>
          <p className={styles.education}>{PROFILE.education}</p>
          <TagList label="Áreas de interesse" items={PROFILE.badges} />
        </div>
      </div>

      <GroupBox title="👋 Sobre mim">
        {PROFILE.about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </GroupBox>

      <GroupBox title="📡 Sistema">
        <ul className={styles.list}>
          <li className={styles.row}>
            <span className={styles.label}>Operador:</span> {PROFILE.fullName}
          </li>
          <li className={styles.row}>
            <span className={styles.label}>Curso:</span> {PROFILE.education}
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
