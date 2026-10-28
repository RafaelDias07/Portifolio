-- Tabela das mensagens do formulário de contato (AGENTS.md seção 4.5).
-- Fica num schema próprio, "portfolio", separado das tabelas do CodeCam que estão no "public"
-- do mesmo projeto (o Prisma do CodeCam só mexe no "public").
--
-- Como aplicar no Supabase:
-- 1. SQL Editor > New query > cole este arquivo inteiro > Run (deve aparecer "Success").
-- 2. Project Settings > Data API > Exposed schemas: acrescente "portfolio" e salve.

create schema if not exists portfolio;

create table if not exists portfolio.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null check (char_length(email) <= 254),
  message text not null check (char_length(message) between 10 and 2000),
  answered boolean not null default false,
  created_at timestamptz not null default now()
);

-- Um schema novo não vem liberado para a API: o visitante (anon) e o dono logado
-- (authenticated) precisam de permissão para usar o schema e a tabela
grant usage on schema portfolio to anon, authenticated;
grant insert on portfolio.messages to anon;
grant select, update on portfolio.messages to authenticated;

-- Sem RLS, as permissões acima valeriam para qualquer linha. Com RLS, só vale o que as
-- políticas abaixo liberam
alter table portfolio.messages enable row level security;

-- Qualquer visitante pode enviar, mas não pode ler nem marcar como respondida
create policy "visitantes enviam mensagens"
  on portfolio.messages for insert
  to anon
  with check (answered = false);

-- Só o dono logado (dashboard, dia 6) lê e atualiza.
-- Desligue o cadastro público em Authentication > Sign In / Providers, para ninguém mais criar conta.
create policy "dono lê as mensagens"
  on portfolio.messages for select
  to authenticated
  using (true);

create policy "dono marca como respondida"
  on portfolio.messages for update
  to authenticated
  using (true)
  with check (true);

-- Avisa a API do Supabase para enxergar o schema e a tabela novos na hora
notify pgrst, 'reload schema';
