import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "FyGrad | Tu siguiente paso académico comienza aquí", template: "%s | FyGrad" },
  description:
    "Conoce las alternativas de pago, la atención personalizada y el acompañamiento académico de FyGrad. Solicita información para tu proyecto.",
  applicationName: "FyGrad",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Invierte en tu futuro académico con confianza | FyGrad",
    description: "Conoce las alternativas de pago y recibe orientación personalizada para tu proyecto académico.",
    type: "website",
    url: "/",
    siteName: "FyGrad",
    locale: "es_PE",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#061623",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
