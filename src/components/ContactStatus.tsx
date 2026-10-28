import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { XpDialog } from '@/components/ui/XpDialog'
import styles from './ContactStatus.module.css'

// Tempo que a confirmação fica na tela antes de voltar sozinha para o formulário
const AUTO_CLOSE_SECONDS = 8

export function ContactSending() {
  return (
    <XpDialog title="Enviando mensagem">
      <p className={styles.headline} role="status">
        Enviando...
      </p>
      <ProgressBar label="Enviando a mensagem" />
    </XpDialog>
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
    <XpDialog
      title="Mensagem enviada"
      showInfoIcon
      actions={
        <Button ref={okRef} className={styles.ok} onClick={onClose}>
          OK
        </Button>
      }
    >
      <p role="status">Sua mensagem foi enviada com sucesso.</p>
      <p>Vou responder no e-mail que você informou.</p>
      <p className={styles.hint}>Voltando ao formulário em {secondsLeft} segundos.</p>
    </XpDialog>
  )
}
