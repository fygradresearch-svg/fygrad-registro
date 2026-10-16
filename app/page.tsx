import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppFloating } from "@/components/whatsapp-floating";

export default function Home() {
  return <>
    <SiteHeader />
    <main id="main-content">
      <Hero />
    </main>
    <SiteFooter />
    <WhatsAppFloating />
  </>;
}
