import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";

export function getClientIp(request: NextRequest): string {
  // En Vercel, el proxy fija la cabecera x-vercel-forwarded-for.
  // En otros alojamientos, configurar la red de proxies de confianza.
  const forwarded = request.headers.get("x-vercel-forwarded-for")
    ?? request.headers.get("x-forwarded-for")
    ?? "127.0.0.1";
  return forwarded.split(",")[0]?.trim().slice(0, 64) || "127.0.0.1";
}

export function hashIp(ip: string): string {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret || secret.length < 24) throw new Error("RATE_LIMIT_SECRET sin configurar");
  return createHmac("sha256", secret).update(ip).digest("hex");
}

export async function validateTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Turnstile es opcional: si no hay clave configurada, se omite la verificación.
  if (!secret) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(6500),
    });
    if (!result.ok) return false;
    const data: { success?: boolean; action?: string } = await result.json();
    return data.success === true && data.action === "lead_registration";
  } catch {
    return false;
  }
}
