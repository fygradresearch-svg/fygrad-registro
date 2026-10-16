import Image from "next/image";
import { ArrowDownRight, ArrowRight, CircleCheck, Sparkles } from "lucide-react";
import { Reveal } from "./reveal";
import { LeadForm } from "./lead-form";
import { whatsappUrl } from "@/lib/site";

export function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="aurora aurora-one" aria-hidden="true" />
      <div className="aurora aurora-two" aria-hidden="true" />
      <div className="hero-grid-texture" aria-hidden="true" />
      <div className="container-landing hero-layout">
        <div className="hero-content">
          <Reveal>
            <div className="eyebrow"><span className="eyebrow-dot" /> TU SIGUIENTE PASO COMIENZA AQUÍ <Sparkles size={13} aria-hidden="true" /></div>
          </Reveal>
          <Reveal delay={0.10}>
            <h1 id="hero-title">Invierte en tu<br/><span className="hero-highlight">futuro académico</span><br/>con confianza<span className="text-orange">.</span></h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="hero-description">En FyGrad creemos que dar el siguiente paso en tu desarrollo académico debe ser una decisión planificada. Por ello, contamos con alternativas de pago que se adaptan al servicio contratado y a las necesidades de cada proyecto.</p>
          </Reveal>
          <Reveal delay={0.27}>
            <div className="hero-actions">
              <a className="button button-primary" href="#contacto">Quiero recibir información <ArrowRight size={19} aria-hidden="true" /></a>
              <a className="button button-outline" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp <ArrowUpIcon /></a>
            </div>
          </Reveal>
          <Reveal delay={0.36}>
            <div className="trust-line" aria-label="Características del servicio">
              <span><CircleCheck size={16} aria-hidden="true"/> Atención personalizada</span>
              <span><CircleCheck size={16} aria-hidden="true"/> Información clara</span>
              <span><CircleCheck size={16} aria-hidden="true"/> Alternativas de pago</span>
            </div>
          </Reveal>
          <div className="hero-academic-art" aria-hidden="true">
            <div className="art-orbit art-orbit-outer"/><div className="art-orbit art-orbit-inner"/>
            <span className="art-node art-node-yellow"/><span className="art-node art-node-blue"/>
            <div className="art-center"><Image src="/fygrad-mark.png" alt="" width={92} height={151} /></div>
            <span className="art-tag art-tag-one">INVESTIGACIÓN <ArrowDownRight size={13}/></span>
            <span className="art-tag art-tag-two">TU PRÓXIMO PASO <span>↗</span></span>
          </div>
        </div>
        <Reveal delay={0.16} className="hero-form-wrap"><LeadForm /></Reveal>
      </div>
      <div className="hero-bottom-line" aria-hidden="true" />
    </section>
  );
}
function ArrowUpIcon() { return <ArrowRight className="arrow-diagonal" size={17} aria-hidden="true" />; }
