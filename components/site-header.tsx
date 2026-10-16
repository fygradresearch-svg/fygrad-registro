import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header" id="inicio">
      <div className="container-landing header-inner">
        <Link href="/" className="brand-link" aria-label="FyGrad, ir al inicio">
          <Image src="/fygrad-logo.png" alt="FyGrad — Redactemos tu futuro" width={399} height={151} className="brand-logo" priority />
        </Link>
        <nav className="header-nav" aria-label="Navegación principal">
          <a href="#contacto" className="header-cta">Hablemos <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" /></a>
        </nav>
        <a className="header-cta mobile-only" href="#contacto">Contáctanos <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
    </header>
  );
}
