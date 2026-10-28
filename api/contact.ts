// Função serverless da Vercel (POST /api/contact). Roda no servidor, então pode usar
// segredos que não podem ir para o navegador, como a chave do Resend (e-mail).
import { contactSchema } from '../src/types/contact.js'

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status })
}

// biome-ignore lint/style/useNamingConvention: a Vercel exige o nome do método HTTP (POST)
export async function POST(request: Request): Promise<Response> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  const resendKey = process.env.RESEND_API_KEY
  const ownerEmail = process.env.CONTACT_TO_EMAIL

  if (!supabaseUrl || !supabaseKey || !resendKey || !ownerEmail) {
    return reply(503, { error: 'O contato ainda não está configurado. Tente mais tarde.' })
  }

  const body: unknown = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return reply(400, { error: 'Confira os campos do formulário e tente de novo.' })
  }

  const { name, email, message, trap } = parsed.data
  // Robô preencheu o campo escondido: finge que deu certo e não salva nada
  if (trap) return reply(201, { ok: true })

  // 1. Salva no Supabase pela API REST. A regra de acesso (RLS) só deixa inserir
  const saved = await fetch(`${supabaseUrl}/rest/v1/messages`, {
    method: 'POST',
    // Só o cabeçalho apikey: funciona com a chave publishable nova (sb_publishable_...) e com a
    // anon antiga; sem Authorization, o Supabase trata o pedido como visitante (papel anon)
    headers: {
      apikey: supabaseKey,
      'content-type': 'application/json',
      prefer: 'return=minimal',
    },
    body: JSON.stringify({ name, email, message }),
  }).catch(() => null)
  if (!saved?.ok) {
    return reply(502, { error: 'Não foi possível salvar a mensagem. Tente de novo.' })
  }

  // 2. Avisa o dono por e-mail. Se falhar (inclusive por rede), a mensagem já está salva e
  // aparece no painel: responde sucesso para a pessoa não reenviar e duplicar a mensagem
  try {
    const emailed = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${resendKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: 'Portfólio <onboarding@resend.dev>',
        to: [ownerEmail],
        reply_to: email,
        subject: `Nova mensagem no portfólio: ${name}`,
        text: `Nome: ${name}\nE-mail: ${email}\n\n${message}`,
      }),
    })
    if (!emailed.ok) console.error('Resend respondeu', emailed.status, await emailed.text())
  } catch (error) {
    // Aparece nos logs da função na Vercel, para investigar sem perder a mensagem
    console.error('Falha ao chamar o Resend', error)
  }

  return reply(201, { ok: true })
}
