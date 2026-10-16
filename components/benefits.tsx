import { ArrowUpRight, CalendarCheck2, Headset, WalletCards } from "lucide-react";
import { Reveal } from "./reveal";

const benefits = [
  {
    icon: WalletCards,
    no: "01",
    title: "Alternativas de pago",
    description: "Conoce las modalidades de pago disponibles según el servicio que elijas, con información clara desde el inicio.",
    className: "benefit-amber",
  },
  {
    icon: Headset,
    no: "02",
    title: "Atención personalizada",
    description: "Resolvemos tus consultas y te orientamos para que puedas tomar una decisión informada sobre tu proyecto.",
    className: "benefit-turquoise",
  },
  {
    icon: CalendarCheck2,
    no: "03",
    title: "Acompañamiento por etapas",
    description: "Te acompañamos durante las etapas y actividades acordadas para el desarrollo de tu proyecto académico.",
    className: "benefit-blue",
  },
];

export function Benefits() {
  return (
    <section className="benefits-section" id="beneficios" aria-labelledby="benefits-title">
      <div className="container-landing">
        <div className="benefits-heading">
          <Reveal><div className="section-kicker"><span/> POR QUÉ FYGRAD</div></Reveal>
          <Reveal delay={0.09}><h2 id="benefits-title">Más claridad para<br/><span>dar el siguiente paso.</span></h2></Reveal>
          <Reveal delay={0.16}><p>Una experiencia diseñada para que te enfoques en lo importante: tu desarrollo académico.</p></Reveal>
        </div>
        <div className="benefit-grid">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return <Reveal key={benefit.no} delay={index * 0.11}>
              <article className={`benefit-card ${benefit.className}`}>
                <div className="benefit-top"><div className="benefit-icon"><Icon size={25} strokeWidth={1.8} aria-hidden="true"/></div><span className="benefit-no">{benefit.no} / 03</span></div>
                <h3>{benefit.title}</h3><p>{benefit.description}</p>
                <span className="benefit-arrow" aria-hidden="true"><ArrowUpRight size={19} /></span>
              </article>
            </Reveal>;
          })}
        </div>
      </div>
    </section>
  );
}
