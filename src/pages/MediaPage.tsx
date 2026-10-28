import { GameList } from '@/components/GameList'
import { MusicPlayer } from '@/components/MusicPlayer'
import { PhotoGallery } from '@/components/PhotoGallery'
import { GroupBox } from '@/components/ui/GroupBox'
import styles from './pages.module.css'

export function MediaPage() {
  return (
    <>
      <title>Multimídia | Rafael Dias</title>
      <h2 className={styles.heading}>💿 Multimídia</h2>
      <div className={styles.mediaGrid}>
        <GroupBox title="📷 Fotos">
          <PhotoGallery />
        </GroupBox>
        <GroupBox title="🎵 Música">
          <MusicPlayer />
        </GroupBox>
      </div>
      <GroupBox title="🕹️ Jogos">
        <GameList />
      </GroupBox>
    </>
  )
}
