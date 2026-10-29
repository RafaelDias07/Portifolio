import { useState } from 'react'
import { EmptyState } from '@/components/ui/EmptyState'
import { TitleBarButton } from '@/components/ui/TitleBarButton'
import { PHOTOS } from '@/content/media'
import { PROFILE } from '@/content/profile'
import styles from './PhotoGallery.module.css'

type PhotoGalleryProps = {
  onClose: () => void
}

// Galeria no estilo do RetroOffice: uma janela do XP que cobre a área da aba, com a foto
// no meio, ◀ ▶ dos lados, legenda e miniaturas embaixo
export function PhotoGallery({ onClose }: PhotoGalleryProps) {
  const [index, setIndex] = useState(0)
  const photo = PHOTOS[index]
  const go = (step: number) => setIndex((index + step + PHOTOS.length) % PHOTOS.length)

  return (
    <section className={styles.gallery} aria-labelledby="galeria-titulo">
      <header className={styles.titleBar}>
        <span aria-hidden="true">📷</span>
        <h3 id="galeria-titulo" className={styles.title}>
          Galeria — {PROFILE.name}
        </h3>
        <TitleBarButton label="Fechar a galeria" variant="close" onClick={onClose}>
          ✕
        </TitleBarButton>
      </header>

      <div className={styles.stage}>
        {photo ? (
          <>
            <button
              type="button"
              className={styles.nav}
              data-side="prev"
              aria-label="Foto anterior"
              onClick={() => go(-1)}
            >
              ◀
            </button>
            <figure className={styles.figure}>
              <div className={styles.frame}>
                <img
                  className={styles.photo}
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className={styles.caption}>
                <strong className={styles.name}>{photo.title}</strong>
                <span>{photo.caption}</span>
              </figcaption>
            </figure>
            <button
              type="button"
              className={styles.nav}
              data-side="next"
              aria-label="Próxima foto"
              onClick={() => go(1)}
            >
              ▶
            </button>
          </>
        ) : (
          <EmptyState icon="🖼️" message="Nenhuma foto na galeria ainda." />
        )}
      </div>

      <ul className={styles.thumbs}>
        {PHOTOS.map((item, itemIndex) => (
          <li key={item.src}>
            <button
              type="button"
              className={styles.thumb}
              aria-label={`Ver ${item.title}`}
              aria-current={itemIndex === index}
              onClick={() => setIndex(itemIndex)}
            >
              <img src={item.src} alt="" width={48} height={48} loading="lazy" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
