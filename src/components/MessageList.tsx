import { formatDate } from '@/components/formatDate'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorDialog } from '@/components/ui/ErrorDialog'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useMessages, useSetMessageAnswered } from '@/hooks/useMessages'
import styles from './MessageList.module.css'

// Mensagens do formulário de contato, das mais novas para as mais antigas
export function MessageList() {
  const { data, isPending, isError, refetch, isRefetching } = useMessages()
  const setAnswered = useSetMessageAnswered()

  if (isPending) return <ProgressBar label="Carregando mensagens" />

  if (isError) {
    return (
      <ErrorDialog
        title="Não foi possível carregar as mensagens"
        message="Confira a conexão e tente de novo."
        onRetry={isRefetching ? undefined : () => refetch()}
      />
    )
  }

  if (data.length === 0) {
    return <EmptyState icon="📭" message="Nenhuma mensagem recebida ainda." />
  }

  const pending = data.filter((message) => !message.answered).length

  return (
    <>
      <p className={styles.summary} role="status">
        {pending === 0
          ? 'Todas as mensagens foram respondidas.'
          : `${pending} de ${data.length} sem resposta.`}
      </p>

      {setAnswered.isError && (
        <ErrorDialog title="A mensagem não foi atualizada" message={setAnswered.error.message} />
      )}

      <ul className={styles.list}>
        {data.map((message) => {
          // Só o botão da mensagem que está sendo salva fica travado
          const saving = setAnswered.isPending && setAnswered.variables.id === message.id

          return (
            <li key={message.id}>
              <article className={styles.message} data-answered={message.answered}>
                <header className={styles.header}>
                  <strong>{message.name}</strong>
                  <a href={`mailto:${message.email}`} className={styles.email}>
                    {message.email}
                  </a>
                  <time dateTime={message.created_at} className={styles.date}>
                    {formatDate(message.created_at)}
                  </time>
                </header>
                <p className={styles.text}>{message.message}</p>
                <footer className={styles.footer}>
                  <span className={styles.status}>
                    {message.answered ? '✔ Respondida' : '● Sem resposta'}
                  </span>
                  <Button
                    disabled={saving}
                    onClick={() =>
                      setAnswered.mutate({ id: message.id, answered: !message.answered })
                    }
                  >
                    {saving
                      ? 'Salvando…'
                      : message.answered
                        ? 'Marcar como não respondida'
                        : 'Marcar como respondida'}
                  </Button>
                </footer>
              </article>
            </li>
          )
        })}
      </ul>
    </>
  )
}
