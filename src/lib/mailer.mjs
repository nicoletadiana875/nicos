// Invio delle email del modulo contatti.
// Condiviso tra il sito (/api/contact) e lo script di prova (npm run test:email),
// cosi' la prova verifica esattamente lo stesso percorso usato dai clienti.
//
// Variabili d'ambiente (vedi .env.example):
//   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS   server e account di posta (segreti)
//   CONTACT_TO        destinatario delle richieste (predefinito: NEXT_PUBLIC_CONTACT_EMAIL)
//   CONTACT_FROM      mittente mostrato nelle email    (predefinito: SMTP_USER)
//   CONTACT_CONFIRMATION=true    attiva l'email di conferma al cliente (predefinito: disattivata,
//                                perche' il modulo e' pubblico e la conferma verrebbe spedita a
//                                qualunque indirizzo digitato)

import nodemailer from "nodemailer";
import { DEFAULTS, EMAIL_RE, brand } from "../config/settings.mjs";

const clean = (v) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const oneLine = (s) => String(s).replace(/[\r\n]+/g, " ").trim();

export function readMailSettings(env = process.env) {
  const publicEmail = clean(env.NEXT_PUBLIC_CONTACT_EMAIL);
  const to = clean(env.CONTACT_TO) ?? (publicEmail && EMAIL_RE.test(publicEmail) ? publicEmail : DEFAULTS.email);

  const user = clean(env.SMTP_USER);
  const fromRaw = clean(env.CONTACT_FROM) ?? user ?? "";
  // Un indirizzo semplice viene presentato con il nome dell'attivita'
  const from = fromRaw && !fromRaw.includes("<") && EMAIL_RE.test(fromRaw) ? `"${brand.name}" <${fromRaw}>` : fromRaw;

  const port = Number(clean(env.SMTP_PORT) ?? 465);
  const secure = clean(env.SMTP_SECURE) ? env.SMTP_SECURE === "true" : port === 465;

  return {
    to,
    from,
    contactEmail: publicEmail && EMAIL_RE.test(publicEmail) ? publicEmail : to,
    smtp: {
      host: clean(env.SMTP_HOST),
      port,
      secure,
      user,
      pass: clean(env.SMTP_PASS),
      // Solo per prove in locale: in produzione la connessione deve essere sempre cifrata
      allowPlaintext: env.SMTP_ALLOW_PLAINTEXT === "true",
    },
    sendConfirmation: env.CONTACT_CONFIRMATION === "true",
    siteUrl: (clean(env.NEXT_PUBLIC_SITE_URL) ?? "").replace(/\/$/, ""),
  };
}

/** Nomi delle variabili obbligatorie ancora mancanti. */
export function missingMailSettings(s) {
  const missing = [];
  if (!s.smtp.host) missing.push("SMTP_HOST");
  if (!s.smtp.user) missing.push("SMTP_USER");
  if (!s.smtp.pass) missing.push("SMTP_PASS");
  if (!s.from) missing.push("CONTACT_FROM (o SMTP_USER)");
  if (!s.to || !EMAIL_RE.test(s.to)) missing.push("CONTACT_TO (indirizzo valido)");
  return missing;
}

export function createTransport(s) {
  return nodemailer.createTransport({
    host: s.smtp.host,
    port: s.smtp.port,
    secure: s.smtp.secure,
    // Se non e' una connessione cifrata fin dall'inizio, la cifratura (STARTTLS) e' obbligatoria
    requireTLS: !s.smtp.secure && !s.smtp.allowPlaintext,
    auth: { user: s.smtp.user, pass: s.smtp.pass },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 20_000,
  });
}

/**
 * Invia la richiesta al titolare. `attachment` = { filename, content (Buffer), contentType } | null.
 */
export async function sendOwnerEmail(s, transport, { nome, email, messaggio, attachment, policyVersion, promoConsent }) {
  const safeName = oneLine(nome);
  const lines = [
    "Nuova richiesta di consulenza dal sito.",
    "",
    `Nome: ${safeName}`,
    `Email: ${email}`,
    `Allegato: ${attachment ? `${attachment.filename} (${Math.round(attachment.content.length / 1024)} KB)` : "nessuno"}`,
    "",
    "Messaggio:",
    messaggio,
    "",
    "---",
    `Informativa privacy: presa visione dal cliente (versione ${policyVersion}) il ${new Date().toISOString()}`,
  ];
  if (promoConsent !== null) {
    lines.push(`Comunicazioni promozionali: consenso ${promoConsent ? "SI" : "NO"}`);
  }

  await transport.sendMail({
    from: s.from,
    to: s.to,
    replyTo: { name: safeName, address: email },
    subject: `Nuova richiesta dal sito – ${safeName}`,
    text: lines.join("\n"),
    attachments: attachment ? [attachment] : [],
  });
}

/** Conferma di ricezione al cliente: non riporta il testo del messaggio. */
export async function sendConfirmationEmail(s, transport, { email, hadAttachment }) {
  const privacyUrl = s.siteUrl ? `${s.siteUrl}/privacy` : null;
  const lines = [
    "Buongiorno,",
    "",
    "abbiamo ricevuto la tua richiesta di consulenza e ti risponderemo al più presto a questo indirizzo.",
    hadAttachment ? "Abbiamo ricevuto anche il documento che hai allegato." : null,
    "",
    "I dati che ci hai inviato vengono usati solo per rispondere alla tua richiesta.",
    privacyUrl ? `Informativa privacy: ${privacyUrl}` : null,
    "",
    `Se non sei stato tu a inviare la richiesta puoi ignorare questo messaggio, oppure scriverci a ${s.contactEmail}.`,
    "",
    `${brand.name} – ${brand.consultantName}`,
  ].filter((line) => line !== null);

  await transport.sendMail({
    from: s.from,
    to: email,
    replyTo: s.contactEmail,
    subject: `Abbiamo ricevuto la tua richiesta – ${brand.name}`,
    text: lines.join("\n"),
  });
}
