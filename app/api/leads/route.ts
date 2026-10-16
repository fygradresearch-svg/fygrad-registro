import { NextRequest, NextResponse } from "next/server";
import { cleanCampaignSource, leadSchema, normalizePeruvianPhone } from "@/lib/lead-schema";
import { createAdminClient } from "@/lib/supabase-admin";
import { getClientIp, hashIp, validateTurnstile } from "@/lib/security";

export const runtime = "nodejs";

const json = (message: string, status: number) =>
  NextResponse.json({ success: false, message }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: NextRequest) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return json("Solicitud no permitida.", 403);

  // Evita payloads excesivos antes de parsear JSON. Un maximo real tambien
  // requiere configurar limite en el proxy inverso / WAF de produccion.
  if (Number(request.headers.get("content-length") || 0) > 12_000) {
    return json("Solicitud demasiado grande.", 413);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json("Formato de solicitud no valido.", 415);
  }

  let input: unknown;
  try {
    const body = await request.text();
    if (body.length > 12_000) return json("Solicitud demasiado grande.", 413);
    input = JSON.parse(body);
  } catch {
    return json("No pudimos leer los datos del formulario.", 400);
  }

  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) return json("Revisa los campos e intenta nuevamente.", 422);
  const data = parsed.data;

  // Honeypot: parece haber sido enviado por un bot.
  if (data.website.trim()) {
    return NextResponse.json({ success: true, message: "Solicitud recibida." }, { status: 200 });
  }
  const phone = normalizePeruvianPhone(data.phone);
  if (!phone) return json("Ingresa un celular peruano valido de 9 digitos.", 422);
  const fullName = data.fullName.replace(/\s+/g, " ").trim();
  if (fullName.length < 3 || !/^[\p{L}\p{M} .'-]+$/u.test(fullName)) {
    return json("Ingresa tus nombres y apellidos correctamente.", 422);
  }

  const ip = getClientIp(request);
  if (!(await validateTurnstile(data.turnstileToken, ip))) {
    return json("No pudimos verificar tu solicitud. Vuelve a intentarlo.", 400);
  }

  try {
    const admin = createAdminClient();
    const ipHash = hashIp(ip);
    const { data: outcome, error } = await admin.rpc("register_fygrad_lead", {
      p_full_name: fullName,
      p_phone: phone,
      p_email: data.email.trim().toLowerCase() || null,
      p_campaign_source: cleanCampaignSource(data.campaignSource),
      p_submission_token: data.submissionToken,
      p_ip_hash: ipHash,
      p_consent_policy: "fygrad-privacy-2026-10",
    });

    if (error) {
      console.error("Error guardando lead en Supabase:", error.code);
      return json("No se pudo registrar la solicitud. Intentalo otra vez.", 500);
    }
    const status = (outcome as { status?: string } | null)?.status;
    if (status === "rate_limited") return json("Has enviado varias solicitudes. Prueba nuevamente en 15 minutos.", 429);
    if (status === "created" || status === "already_registered") {
      return NextResponse.json(
        { success: true, message: "Recibimos tu solicitud. El equipo FyGrad se pondra en contacto contigo." },
        { status: status === "created" ? 201 : 200, headers: { "Cache-Control": "no-store" } },
      );
    }
    return json("No pudimos completar el registro.", 500);
  } catch {
    console.error("Error de configuracion al registrar lead");
    return json("El formulario no esta disponible temporalmente. Escribenos por WhatsApp.", 503);
  }
}
