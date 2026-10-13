import LegalDocument from "@/components/site/LegalDocument";
import { legal } from "@/config/legal.mjs";
import { privacyDoc } from "@/content/legal";

export const metadata = {
  title: `${privacyDoc.title} | Consulente Energetico`,
  description:
    "Come vengono trattati i dati personali raccolti tramite il sito, il modulo di contatto, email, telefono e WhatsApp.",
  robots: legal.draft ? { index: false, follow: false } : undefined,
};

export default function PrivacyPage() {
  return <LegalDocument doc={privacyDoc} />;
}
