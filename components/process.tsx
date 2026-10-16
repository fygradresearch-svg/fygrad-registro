import { ArrowRight, BadgeCheck, MessageSquareText, MoveUpRight, Send } from "lucide-react";
import { Reveal } from "./reveal";
import { whatsappUrl } from "@/lib/site";

export function ProcessSection() {
  return <section className="process-section" id="como-funciona" aria-labelledby="process-title">
    <div className="container-landing">
      <div className="process-panel">
        <div className="process-radial" aria-hidden="true" />
        <Reveal className="process-left">
          <span className="section-kicker kicker-light"><span/> SIMPLE Y DIRECTO</span>
          <h2 id="process-title">Cada gran avance<br/>empieza con <em>una conversación.</em></h2>
          <p>Cuéntanos en qué etapa estás. Te ayudaremos a conocer las opciones de acompañamiento disponibles para ti.</p>
          <a href="#contacto" className="button process-button">Solicitar orientación <MoveUpRight size={17} aria-hidden="true" /></a>
        </Reveal>
        <div className="process-steps" aria-label="Pasos para recibir orientación">
          <Reveal delay={0.12}><div className="process-step"><div className="step-icon"><Send size={20}/></div><div><span>PASO 01</span><h3>Déjanos tu consulta</h3><p>Completa el formulario o escríbenos directamente.</p></div><ArrowRight size={17} className="step-arrow"/></div></Reveal>
          <Reveal delay={0.22}><div className="process-step"><div className="step-icon"><MessageSquareText size={20}/></div><div><span>PASO 02</span><h3>Conversemos sobre tu proyecto</h3><p>Escuchamos tus necesidades y resolvemos tus dudas.</p></div><ArrowRight size={17} className="step-arrow"/></div></Reveal>
          <Reveal delay={0.32}><div className="process-step"><div className="step-icon"><BadgeCheck size={20}/></div><div><span>PASO 03</span><h3>Conoce tus alternativas</h3><p>Revisa el alcance, las etapas y las opciones de pago.</p></div><ArrowRight size={17} className="step-arrow"/></div></Reveal>
        </div>
      </div>
    </div>
    <div className="container-landing process-note"><span>FYGRAD · REDACTEMOS TU FUTURO</span><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">¿Tienes una consulta? Estamos para orientarte <MoveUpRight size={16}/></a></div>
  </section>;
}
