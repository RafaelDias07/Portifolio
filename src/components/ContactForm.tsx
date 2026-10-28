import { ContactSending, ContactSent } from '@/components/ContactStatus'
import { Button } from '@/components/ui/Button'
import { ErrorDialog } from '@/components/ui/ErrorDialog'
import { FormField } from '@/components/ui/FormField'
import { useContactForm } from '@/hooks/useContactForm'
import { MESSAGE_MAX_LENGTH } from '@/types/contact'
import styles from './ContactForm.module.css'

export function ContactForm() {
  const { form, onSubmit, mutation, backToForm } = useContactForm()
  const {
    register,
    watch,
    formState: { errors },
  } = form
  const messageLength = watch('message')?.length ?? 0

  // O formulário dá lugar à caixa de envio e depois à de confirmação.
  // Os valores digitados ficam guardados no React Hook Form: se der erro, voltam na tela
  if (mutation.isPending) return <ContactSending />
  if (mutation.isSuccess) return <ContactSent onClose={backToForm} />

  return (
    // noValidate: as mensagens vêm do Zod, iguais em todo navegador
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <FormField label="Nome" error={errors.name?.message}>
        <input type="text" autoComplete="name" {...register('name')} />
      </FormField>

      <FormField label="E-mail" error={errors.email?.message} hint="Só para eu poder responder.">
        <input type="email" autoComplete="email" inputMode="email" {...register('email')} />
      </FormField>

      <FormField
        label="Mensagem"
        error={errors.message?.message}
        hint={`${messageLength}/${MESSAGE_MAX_LENGTH} caracteres`}
      >
        <textarea rows={6} {...register('message')} />
      </FormField>

      {/* Armadilha para robôs: escondida de pessoas e de leitores de tela */}
      <div className={styles.trap} aria-hidden="true">
        <label>
          Site
          <input type="text" tabIndex={-1} autoComplete="off" {...register('trap')} />
        </label>
      </div>

      {mutation.isError && (
        <ErrorDialog title="A mensagem não foi enviada" message={mutation.error.message} />
      )}

      <div>
        <Button type="submit">Enviar mensagem</Button>
      </div>
    </form>
  )
}
