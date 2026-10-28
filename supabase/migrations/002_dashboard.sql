-- Dashboard (AGENTS.md seção 4.5): projetos em destaque e acesso restrito ao dono.
--
-- Como aplicar no Supabase:
-- 1. SQL Editor > New query > cole este arquivo inteiro > Run (deve aparecer "Success").
-- 2. Authentication > Users > Add user > Create new user: o e-mail abaixo e uma senha,
--    com "Auto Confirm User" marcado.
-- 3. Authentication > Sign In / Providers: desligue "Allow new users to sign up".

-- "Logado" não basta: o projeto é compartilhado com o CodeCam, que tem os próprios usuários.
-- Só a conta com o e-mail do dono pode ler as mensagens e mudar os destaques.
create or replace function portfolio.is_owner()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'rafael071007@gmail.com'
$$;

-- As políticas do 001 liberavam qualquer usuário logado; agora só o dono
drop policy if exists "dono lê as mensagens" on portfolio.messages;
drop policy if exists "dono marca como respondida" on portfolio.messages;

create policy "dono lê as mensagens"
  on portfolio.messages for select
  to authenticated
  using (portfolio.is_owner());

create policy "dono marca como respondida"
  on portfolio.messages for update
  to authenticated
  using (portfolio.is_owner())
  with check (portfolio.is_owner());

-- Projetos em destaque: aparecem primeiro em /projetos e na página inicial
create table if not exists portfolio.featured_projects (
  repo_name text primary key check (char_length(repo_name) between 1 and 100),
  position smallint not null check (position >= 0),
  updated_at timestamptz not null default now()
);

grant select on portfolio.featured_projects to anon, authenticated;
grant insert, delete on portfolio.featured_projects to authenticated;

alter table portfolio.featured_projects enable row level security;

create policy "todos veem os destaques"
  on portfolio.featured_projects for select
  to anon, authenticated
  using (true);

create policy "dono adiciona destaques"
  on portfolio.featured_projects for insert
  to authenticated
  with check (portfolio.is_owner());

create policy "dono remove destaques"
  on portfolio.featured_projects for delete
  to authenticated
  using (portfolio.is_owner());

-- Troca a lista inteira de uma vez: apagar e inserir dentro de uma função roda numa
-- transação só, então a lista nunca fica pela metade. "security invoker" faz as
-- políticas acima valerem: para outra pessoa, o delete e o insert são recusados
create or replace function portfolio.set_featured_projects(repo_names text[])
returns void
language sql
security invoker
set search_path = ''
as $$
  delete from portfolio.featured_projects where true;
  insert into portfolio.featured_projects (repo_name, position)
  select name, (ord - 1)::smallint
  from unnest(repo_names) with ordinality as list(name, ord);
$$;

revoke execute on function portfolio.set_featured_projects(text[]) from public, anon;
grant execute on function portfolio.set_featured_projects(text[]) to authenticated;

notify pgrst, 'reload schema';
