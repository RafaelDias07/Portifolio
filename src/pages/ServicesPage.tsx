import { Link } from 'react-router'
import { GroupBox } from '@/components/ui/GroupBox'
import { DIFFERENTIAL, SERVICES } from '@/content/services'
import styles from './pages.module.css'

// Aba Serviços no visual das "Missões Disponíveis" do RetroOffice
export function ServicesPage() {
  return (
    <>
      <title>Serviços | Rafael Dias</title>
      <h2 className={styles.heading}>💼 Missões Disponíveis</h2>

      {SERVICES.map((service) => (
        <GroupBox key={service.title} title={service.title}>
          <p className={styles.line}>{service.pitch}</p>
          <p className={styles.line}>
            <strong>O que entrego:</strong> {service.delivery}
          </p>
        </GroupBox>
      ))}

      <div className={styles.note}>
        <p className={styles.line}>
          <span aria-hidden="true">🎯 </span>
          <strong>Diferencial:</strong> {DIFFERENTIAL}
        </p>
        <p className={styles.line}>
          <span aria-hidden="true">📬 </span>
          <Link to="/contato" className={styles.link}>
            Fale comigo
          </Link>{' '}
          antes de contratar qualquer dev.
        </p>
      </div>
    </>
  )
}
