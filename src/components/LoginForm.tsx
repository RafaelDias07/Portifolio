import { Button } from '@/components/ui/Button'
import { ErrorDialog } from '@/components/ui/ErrorDialog'
import { FormField } from '@/components/ui/FormField'
import { useLoginForm } from '@/hooks/useLoginForm'
import styles from './LoginForm.module.css'

type LoginFormProps = {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { form, onSubmit, mutation } = useLoginForm(onSuccess)
  const {
    register,
    formState: { errors },
  } = form

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <FormField label="E-mail" error={errors.email?.message}>
        <input type="email" autoComplete="username" inputMode="email" {...register('email')} />
      </FormField>

      <FormField label="Senha" error={errors.password?.message}>
        <input type="password" autoComplete="current-password" {...register('password')} />
      </FormField>

      {mutation.isError && (
        <ErrorDialog title="Não foi possível entrar" message={mutation.error.message} />
      )}

      <div>
        {/* Travado durante o envio: dois cliques não mandam duas tentativas */}
        <Button type="submit" className={styles.submit} disabled={mutation.isPending}>
          <span aria-hidden="true">➜</span>
          {mutation.isPending ? 'Entrando…' : 'Entrar'}
        </Button>
      </div>
    </form>
  )
}
