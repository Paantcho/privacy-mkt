-- Creator Hunting — Schema Supabase
-- Executar no SQL Editor: https://supabase.com/dashboard/project/SEU_PROJETO/sql/new

create extension if not exists "pgcrypto";

create table if not exists public.creators (
  id           uuid primary key default gen_random_uuid(),
  canal        text not null default 'Instagram',
  pais         text not null default 'Brasil',
  analista     text,
  nome         text,
  tier         text not null default '—',
  segmento     text not null default '—',
  perfil_handle text not null default '',
  contato      boolean not null default true,
  respondido   boolean not null default false,
  status       text not null default 'Contatada',
  obs          text,
  archived     boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- RLS desabilitado para MVP (sem auth)
alter table public.creators disable row level security;

-- Política pública de leitura/escrita para MVP
grant all on public.creators to anon;
grant all on public.creators to authenticated;

-- Trigger para atualizar updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger creators_updated_at
  before update on public.creators
  for each row execute function public.set_updated_at();

-- Índices para performance dos filtros
create index if not exists creators_canal_idx      on public.creators(canal);
create index if not exists creators_pais_idx       on public.creators(pais);
create index if not exists creators_analista_idx   on public.creators(analista);
create index if not exists creators_status_idx     on public.creators(status);
create index if not exists creators_tier_idx       on public.creators(tier);
create index if not exists creators_segmento_idx   on public.creators(segmento);
create index if not exists creators_created_at_idx on public.creators(created_at desc);
create index if not exists creators_archived_idx   on public.creators(archived);

-- Migração (se a tabela já existir): adicionar coluna archived
-- alter table public.creators add column if not exists archived boolean not null default false;
