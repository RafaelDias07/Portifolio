import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { sendContactMessage } from '@/services/contactService'
import { type ContactInput, type ContactMessage, contactSchema } from '@/types/contact'

const EMPTY_FORM: ContactInput = { name: '', email: '', message: '', trap: '' }

// A caixa "Enviando" fica pelo menos esse tempo na tela; sem isso ela pisca e some
const MIN_SENDING_MS = 1200

async function sendWithMinimumDuration(message: ContactMessage) {
  const [result] = await Promise.all([
    sendContactMessage(message),
    new Promise((resolve) => setTimeout(resolve, MIN_SENDING_MS)),
  ])
  return result
}

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
    mutationFn: sendWithMinimumDuration,
    onSuccess: () => form.reset(EMPTY_FORM),
  })

  const onSubmit = form.handleSubmit((message) => mutation.mutate(message))

  // Fecha a confirmação e devolve o foco ao primeiro campo, pronto para outra mensagem
  const { reset } = mutation
  const { setFocus } = form
  const backToForm = useCallback(() => {
    reset()
    setTimeout(() => setFocus('name'))
  }, [reset, setFocus])

  return { form, onSubmit, mutation, backToForm }
}
