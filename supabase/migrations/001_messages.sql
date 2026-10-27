-- Tabela das mensagens do formulário de contato (AGENTS.md seção 4.5).
-- Rode no Supabase: SQL Editor > New query > cole este arquivo > Run.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 254),
  message text not null check (char_length(message) between 10 and 2000),
  answered boolean not null default false,
  created_at timestamptz not null default now()
);

-- Sem RLS, a chave pública (anon) leria tudo. Com RLS, só vale o que as políticas abaixo liberam.
alter table public.messages enable row level security;

-- Qualquer visitante pode enviar, mas não pode ler nem marcar como respondida
create policy "visitantes enviam mensagens"
  on public.messages for insert
  to anon
  with check (answered = false);

-- Só o dono logado (dashboard, dia 6) lê e atualiza.
-- Desligue o cadastro público em Authentication > Sign In / Providers, para ninguém mais criar conta.
create policy "dono lê as mensagens"
  on public.messages for select
  to authenticated
  using (true);

create policy "dono marca como respondida"
  on public.messages for update
  to authenticated
  using (true)
  with check (true);
