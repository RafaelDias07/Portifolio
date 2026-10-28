import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { PHOTOS } from '@/content/media'
import styles from './PhotoGallery.module.css'

// Visualizador de fotos no estilo do "Visualizador de imagens" do XP: foto grande,
// legenda, anterior/próxima e miniaturas
export function PhotoGallery() {
  const [index, setIndex] = useState(0)
  const photo = PHOTOS[index]
  if (!photo) return null

  const many = PHOTOS.length > 1
  const go = (step: number) => setIndex((index + step + PHOTOS.length) % PHOTOS.length)

  return (
    <figure className={styles.viewer}>
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
        <strong>{photo.title}</strong>
        <span>{photo.caption}</span>
        {many && (
          <span className={styles.counter}>
            {index + 1} de {PHOTOS.length}
          </span>
        )}
      </figcaption>

      {many && (
        <div className={styles.controls}>
          <Button onClick={() => go(-1)} aria-label="Foto anterior">
            ◀
          </Button>
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
          <Button onClick={() => go(1)} aria-label="Próxima foto">
            ▶
          </Button>
        </div>
      )}
    </figure>
  )
}
