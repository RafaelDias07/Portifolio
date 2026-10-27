import styles from './pages.module.css'

const MEDIA_ITEMS = [
  { id: 'photos', icon: '📷', title: 'Fotos' },
  { id: 'music', icon: '🎵', title: 'Música' },
  { id: 'fox64', icon: '🚀', title: 'Fox 64' },
  { id: 'bzero64', icon: '🏎️', title: 'B-Zero 64' },
]

// Provisório: galeria, player e jogos entram na etapa de multimídia
export function MediaPage() {
  return (
    <>
      <title>Multimídia | Rafael Dias</title>
      <h2 className={styles.heading}>💿 Multimídia</h2>
      <ul className={styles.mediaGrid}>
        {MEDIA_ITEMS.map((item) => (
          <li key={item.id} className={styles.mediaItem}>
            <span className={styles.mediaIcon} aria-hidden="true">
              {item.icon}
            </span>
            <strong>{item.title}</strong>
            <span className={styles.mediaStatus}>Em breve</span>
          </li>
        ))}
      </ul>
    </>
  )
}
