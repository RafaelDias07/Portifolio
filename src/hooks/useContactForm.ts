import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { sendContactMessage } from '@/services/contactService'
import { type ContactInput, type ContactMessage, contactSchema } from '@/types/contact'

const EMPTY_FORM: ContactInput = { name: '', email: '', message: '', website: '' }

// Junta a validação (React Hook Form + Zod) e o envio (TanStack Query).
// O componente só desenha os campos com o que este hook devolve.
export function useContactForm() {
  const form = useForm<ContactInput, unknown, ContactMessage>({
    resolver: zodResolver(contactSchema),
    defaultValues: EMPTY_FORM,
    // Valida ao sair do campo e, depois do primeiro erro, a cada tecla
    mode: 'onTouched',
  })

  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => form.reset(EMPTY_FORM),
  })

  const onSubmit = form.handleSubmit((message) => mutation.mutate(message))

  return { form, onSubmit, mutation }
}
