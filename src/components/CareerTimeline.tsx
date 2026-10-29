import type { CareerStep } from '@/content/profile'
import styles from './CareerTimeline.module.css'

type CareerTimelineProps = {
  steps: CareerStep[]
}

// Linha do tempo das empresas: período à esquerda, marcador na linha azul e, à
// direita, empresa, função e o que faço lá. O emprego atual ganha o marcador verde
export function CareerTimeline({ steps }: CareerTimelineProps) {
  return (
    <ol className={styles.timeline}>
      {steps.map((step) => (
        <li key={`${step.company}-${step.period}`} className={styles.step}>
          <span className={styles.period}>{step.period}</span>
          <span className={styles.marker} data-current={step.current} aria-hidden="true" />
          <div className={styles.body}>
            <p className={styles.heading}>
              <strong className={styles.company}>{step.company}</strong>
              <span className={styles.role}>{step.role}</span>
              {step.current && <span className={styles.now}>atual</span>}
            </p>
            <p className={styles.description}>{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
