"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, CheckCircle2, LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import { cleanCampaignSource, normalizePeruvianPhone } from "@/lib/lead-schema";
import { whatsappUrl } from "@/lib/site";
import { Turnstile } from "./turnstile";

type FormFields = { fullName: string; phone: string; email: string; consent: boolean; website: string };
type FieldErrors = Partial<Record<"fullName" | "phone" | "email" | "consent" | "security", string>>;
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export function LeadForm() {
  const [fields, setFields] = useState<FormFields>({ fullName: "", phone: "", email: "", consent: false, website: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [campaignSource, setCampaignSource] = useState("landing-organica");
  const [submissionToken, setSubmissionToken] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);
  const inFlightRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCampaignSource(cleanCampaignSource(params.get("utm_campaign") || params.get("campaign") || "landing-organica"));
    setSubmissionToken(crypto.randomUUID());
  }, []);

  const update = (key: keyof FormFields, value: string | boolean) => {
    setFields((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    setFeedback("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlightRef.current || status === "success") return;
    const nextErrors: FieldErrors = {};
    if (fields.fullName.trim().length < 3) nextErrors.fullName = "Escribe tus nombres y apellidos.";
    if (!normalizePeruvianPhone(fields.phone)) nextErrors.phone = "Ingresa un celular peruano válido de 9 dígitos.";
    if (fields.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
      nextErrors.email = "Revisa el formato del correo electrónico.";
    }
    if (!fields.consent) nextErrors.consent = "Necesitamos tu consentimiento para atender la consulta.";
    if (siteKey && !turnstileToken) nextErrors.security = "Completa la verificación de seguridad.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    inFlightRef.current = true;
    setStatus("sending");
    setFeedback("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          campaignSource,
          submissionToken: submissionToken || crypto.randomUUID(),
          turnstileToken,
        }),
      });
      const payload: { success?: boolean; message?: string } = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.message || "No pudimos enviar la información.");
      setStatus("success");
    } catch (error) {
      setStatus("idle");
      setFeedback(error instanceof Error ? error.message : "Ocurrió un error. Inténtalo nuevamente.");
      if (siteKey) { setTurnstileToken(""); setTurnstileReset((previous) => previous + 1); }
    } finally {
      inFlightRef.current = false;
    }
  };

  return (
    <div className="contact-card" id="contacto">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div key="success" className="form-success" role="status"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.36 }}>
            <div className="success-decoration"><Check size={36} strokeWidth={3} /></div>
            <span className="form-tag"><span className="small-glow-dot"/> SOLICITUD ENVIADA</span>
            <h2>¡Tu siguiente paso ya comenzó!</h2>
            <p>Hemos recibido tu información. Nuestro equipo se pondrá en contacto contigo para conocer tu proyecto y explicarte las alternativas disponibles.</p>
            <div className="success-name"><CheckCircle2 size={19} /> Registro recibido correctamente</div>
            <a className="form-submit" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Prefiero escribir por WhatsApp <ArrowRight size={18}/></a>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 1 }} exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}>
            <div className="form-header">
              <span className="form-tag"><span className="small-glow-dot"/> CONTACTO PERSONALIZADO</span>
              <h2>Conversemos sobre <em>tu futuro.</em></h2>
              <p>Déjanos tus datos y recibe orientación sobre nuestros servicios y alternativas de pago.</p>
            </div>
            <form onSubmit={submit} noValidate aria-label="Formulario para solicitar información de FyGrad">
              <div className="form-field">
                <label htmlFor="fullName">Apellidos y nombres <span aria-hidden="true">*</span></label>
                <div className={`input-shell ${errors.fullName ? "input-error" : ""}`}>
                  <UserRound size={18} aria-hidden="true" />
                  <input id="fullName" name="fullName" type="text" autoComplete="name" maxLength={120}
                    placeholder="Ej. María Quispe Huamán" required value={fields.fullName}
                    aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    onChange={(event) => update("fullName", event.target.value)} />
                </div>
                {errors.fullName && <p className="field-error" id="fullName-error">{errors.fullName}</p>}
              </div>
              <div className="form-field">
                <label htmlFor="phone">Número de celular <span aria-hidden="true">*</span></label>
                <div className={`input-shell ${errors.phone ? "input-error" : ""}`}>
                  <Phone size={18} aria-hidden="true" />
                  <span className="phone-prefix" aria-hidden="true">+51</span>
                  <input id="phone" name="phone" type="tel" autoComplete="tel-national" inputMode="tel" maxLength={18}
                    placeholder="993 963 190" required value={fields.phone}
                    aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : "phone-help"}
                    onChange={(event) => update("phone", event.target.value)} />
                </div>
                {errors.phone ? <p className="field-error" id="phone-error">{errors.phone}</p> : <p className="input-help" id="phone-help">Solo números de celular de Perú</p>}
              </div>

              <div className="honeypot" aria-hidden="true">
                <label htmlFor="website">No completar este campo</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={fields.website}
                  onChange={(event) => update("website", event.target.value)} />
              </div>
              <div className="consent-wrap">
                <label className="consent-line" htmlFor="consent">
                  <input type="checkbox" id="consent" name="consent" checked={fields.consent}
                    onChange={(event) => update("consent", event.target.checked)} aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? "consent-error" : undefined} required />
                  <span>He leído la <Link href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer">Política de privacidad</Link> y autorizo el tratamiento de mis datos para recibir respuesta a esta consulta.</span>
                </label>
                {errors.consent && <p className="field-error" id="consent-error">{errors.consent}</p>}
              </div>
              {siteKey && <Turnstile siteKey={siteKey} onChange={setTurnstileToken} resetSignal={turnstileReset} />}
              {errors.security && <p className="field-error" role="alert">{errors.security}</p>}
              {feedback && <p className="form-alert" role="alert">{feedback}</p>}
              <button className="form-submit" type="submit" disabled={status === "sending"} aria-busy={status === "sending"}>
                {status === "sending" ? <><span className="button-spinner" aria-hidden="true" /> Enviando solicitud...</> : <>Solicitar información personalizada <ArrowRight size={18} aria-hidden="true" /></>}
              </button>
              <p className="form-privacy-note"><LockKeyhole size={14} aria-hidden="true" /> Tus datos se utilizarán para responder a tu consulta.</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="card-bottom-glow" aria-hidden="true" />
    </div>
  );
}
