// =====================================================================
//  DATI LEGALI E PRIVACY  (valori NON segreti)
// =====================================================================
//  Qui vanno inseriti i dati che le pagine Privacy, Cookie e Termini
//  richiamano. Cio' che e' lasciato vuoto ("") compare nelle pagine come
//  segnaposto evidenziato "DA COMPLETARE": nulla e' stato inventato.
//
//  Prima della pubblicazione:
//    1. compila i campi vuoti;
//    2. fai verificare i testi da un professionista (avvocato / consulente privacy);
//    3. imposta draft: false;
//    4. esegui  npm run check:legal  per controllare che non manchi nulla.
// =====================================================================

import { brand, contact, phoneDisplay } from "./settings.mjs";

export const legal = {
  // true = le pagine mostrano l'avviso "bozza" e chiedono ai motori di ricerca di non indicizzarle
  draft: true,

  // Identificativo della versione delle informative: viene registrato insieme a ogni richiesta
  // ricevuta per poter dimostrare quale testo era visibile al momento dell'invio.
  // Aggiornalo ogni volta che modifichi i testi in modo sostanziale.
  version: "2026-10-13-bozza",
  lastUpdated: "13 ottobre 2026",

  // Raccogliere un consenso SEPARATO e facoltativo per comunicazioni promozionali?
  // Lascia false finche' non svolgi davvero attivita' promozionali/newsletter.
  collectPromoConsent: false,

  controller: {
    name: brand.consultantName, // nome gia' presente sul sito
    activity: brand.name,
    role: "", // es. ditta individuale, libera professionista, agente... (da stabilire)
    address: "",
    vatNumber: "",
    taxCode: "",
    pec: "",
    email: contact.email,
    phone: phoneDisplay,
  },

  // Responsabile della protezione dei dati: scrivi se e' stato nominato (e come contattarlo)
  // oppure la dicitura corretta per la tua situazione, stabilita con il professionista.
  dpo: "",

  // Tempi di conservazione: DA DEFINIRE (con il professionista). Non sono stati inventati.
  retention: {
    requests: "", // richieste di contatto che non portano a un incarico
    documents: "", // bollette e documenti ricevuti
    contractual: "", // dati relativi a un incarico (obblighi civilistici e fiscali)
    promotional: "", // solo se raccogli il consenso promozionale
  },

  providers: {
    // Rilevato dalla configurazione del progetto: il repository e' collegato a Vercel
    // (deploy automatici da GitHub, indirizzo nicos-zeta.vercel.app). Da confermare nel pannello Vercel.
    hosting: "Vercel Inc. (piattaforma di hosting)",
    // Le funzioni del sito (quindi il modulo contatti) sono vincolate alla regione di Francoforte
    // da vercel.json. I contenuti statici sono distribuiti dalla rete globale del fornitore.
    hostingLocation:
      "regione di Francoforte (UE) per l'elaborazione delle richieste del modulo; contenuti statici distribuiti dalla rete globale del fornitore",
    // Casella email che riceve le richieste. Da confermare se usi un altro servizio.
    emailService: "Google (servizio Gmail)",
  },

  terms: {
    fees: "", // compensi/condizioni economiche oltre alla prima analisi gratuita
    supplierRelationship: "", // rapporto con i fornitori di energia (mandati, provvigioni, indipendenza)
    jurisdiction: "", // foro/legge applicabile se diversi dalle regole generali
  },
};

/** Etichette dei segnaposto: servono sia alle pagine sia allo script check:legal. */
export const fieldLabels = {
  "controller.role": "forma giuridica / qualifica del titolare",
  "controller.address": "indirizzo della sede o dello studio",
  "controller.vatNumber": "partita IVA",
  "controller.taxCode": "codice fiscale",
  "controller.pec": "indirizzo PEC",
  dpo: "Responsabile della protezione dei dati (se nominato)",
  "retention.requests": "tempo di conservazione delle richieste senza incarico",
  "retention.documents": "tempo di conservazione di bollette e documenti ricevuti",
  "retention.contractual": "tempo di conservazione dei dati contrattuali",
  "retention.promotional": "tempo di conservazione dei dati per comunicazioni promozionali",
  "providers.hosting": "fornitore di hosting del sito",
  "providers.hostingLocation": "sede dei server del sito",
  "terms.fees": "compensi e condizioni economiche del servizio",
  "terms.supplierRelationship": "rapporto con i fornitori di energia e con eventuali provvigioni",
  "terms.jurisdiction": "foro e legge applicabile",
};

/**
 * Natura di ogni campo, per sapere chi deve fornirlo:
 *  - dato:           informazione che conosci solo tu (identita' dell'attivita')
 *  - decisione:      scelta tua sul modo di lavorare
 *  - professionista: va stabilito con un consulente privacy / legale
 *  - verificato:     ricavato dalla configurazione del progetto, da confermare
 */
export const fieldKinds = {
  "controller.role": "dato",
  "controller.address": "dato",
  "controller.vatNumber": "dato",
  "controller.taxCode": "dato",
  "controller.pec": "dato",
  dpo: "professionista",
  "retention.requests": "professionista",
  "retention.documents": "professionista",
  "retention.contractual": "professionista",
  "retention.promotional": "professionista",
  "providers.hosting": "verificato",
  "providers.hostingLocation": "verificato",
  "terms.fees": "decisione",
  "terms.supplierRelationship": "decisione",
  "terms.jurisdiction": "professionista",
};

export const kindTitles = {
  dato: "Dati che solo tu conosci",
  decisione: "Decisioni tue sul modo di lavorare",
  professionista: "Da stabilire con un professionista",
  verificato: "Ricavati dal progetto: da confermare",
};

/** Campi obbligatori per la pubblicazione (promozionali solo se il consenso e' attivo). */
export function requiredFields() {
  const base = Object.keys(fieldLabels).filter((k) => k !== "retention.promotional");
  return legal.collectPromoConsent ? [...base, "retention.promotional"] : base;
}

export function getValue(path, source = legal) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), source);
}

export function missingFields() {
  return requiredFields().filter((path) => {
    const v = getValue(path);
    return typeof v !== "string" || !v.trim();
  });
}
