import { useEffect, useRef, useState } from 'react'
import { RETRO_BUTTON, RetroDialog } from '@/components/ui/RetroDialog'
import { RetroProgress } from '@/components/ui/RetroProgress'
import styles from './ContactStatus.module.css'

// Tempo que a confirmação fica na tela antes de voltar sozinha para o formulário
const AUTO_CLOSE_SECONDS = 8

export function ContactSending() {
  return (
    <RetroDialog title="Enviando mensagem">
      <p className={styles.headline} role="status">
        Enviando...
      </p>
      <RetroProgress label="Enviando a mensagem" />
    </RetroDialog>
  )
}

type ContactSentProps = {
  onClose: () => void
}

export function ContactSent({ onClose }: ContactSentProps) {
  const okRef = useRef<HTMLButtonElement>(null)
  const [secondsLeft, setSecondsLeft] = useState(AUTO_CLOSE_SECONDS)

  // O foco vai para o OK: quem usa teclado ou leitor de tela fica sabendo do resultado
  useEffect(() => {
    okRef.current?.focus()
  }, [])

  useEffect(() => {
    if (secondsLeft === 0) {
      onClose()
      return
    }
    const timer = window.setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [secondsLeft, onClose])

  return (
    <RetroDialog
      title="Mensagem enviada"
      showInfoIcon
      actions={
        <button ref={okRef} type="button" className={RETRO_BUTTON} onClick={onClose}>
          OK
        </button>
      }
    >
      <p role="status">Sua mensagem foi enviada com sucesso.</p>
      <p>Vou responder no e-mail que você informou.</p>
      <p className={styles.hint}>Voltando ao formulário em {secondsLeft} segundos.</p>
    </RetroDialog>
  )
}
