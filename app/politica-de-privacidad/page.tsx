import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloating } from "@/components/whatsapp-floating";
import { privacyEmail, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Información sobre el tratamiento de datos personales recibidos mediante el formulario de FyGrad.",
  alternates: { canonical: "/politica-de-privacidad" },
};

export default function PrivacyPolicy() {
  return <><SiteHeader />
    <main><section className="privacy-page"><div className="container-landing privacy-layout">
      <Link href="/" className="privacy-back"><ArrowLeft size={16}/> Volver al inicio</Link>
      <div className="privacy-hero"><span className="section-kicker"><span/> PRIVACIDAD Y DATOS</span><h1>Política de <em>privacidad.</em></h1><p>Información aplicable al formulario de contacto de FyGrad.</p><small>Versión: octubre de 2026</small></div>
      <article className="privacy-article">
        <section><h2>1. ¿Quién trata tus datos?</h2><p>FYGRAD S.A.C. (en adelante, “FyGrad”) trata los datos que compartes mediante este formulario. Para consultas sobre privacidad y ejercicio de derechos, utiliza nuestros canales oficiales indicados al final de esta política.</p></section>
        <section><h2>2. ¿Qué datos solicitamos?</h2><p>Recogemos tus nombres y apellidos, número de celular peruano, correo electrónico si decides proporcionarlo, fecha de registro, origen de la campaña y constancia del consentimiento. Como medida de seguridad utilizamos temporalmente un identificador irreversible derivado de la conexión para limitar el envío automatizado de formularios.</p></section>
        <section><h2>3. ¿Para qué usamos tus datos?</h2><p>Los usamos para contactar contigo, responder a la solicitud de información, explicarte los servicios académicos y sus alternativas de pago y dar seguimiento a esta consulta. No utilizaremos estos datos para finalidades distintas sin informarte cuando resulte necesario.</p></section>
        <section><h2>4. Consentimiento</h2><p>El tratamiento para atender esta solicitud se sustenta en el consentimiento expreso que brindas al marcar la casilla del formulario. Puedes no proporcionarlo, aunque en ese caso no podremos registrar la consulta por este medio.</p></section>
        <section><h2>5. Almacenamiento y seguridad</h2><p>Los datos se almacenan en una base de datos gestionada mediante Supabase. Restringimos el acceso a personal autorizado y aplicamos controles técnicos para evitar que visitantes públicos puedan consultar los registros. Para prevenir spam usamos Cloudflare Turnstile, que puede tratar datos técnicos de conexión conforme a sus políticas. Los proveedores tecnológicos podrían tratar información fuera del Perú según la región contratada; FyGrad debe verificar y documentar estas condiciones.</p></section>
        <section><h2>6. Conservación</h2><p>Para las consultas recibidas mediante este formulario, se ha definido un plazo máximo de conservación de 12 meses desde su registro, salvo obligación legal que justifique otro periodo. La eliminación programada debe estar habilitada en la infraestructura de producción.</p></section>
        <section><h2>7. Tus derechos</h2><p>Puedes solicitar información, acceso, rectificación, cancelación u oposición respecto de tus datos personales, así como revocar tu consentimiento cuando corresponda, de acuerdo con la normativa peruana de protección de datos personales. Para presentar una solicitud, comunícate mediante uno de los canales de privacidad indicados a continuación.</p></section>
        <section><h2>8. Canales de contacto</h2><p>Para consultas y solicitudes relacionadas con tus datos, contacta a FyGrad por WhatsApp al <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">+51 993 963 190 <ExternalLink size={13}/></a>{privacyEmail ? <> o al correo <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a></> : <>. También puedes pedir por ese canal el correo institucional y los datos de domicilio del responsable del tratamiento</>}.</p></section>
        <section><h2>9. Modificaciones</h2><p>Podremos actualizar esta política para reflejar cambios en el servicio, la infraestructura o la normativa aplicable. La versión vigente estará disponible permanentemente en esta dirección.</p></section>
      </article>
    </div></section></main>
    <SiteFooter /><WhatsAppFloating />
  </>;
}
