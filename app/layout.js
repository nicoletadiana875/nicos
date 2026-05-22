import "./globals.css";

export const metadata = {
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
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
