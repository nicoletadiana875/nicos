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

// Il modulo si invia solo dal sito stesso: blocca i invii avviati da pagine di terzi
function isSameOrigin(request) {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// Legge il corpo con un tetto in byte, indipendente dall'intestazione Content-Length
async function readBodyCapped(request, maxBytes) {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > maxBytes) {
      await reader.cancel().catch(() => {});
      return "too_large";
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

const MAX_BODY_BYTES = MAX_FILE_BYTES + 256 * 1024;

export async function POST(request) {
  if (!isSameOrigin(request)) {
    return json({ error: "Richiesta non consentita." }, 403);
  }

  // Su Vercel l'IP del visitatore e' impostato dalla piattaforma e non e' falsificabile
  const ip =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";

  // Massimo 5 invii ogni 10 minuti per indirizzo (l'IP non viene registrato su disco)
  // e un tetto complessivo orario: protegge la casella da un invio massivo.
  // Il contatore e' per istanza: il limite vero va impostato anche nel Firewall di Vercel.
  const single = rateLimit(`contact:${ip}`, 5, 10 * 60_000);
  const overall = rateLimit("contact:all", 60, 60 * 60_000);
  if (!single.ok || !overall.ok) {
    return json({ error: "Troppe richieste. Riprova tra qualche minuto." }, 429, {
      "Retry-After": "600",
    });
  }

  // Rifiuta subito corpi palesemente troppo grandi (campi + allegato)
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > MAX_BODY_BYTES) {
    return json({ error: "Il file è troppo grande." }, 413);
  }

  // Lettura con tetto in byte: vale anche se manca Content-Length (invio a blocchi)
  const raw = await readBodyCapped(request, MAX_BODY_BYTES);
  if (raw === "too_large") return json({ error: "Il file è troppo grande." }, 413);
  if (!raw) return json({ error: "Richiesta non valida." }, 400);

  let form;
  try {
    form = await new Response(raw, {
      headers: { "content-type": request.headers.get("content-type") ?? "" },
    }).formData();
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
      await sendConfirmationEmail(settings, transport, { email, hadAttachment: Boolean(attachment) });
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
