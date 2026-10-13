import LegalDocument from "@/components/site/LegalDocument";
import { legal } from "@/config/legal.mjs";
import { cookieDoc } from "@/content/legal";

export const metadata = {
  title: `${cookieDoc.title} | Consulente Energetico`,
  description: "Quali cookie e strumenti simili usa il sito e come gestire le preferenze.",
  robots: legal.draft ? { index: false, follow: false } : undefined,
};

export default function CookiePage() {
  return <LegalDocument doc={cookieDoc} />;
}
