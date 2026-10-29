import { CareerTimeline } from '@/components/CareerTimeline'
import { GroupBox } from '@/components/ui/GroupBox'
import { CAREER, PROFILE, SYSTEM_INFO } from '@/content/profile'
import styles from './pages.module.css'

// Página inicial no visual do RetroOffice: foto redonda, missão, sistema e trajetória
// (as empresas por onde passei)
export function HomePage() {
  return (
    <>
      <title>Rafael Dias | Portfólio</title>
      <div className={styles.profile}>
        {/* Primeira dobra: carrega na hora, mas com tamanho fixo para não pular o layout */}
        {/* O aro azul fica na moldura: o filtro preto e branco da foto deixaria a borda cinza */}
        <span className={styles.photoFrame}>
          <img
            className={styles.photo}
            src={PROFILE.photo}
            alt={`Foto de ${PROFILE.name}`}
            width={288}
            height={288}
            decoding="async"
          />
        </span>
        <div className={styles.identity}>
          <h2 className={styles.name}>{PROFILE.name}</h2>
          <p className={styles.headline}>{PROFILE.headline}</p>
          <ul className={styles.badges} aria-label="Destaques">
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
        <CareerTimeline steps={CAREER} />
      </GroupBox>
    </>
  )
}
