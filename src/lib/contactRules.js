// Regole del modulo contatti, condivise da client (Contact.jsx) e server (/api/contact).

// Su hosting serverless (es. Vercel) il corpo di una richiesta non puo' superare ~4,5 MB:
// 4 MB per l'allegato lascia margine per i campi del modulo.
export const MAX_FILE_MB = 4;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

export const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida i dati del modulo. Restituisce un messaggio di errore oppure null.
 * @param {{nome: string, email: string, messaggio: string, privacy: boolean, file?: File|Blob|null}} input
 */
export function validateContact({ nome, email, messaggio, privacy, file }) {
  if (!nome || nome.length < 2 || nome.length > 100) {
    return "Inserisci un nome valido (2–100 caratteri).";
  }
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return "Inserisci un indirizzo email valido.";
  }
  if (!messaggio || messaggio.length < 10 || messaggio.length > 2000) {
    return "Il messaggio deve essere tra 10 e 2000 caratteri.";
  }
  if (file && file.size > 0) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Formato non supportato. Usa PDF, JPG o PNG.";
    }
    if (file.size > MAX_FILE_BYTES) {
      return `Il file supera i ${MAX_FILE_MB} MB consentiti.`;
    }
  }
  if (!privacy) {
    return "Per inviare la richiesta conferma di aver letto l'informativa privacy.";
  }
  return null;
}

/** Controlla la firma binaria del file: il tipo dichiarato dal browser non e' affidabile. */
export function matchesFileSignature(type, bytes) {
  const startsWith = (...sig) => sig.every((b, i) => bytes[i] === b);
  if (type === "application/pdf") return startsWith(0x25, 0x50, 0x44, 0x46); // %PDF
  if (type === "image/jpeg") return startsWith(0xff, 0xd8, 0xff);
  if (type === "image/png") return startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  return false;
}
