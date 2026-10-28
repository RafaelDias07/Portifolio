import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { signIn } from '@/services/authService'
import { type LoginCredentials, type LoginInput, loginSchema } from '@/types/auth'

// Validação (React Hook Form + Zod) e envio do login. Quem decide para onde ir depois
// é a página, pelo onSuccess
export function useLoginForm(onSuccess: () => void) {
  const form = useForm<LoginInput, unknown, LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  })

  const mutation = useMutation({ mutationFn: signIn, onSuccess })

  const onSubmit = form.handleSubmit((credentials) => mutation.mutate(credentials))

  return { form, onSubmit, mutation }
}
