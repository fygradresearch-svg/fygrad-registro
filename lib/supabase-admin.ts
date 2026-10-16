import { createClient } from "@supabase/supabase-js";

/** Solo importar en rutas de servidor; nunca en componentes 'use client'. */
export function createAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase no configurado en el servidor");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
