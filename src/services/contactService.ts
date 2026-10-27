import type { ContactMessage } from '@/types/contact'

// Envia a mensagem para a função /api/contact, que salva no Supabase e manda o e-mail.
// O navegador nunca vê a chave do serviço de e-mail.
export async function sendContactMessage(message: ContactMessage): Promise<void> {
  let response: Response
  try {
    response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(message),
    })
  } catch {
    throw new Error('Sem conexão com o servidor. Confira sua internet e tente de novo.')
  }

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null)
    const serverMessage =
      body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
        ? body.error
        : null
    throw new Error(serverMessage ?? `O servidor respondeu com erro ${response.status}.`)
  }
}
