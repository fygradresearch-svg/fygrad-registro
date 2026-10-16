import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

export function SiteFooter() {
  return <footer className="site-footer"><div className="container-landing footer-main">
      <div className="footer-brand"><Link href="/" aria-label="FyGrad, inicio"><Image src="/fygrad-logo.png" width={399} height={151} alt="FyGrad — Redactemos tu futuro" /></Link><p>Orientación y acompañamiento para tus proyectos académicos y de investigación científica.</p></div>
      <div className="footer-links"><span>EXPLORA</span><a href="#contacto">Hablemos</a></div>
      <div className="footer-links"><span>CONTACTO Y PRIVACIDAD</span><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp +51 993 963 190 <ArrowUpRight size={14}/></a><Link href="/politica-de-privacidad">Política de privacidad</Link></div>
    </div><div className="container-landing footer-bottom"><span>© {new Date().getFullYear()} FyGrad S.A.C. Todos los derechos reservados.</span><span>Creado para acompañar tu siguiente paso.</span></div>
  </footer>;
}
