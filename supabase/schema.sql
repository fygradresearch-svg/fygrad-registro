-- FYGRAD | Esquema seguro para leads
-- Ejecutar UNA VEZ desde Supabase > SQL Editor como administrador del proyecto.
-- Nunca ejecutar desde el navegador.

create extension if not exists pgcrypto;

create table if not exists public.fygrad_registro (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 3 and 120),
  phone text not null check (phone ~ '^\+519[0-9]{8}$'),
  email text null check (email is null or char_length(email) <= 254),
  campaign_source text not null default 'landing-organica',
  consent_given boolean not null check (consent_given = true),
  consent_policy text not null,
  consented_at timestamptz not null default now(),
  submission_token uuid not null unique,
  created_at timestamptz not null default now()
);

create index if not exists fygrad_registro_phone_created_idx
  on public.fygrad_registro (phone, created_at desc);
create index if not exists fygrad_registro_created_at_idx
  on public.fygrad_registro (created_at desc);

-- El hash HMAC del IP solo se utiliza temporalmente como antispam;
-- la tabla no almacena direcciones IP en texto plano.
create table if not exists public.fygrad_rate_limits (
  ip_hash text primary key check (length(ip_hash) = 64),
  window_started_at timestamptz not null default now(),
  attempts integer not null default 1
);

alter table public.fygrad_registro enable row level security;
alter table public.fygrad_rate_limits enable row level security;

-- Prohibir SELECT/INSERT/UPDATE/DELETE de usuarios publicos y autenticados.
revoke all on table public.fygrad_registro from public, anon, authenticated;
revoke all on table public.fygrad_rate_limits from public, anon, authenticated;

-- Politicas de denegacion explicitas, reforzadas por REVOKE.
-- El backend usa exclusivamente service_role y la funcion RPC restringida.
drop policy if exists "no_public_leads" on public.fygrad_registro;
create policy "no_public_leads"
  on public.fygrad_registro for all to anon, authenticated
  using (false) with check (false);

drop policy if exists "no_public_rate_limits" on public.fygrad_rate_limits;
create policy "no_public_rate_limits"
  on public.fygrad_rate_limits for all to anon, authenticated
  using (false) with check (false);

-- Insercion atomica y control de abuso, ejecutados DENTRO de Postgres.
-- Bloqueo por telefono para evitar envios simultaneos con distintos UUID.
create or replace function public.register_fygrad_lead(
  p_full_name text,
  p_phone text,
  p_email text,
  p_campaign_source text,
  p_submission_token uuid,
  p_ip_hash text,
  p_consent_policy text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_attempts integer;
begin
  if p_phone !~ '^\+519[0-9]{8}$'
     or char_length(p_full_name) not between 3 and 120
     or char_length(p_campaign_source) not between 1 and 120
     or length(p_ip_hash) <> 64
     or p_consent_policy <> 'fygrad-privacy-2026-10'
  then
    raise exception 'Invalid request';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_phone, 1738)
  );

  if exists (select 1 from public.fygrad_registro where submission_token = p_submission_token) then
    return pg_catalog.jsonb_build_object('status', 'already_registered');
  end if;

  insert into public.fygrad_rate_limits (ip_hash, window_started_at, attempts)
  values (p_ip_hash, pg_catalog.now(), 1)
  on conflict (ip_hash) do update
  set attempts = case
        when public.fygrad_rate_limits.window_started_at < pg_catalog.now() - interval '15 minutes'
          then 1
        else public.fygrad_rate_limits.attempts + 1
      end,
      window_started_at = case
        when public.fygrad_rate_limits.window_started_at < pg_catalog.now() - interval '15 minutes'
          then pg_catalog.now()
        else public.fygrad_rate_limits.window_started_at
      end
  returning attempts into v_attempts;

  if v_attempts > 5 then
    return pg_catalog.jsonb_build_object('status', 'rate_limited');
  end if;

  -- Una consulta por mismo telefono cada seis horas: evita duplicados.
  if exists (
    select 1 from public.fygrad_registro
    where phone = p_phone and created_at > pg_catalog.now() - interval '6 hours'
  ) then
    return pg_catalog.jsonb_build_object('status', 'already_registered');
  end if;

  insert into public.fygrad_registro (
    full_name, phone, email, campaign_source, consent_given,
    consent_policy, consented_at, submission_token
  ) values (
    p_full_name, p_phone, p_email, p_campaign_source, true,
    p_consent_policy, pg_catalog.now(), p_submission_token
  );

  return pg_catalog.jsonb_build_object('status', 'created');
end;
$$;

-- No exponer el RPC a usuarios anonimos o autenticados.
revoke all on function public.register_fygrad_lead(text, text, text, text, uuid, text, text)
  from public, anon, authenticated;
grant execute on function public.register_fygrad_lead(text, text, text, text, uuid, text, text)
  to service_role;

-- Retencion: funcion para depurar leads de mas de 12 meses.
create or replace function public.purge_fygrad_old_data()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.fygrad_registro
    where created_at < pg_catalog.now() - interval '12 months';
  delete from public.fygrad_rate_limits
    where window_started_at < pg_catalog.now() - interval '2 days';
end;
$$;

revoke all on function public.purge_fygrad_old_data() from public, anon, authenticated;
grant execute on function public.purge_fygrad_old_data() to service_role;

-- IMPORTANTE para activar borrado programado:
-- En Supabase > Integrations > Cron (habilitar pg_cron), ejecutar UNA VEZ:
-- select cron.schedule(
--   'fygrad-retencion-diaria',
--   '0 3 * * *',
--   $$select public.purge_fygrad_old_data();$$
-- );
-- Si Cron no esta habilitado, programar equivalente en Vercel o ejecutar
-- la funcion periodicamente desde una tarea backend autenticada.
