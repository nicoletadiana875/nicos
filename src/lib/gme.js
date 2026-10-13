// Client per le API ufficiali del GME (Gestore dei Mercati Energetici).
// Documentazione: "Servizio API del GME – Guida tecnica" (mercatoelettrico.org > API).
// Richiede credenziali personali rilasciate dal GME: GME_API_USER e GME_API_PASSWORD.
//
//   POST /api/v1/Auth         { Login, Password }  ->  { Success, token }
//   POST /api/v1/RequestData  Authorization: Bearer <token>
//        { Platform, Segment, DataName, IntervalStart, IntervalEnd, Attributes }
//        -> { RequestId, FormatType, ResultRequest, ContentResponse }
//        ContentResponse = base64 di uno .zip contenente un .json

import { fromCompact, romeDateOffset, romeHour, toCompact } from "@/lib/time";
import { unzipFirstFile } from "@/lib/zip";

const BASE = process.env.GME_API_BASE || "https://api.mercatoelettrico.org/request";
const TIMEOUT_MS = 20_000;

// Dicitura di attribuzione prescritta dalle condizioni GME (art. 5)
export const GME_SOURCE = {
  name: "Gestore dei Mercati Energetici S.p.A.",
  url: "https://www.mercatoelettrico.org",
};

/**
 * L'integrazione si attiva SOLO se ci sono le credenziali E se e' stata confermata una
 * licenza GME per uso commerciale (GME_COMMERCIAL_LICENSE=confirmed).
 * La licenza standard dell'API e' limitata a un uso "informativo e di carattere privato" e
 * vieta usi economici/commerciali (condizioni generali API, artt. 5 e 6): mostrare i dati
 * sul sito di un'attivita' di consulenza richiede il consenso scritto di GME.
 */
export function gmeConfigured() {
  return Boolean(
    process.env.GME_API_USER &&
      process.env.GME_API_PASSWORD &&
      process.env.GME_COMMERCIAL_LICENSE === "confirmed"
  );
}

let tokenCache = { token: null, expiresAt: 0 };

function jwtExpiry(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    return payload.exp ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

async function authenticate(force = false) {
  if (!force && tokenCache.token && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.token;
  }

  const res = await fetch(`${BASE}/api/v1/Auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Login: process.env.GME_API_USER,
      Password: process.env.GME_API_PASSWORD,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`GME Auth HTTP ${res.status}`);

  const json = await res.json();
  const token = json.token ?? json.Token;
  if (!(json.Success ?? json.success) || !token) {
    throw new Error(`GME Auth rifiutata: ${json.Reason ?? json.reason ?? "motivo non indicato"}`);
  }

  tokenCache = {
    token,
    // Se il JWT non dichiara la scadenza si riautentica ogni 20 minuti
    expiresAt: jwtExpiry(token) || Date.now() + 20 * 60_000,
  };
  return token;
}

function rowsOf(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    const firstArray = Object.values(payload).find(Array.isArray);
    if (firstArray) return firstArray;
  }
  return [];
}

async function post(body, token) {
  return fetch(`${BASE}/api/v1/RequestData`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

/**
 * Richiede un dataset. Le date sono "YYYY-MM-DD".
 * Restituisce l'elenco delle righe (array di oggetti).
 */
export async function gmeRequest({ segment, dataName, start, end, attributes = {} }) {
  const build = (asString) => ({
    Platform: "PublicMarketResults",
    Segment: segment,
    DataName: dataName,
    // La guida indica "Intero" ma l'esempio usa una stringa: si prova prima l'intero
    IntervalStart: asString ? toCompact(start) : Number(toCompact(start)),
    IntervalEnd: asString ? toCompact(end) : Number(toCompact(end)),
    Attributes: attributes,
  });

  let token = await authenticate();
  let res = await post(build(false), token);

  if (res.status === 401) {
    token = await authenticate(true);
    res = await post(build(false), token);
  }
  if (res.status === 400) {
    res = await post(build(true), token);
  }
  if (!res.ok) throw new Error(`GME RequestData HTTP ${res.status}`);

  const json = await res.json();
  const content = json.ContentResponse ?? json.contentResponse;
  if (!content) {
    throw new Error(`GME: ${json.ResultRequest ?? json.resultRequest ?? "risposta senza dati"}`);
  }

  const format = String(json.FormatType ?? json.formatType ?? "");
  const buffer = Buffer.from(content, "base64");
  const text = /zip/i.test(format)
    ? unzipFirstFile(buffer).data.toString("utf8")
    : buffer.toString("utf8");

  return rowsOf(JSON.parse(text));
}

// ---- accesso ai campi senza dipendere dalle maiuscole ("Price" / "price")
function field(row, name) {
  if (name in row) return row[name];
  const lower = name.toLowerCase();
  for (const key of Object.keys(row)) {
    if (key.toLowerCase() === lower) return row[key];
  }
  return undefined;
}

const num = (v) => {
  const n = typeof v === "string" ? Number(v.replace(",", ".")) : Number(v);
  return Number.isFinite(n) ? n : null;
};

const mean = (list) => list.reduce((a, b) => a + b, 0) / list.length;
const round2 = (n) => Math.round(n * 100) / 100;

/** Serie giornaliera del PUN Index GME: [{date, value, hours}] ordinata per data. */
export async function getGmePunDaily({ daysBack = 1, daysForward = 1 } = {}) {
  const rows = await gmeRequest({
    segment: "MGP",
    dataName: "ME_ZonalPrices",
    start: romeDateOffset(-daysBack),
    end: romeDateOffset(daysForward),
    // Dal 1 ottobre 2025 il MGP e' a 15 minuti: si chiede la media oraria
    attributes: { GranularityType: "PT60" },
  });

  const byDate = new Map();
  for (const row of rows) {
    if (String(field(row, "Zone") ?? "").toUpperCase() !== "PUN") continue;
    if (/cancel/i.test(String(field(row, "Notes") ?? ""))) continue;
    const price = num(field(row, "Price"));
    const flow = field(row, "FlowDate");
    if (price == null || flow == null) continue;
    const date = fromCompact(flow);
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push({ hour: num(field(row, "Hour")), price });
  }

  return [...byDate.entries()]
    .map(([date, list]) => ({
      date,
      value: round2(mean(list.map((r) => r.price))),
      intervals: list.length,
      list,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Prezzo PUN dell'ora in corso (se la data richiesta e' oggi). */
export function currentHourPrice(day, now = new Date()) {
  if (!day) return null;
  const hour = romeHour(now) + 1; // GME: ora 1 = 00:00-01:00
  const match = day.list.find((r) => r.hour === hour);
  return match ? { value: round2(match.price), hour } : null;
}

/** Indice gas IGI (riferimento ufficiale GME per il gas day-ahead). */
export async function getGmeGasIndex() {
  const rows = await gmeRequest({
    segment: "IGI",
    dataName: "GAS_IGIndex",
    start: romeDateOffset(-14),
    end: romeDateOffset(1),
  });

  const parsed = rows
    .map((row) => ({
      flow: field(row, "FlowDate"),
      product: String(field(row, "Product") ?? ""),
      price: num(field(row, "Price")),
    }))
    .filter((r) => r.flow != null && r.price != null && r.price > 0)
    .map((r) => ({ ...r, date: fromCompact(r.flow) }));

  if (!parsed.length) throw new Error("GME: nessun valore IGI disponibile");

  const latestDate = parsed.map((r) => r.date).sort().at(-1);
  const latest = parsed.filter((r) => r.date === latestDate);
  // Se l'indice e' pubblicato per piu' prodotti si preferisce il day-ahead
  const chosen = latest.find((r) => /day|\bDA\b|G\+1|giorn/i.test(r.product)) ?? latest[0];

  const history = parsed
    .filter((r) => r.product === chosen.product)
    .map((r) => ({ date: r.date, value: round2(r.price) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    date: latestDate,
    value: round2(chosen.price),
    product: chosen.product || null,
    history,
  };
}
