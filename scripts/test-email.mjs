// Prova dell'invio email, con la configurazione REALE del sito.
//
//   npm run test:email                 invia un'email di prova (con un PDF allegato) a CONTACT_TO
//   npm run test:email -- --check      controlla solo la configurazione e la connessione, senza inviare
//   npm run test:email -- --confirm    prova anche l'email di conferma al cliente (a CONTACT_TO)
//
// Da eseguire dopo ogni cambio di indirizzo o di credenziali.

import { existsSync } from "node:fs";
import { createTransport, missingMailSettings, readMailSettings, sendConfirmationEmail, sendOwnerEmail } from "../src/lib/mailer.mjs";

for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

const args = process.argv.slice(2);
const settings = readMailSettings();
const mask = (v) => (v ? v.replace(/(^.).*(@.*$)/, "$1***$2") : "(non impostato)");

console.log("Configurazione email");
console.log("  destinatario richieste :", settings.to);
console.log("  mittente               :", settings.from || "(non impostato)");
console.log("  server SMTP            :", settings.smtp.host ? `${settings.smtp.host}:${settings.smtp.port} (${settings.smtp.secure ? "TLS" : "STARTTLS"})` : "(non impostato)");
console.log("  account SMTP           :", mask(settings.smtp.user));
console.log("  conferma al cliente    :", settings.sendConfirmation ? "attiva" : "disattivata");

const missing = missingMailSettings(settings);
if (missing.length) {
  console.error("\nERRORE: impostazioni mancanti:", missing.join(", "));
  console.error("Copia .env.example in .env.local e compila i valori (vedi README).");
  process.exit(1);
}

const transport = createTransport(settings);

try {
  await transport.verify();
  console.log("\nOK  connessione e login al server di posta riusciti.");
} catch (error) {
  console.error("\nERRORE: connessione o login non riusciti:", error.code ?? "", error.message);
  console.error("Controlla SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS (con Gmail serve una 'password per le app').");
  process.exit(1);
}

if (args.includes("--check")) process.exit(0);

// PDF minimo ma valido: serve a verificare anche la ricezione degli allegati
const pdf = Buffer.from(
  "%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
    "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 100]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n"
);

try {
  await sendOwnerEmail(settings, transport, {
    nome: "Prova di configurazione",
    email: settings.to,
    messaggio: "Questa è un'email di prova inviata dallo script test:email. Se la leggi, l'invio e la ricezione funzionano.",
    attachment: { filename: "allegato-di-prova.pdf", content: pdf, contentType: "application/pdf" },
    policyVersion: "prova",
    promoConsent: null,
  });
  console.log(`OK  email di prova inviata a ${settings.to} (con allegato PDF). Controlla la casella, anche lo spam.`);

  if (args.includes("--confirm")) {
    await sendConfirmationEmail(settings, transport, { nome: "Prova", email: settings.to, hadAttachment: true });
    console.log(`OK  email di conferma-cliente di prova inviata a ${settings.to}.`);
  }
} catch (error) {
  console.error("ERRORE: invio non riuscito:", error.code ?? "", error.message);
  process.exit(1);
}
