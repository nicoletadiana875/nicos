// =====================================================================
//  IMPOSTAZIONI CENTRALI DEL SITO  (valori NON segreti)
// =====================================================================
//  Per cambiare email, telefono o numero WhatsApp NON serve toccare il
//  codice: imposta le variabili d'ambiente indicate qui sotto (file
//  .env.local in locale, oppure il pannello del tuo hosting) e ripubblica.
//  Se una variabile non e' impostata si usa il valore predefinito.
//
//  Le credenziali di posta (SMTP_USER, SMTP_PASS...) NON stanno mai qui:
//  vedi .env.example.
//
//  Variabili:
//    NEXT_PUBLIC_CONTACT_EMAIL    email mostrata sul sito e destinataria delle richieste
//    NEXT_PUBLIC_CONTACT_PHONE    telefono in formato internazionale, es. +393890909665
//    NEXT_PUBLIC_WHATSAPP_NUMBER  numero WhatsApp senza "+", es. 393890909665
//    NEXT_PUBLIC_SITE_URL         indirizzo pubblico del sito, es. https://www.esempio.it
// =====================================================================

const clean = (value) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

export const DEFAULTS = {
  email: "nicoletadiana875@gmail.com",
  phone: "+393890909665",
  whatsapp: "393890909665",
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+\d{8,15}$/;

function pick(value, fallback, valid, name) {
  const candidate = clean(value);
  if (!candidate) return fallback;
  if (valid(candidate)) return candidate;
  console.warn(`[settings] ${name} non valido ("${candidate}"): uso il valore predefinito.`);
  return fallback;
}

// NB: i riferimenti a process.env.NEXT_PUBLIC_* devono restare scritti per esteso,
// altrimenti Next.js non li inserisce nel codice del browser.
export const contact = {
  email: pick(process.env.NEXT_PUBLIC_CONTACT_EMAIL, DEFAULTS.email, (v) => EMAIL_RE.test(v), "NEXT_PUBLIC_CONTACT_EMAIL"),
  phone: pick(process.env.NEXT_PUBLIC_CONTACT_PHONE, DEFAULTS.phone, (v) => PHONE_RE.test(v), "NEXT_PUBLIC_CONTACT_PHONE"),
  whatsapp: pick(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/^\+/, ""),
    DEFAULTS.whatsapp,
    (v) => /^\d{8,15}$/.test(v),
    "NEXT_PUBLIC_WHATSAPP_NUMBER"
  ),
};

/** "+393890909665" -> "+39 389 090 9665" (numeri italiani); altrimenti invariato. */
export function formatPhone(e164) {
  const m = /^\+39(\d{3})(\d{3})(\d{4})$/.exec(e164);
  return m ? `+39 ${m[1]} ${m[2]} ${m[3]}` : e164;
}

export const phoneDisplay = formatPhone(contact.phone);
export const phoneHref = `tel:${contact.phone}`;
export const whatsappUrl = `https://wa.me/${contact.whatsapp}`;
export const whatsappDisplay = formatPhone(`+${contact.whatsapp}`);
export const siteUrl = (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "").replace(/\/$/, "");

export const brand = {
  name: "Consulente Energetico",
  consultantName: "Nicoleta Diana Stinga",
};
