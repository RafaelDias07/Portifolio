import styles from './Skeleton.module.css'

type SkeletonProps = {
  /** Altura fixa: reserva o espaço do conteúdo e evita salto de layout (CLS) */
  height: string
  width?: string
}

export function Skeleton({ height, width = '100%' }: SkeletonProps) {
  return <span className={styles.skeleton} style={{ height, width }} aria-hidden="true" />
}
