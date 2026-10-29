import { MediaMenu } from '@/components/MediaMenu'
import styles from './pages.module.css'

export function MediaPage() {
  return (
    <>
      <title>Multimídia | Rafael Dias</title>
      <h2 className={styles.heading}>💿 Modo Livre</h2>
      <MediaMenu />
    </>
  )
}
