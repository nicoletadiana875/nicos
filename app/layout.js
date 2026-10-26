import "./globals.css";
import { Outfit } from "next/font/google";
import ConsentManager from "@/components/site/ConsentManager";
import { legal } from "@/config/legal.mjs";
import { baseUrl } from "@/config/settings.mjs";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap"
});

export const metadata = {
  metadataBase: new URL(baseUrl),
  // Verifica della proprieta' del sito su Google Search Console
  verification: { google: "4vnjmIv1NkrvGx_fa-WWu8iYSOaWUmBDyAdSY4wQoks" },
  // Finche' i testi legali sono in bozza (legal.draft) il sito non viene indicizzato
  robots: legal.draft ? { index: false, follow: false } : undefined,
  title: "Consulente Energetico | Consulenza commerciale luce e gas",
  description:
    "Consulenza energetica professionale per aziende, professionisti e privati. Analisi contratti e bollette, lettura mercati PUN/PSV e supporto commerciale continuativo.",
  keywords: [
    "consulente energetico",
    "consulente commerciale",
    "consulenza energetica",
    "analisi bollette",
    "consulenza commerciale energia",
    "aziende e professionisti"
  ],
  openGraph: {
    title: "Consulente Energetico",
    description:
      "Consulenza energetica professionale con metodo commerciale, visione mercato e supporto operativo.",
    type: "website",
    locale: "it_IT"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={outfit.variable}>
      <body>
        {children}
        <ConsentManager />
      </body>
    </html>
  );
}
