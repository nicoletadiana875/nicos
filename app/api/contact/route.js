import { NextResponse } from "next/server";
import { legal } from "@/config/legal.mjs";
import { rateLimit } from "@/lib/rateLimit";
import {
  MAX_FILE_BYTES,
  matchesFileSignature,
  validateContact,
} from "@/lib/contactRules";
import {
  createTransport,
  missingMailSettings,
  readMailSettings,
  sendConfirmationEmail,
  sendOwnerEmail,
} from "@/lib/mailer.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Su Vercel la durata predefinita e' di 10 secondi: l'invio via SMTP puo' richiedere di piu'
export const maxDuration = 30;

const FILE_EXT = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
};

function json(body, status = 200, headers = {}) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

export async function POST(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // Massimo 5 invii ogni 10 minuti per indirizzo (l'IP non viene registrato su disco)
  const { ok } = rateLimit(`contact:${ip}`, 5, 10 * 60_000);
  if (!ok) {
    return json({ error: "Troppe richieste. Riprova tra qualche minuto." }, 429, {
      "Retry-After": "600",
    });
  }

  // Rifiuta subito corpi palesemente troppo grandi (campi + allegato)
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > MAX_FILE_BYTES + 256 * 1024) {
    return json({ error: "Il file è troppo grande." }, 413);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Richiesta non valida." }, 400);
  }

  // Honeypot: i bot compilano il campo nascosto. Risposta di successo senza invio.
  if (String(form.get("website") ?? "").trim()) {
    return json({ ok: true });
  }

  const nome = String(form.get("nome") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const messaggio = String(form.get("messaggio") ?? "").trim();
  const privacy = form.get("privacy") === "on";
  const upload = form.get("bolletta");
  const file = upload && typeof upload === "object" && upload.size > 0 ? upload : null;

  const problem = validateContact({ nome, email, messaggio, privacy, file });
  if (problem) return json({ error: problem }, 400);

  let attachment = null;
  if (file) {
    const content = Buffer.from(await file.arrayBuffer());
    if (!matchesFileSignature(file.type, content)) {
      return json({ error: "Il file non risulta un PDF, JPG o PNG valido." }, 400);
    }
    attachment = {
      filename: `allegato-${nome.split(/\s+/)[0].replace(/[^\p{L}\p{N}-]/gu, "") || "cliente"}.${FILE_EXT[file.type]}`,
      content,
      contentType: file.type,
    };
  }

  const settings = readMailSettings();
  const missing = missingMailSettings(settings);
  if (missing.length) {
    console.error(`[contact] invio non configurato, mancano: ${missing.join(", ")}`);
    return json(
      { error: "L'invio dal modulo non è ancora attivo.", code: "not_configured" },
      503
    );
  }

  const transport = createTransport(settings);

  try {
    await sendOwnerEmail(settings, transport, {
      nome,
      email,
      messaggio,
      attachment,
      policyVersion: legal.version,
      // Il consenso promozionale viene registrato solo se previsto dalla configurazione
      promoConsent: legal.collectPromoConsent ? form.get("promo") === "on" : null,
    });
  } catch (error) {
    // Nessun dato personale nei log: solo il codice dell'errore
    console.error("[contact] invio fallito:", error?.code ?? error?.responseCode ?? "errore");
    return json({ error: "Non è stato possibile inviare la richiesta. Riprova tra poco." }, 502);
  }

  // Conferma al cliente: un suo eventuale errore non invalida la richiesta gia' consegnata
  if (settings.sendConfirmation) {
    try {
      await sendConfirmationEmail(settings, transport, { nome, email, hadAttachment: Boolean(attachment) });
    } catch (error) {
      console.error("[contact] conferma non inviata:", error?.code ?? "errore");
    }
  }

  return json({ ok: true });
}

// Solo POST: gli altri metodi non sono previsti
export async function GET() {
  return json({ error: "Metodo non consentito." }, 405, { Allow: "POST" });
}
