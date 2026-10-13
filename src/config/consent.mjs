// =====================================================================
//  REGISTRO DEI SERVIZI CHE USANO COOKIE O STRUMENTI NON TECNICI
// =====================================================================
//  Stato attuale (verificato sul codice): il sito NON usa cookie, NON usa
//  localStorage/sessionStorage, NON carica script di analisi, pubblicita',
//  mappe, video o social di terze parti. Non c'e' quindi nulla da
//  sottoporre a consenso e il banner non viene mostrato.
//
//  Se in futuro aggiungi uno strumento non strettamente necessario
//  (es. statistiche, pixel pubblicitario, video incorporati):
//    1. registralo qui sotto con la sua categoria;
//    2. carica lo script SOLO tramite <ConsentGate category="..."> o
//       useConsent("..."): non partira' finche' l'utente non acconsente;
//    3. aggiorna la Cookie Policy (si compila da sola da questo elenco).
//  Appena questo elenco non e' vuoto il banner compare automaticamente,
//  con "Accetta tutti", "Rifiuta tutti" e "Personalizza".
//
//  Formato di ogni voce:
//    {
//      id: "analytics-esempio",
//      category: "analytics" | "marketing" | "preferences",
//      name: "Nome dello strumento",
//      provider: "Societa' che lo fornisce",
//      purpose: "A cosa serve",
//      cookies: ["nome_cookie (durata)"],
//      privacyUrl: "https://...",
//    }
// =====================================================================

export const consentServices = [];

export const consentCategories = {
  analytics: {
    label: "Statistiche",
    description: "Ci aiutano a capire come viene usato il sito, in forma aggregata.",
  },
  marketing: {
    label: "Marketing",
    description: "Permettono di mostrare contenuti o annunci personalizzati.",
  },
  preferences: {
    label: "Preferenze",
    description: "Ricordano scelte come lingua o impostazioni di visualizzazione.",
  },
};

/** Il consenso serve solo se esiste almeno un servizio non strettamente necessario. */
export const consentRequired = consentServices.length > 0;

// Il consenso scade dopo 6 mesi, poi viene richiesto di nuovo (prassi del Garante)
export const CONSENT_MAX_AGE_DAYS = 180;
export const CONSENT_STORAGE_KEY = "consulente-energetico-consent";
// Cambiare questo numero (o la lista dei servizi) fa ripresentare il banner
export const CONSENT_SCHEMA_VERSION = 1;
