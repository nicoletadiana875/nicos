import LegalDocument from "@/components/site/LegalDocument";
import { legal } from "@/config/legal.mjs";
import { termsDoc } from "@/content/legal";

export const metadata = {
  title: `${termsDoc.title} | Consulente Energetico`,
  description: "Condizioni di utilizzo del sito e del servizio di consulenza energetica.",
  robots: legal.draft ? { index: false, follow: false } : undefined,
};

export default function TermsPage() {
  return <LegalDocument doc={termsDoc} />;
}
