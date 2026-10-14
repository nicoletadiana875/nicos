// PSV day-ahead: media mensile, come pubblicata da ARERA.
//
// Ogni mese ARERA comunica il valore della componente C_MEM,m (materia prima gas del servizio di
// tutela della vulnerabilita'), che "viene aggiornata da ARERA come media mensile del prezzo sul
// mercato all'ingrosso italiano (il PSV day ahead) e pubblicata entro i primi 2 giorni lavorativi
// del mese successivo".
//
// Riuso: i dati pubblicati sul sito ARERA sono riutilizzabili indicando la fonte (licenza
// CC BY-SA 4.0, termini e condizioni d'uso del sito). Si legge soltanto il valore numerico:
// non si riproducono pagine, testi o il logo.

const BASE = "https://www.arera.it";
const LIST_URL = `${BASE}/comunicati-stampa`;
const OK_TTL = 12 * 60 * 60_000;
const FAIL_TTL = 30 * 60_000;
const MONTHS = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

export const PSV_SOURCE_NAME = "ARERA (valore pubblicato ogni mese, licenza CC BY-SA 4.0)";

let cache = { at: 0, ttl: 0, value: undefined };

const headers = {
  "User-Agent": "SitoConsulenteEnergetico/1.0 (lettura valore mensile pubblicato)",
  Accept: "text/html",
};

async function getText(url) {
  const res = await fetch(url, { headers, cache: "no-store", signal: AbortSignal.timeout(15_000) });
  if (!res.ok) return null;
  return res.text();
}

function toPlainText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&euro;|&#8364;/g, "€")
    .replace(/\s+/g, " ");
}

/** Estrae il valore in €/MWh e verifica che la pagina riguardi davvero il mese atteso. */
function parsePage(html, year, monthIndex) {
  const text = toPlainText(html);
  if (!/materia prima/i.test(text) || !/vulnerabilit/i.test(text)) return null;
  if (!text.toLowerCase().includes(`${MONTHS[monthIndex]} ${year}`)) return null;

  const found = [...text.matchAll(/(\d{1,3}(?:\.\d{3})*(?:,\d+)?)\s*(?:€|euro)\s*\/\s*MWh/gi)]
    .map((m) => Number(m[1].replace(/\./g, "").replace(",", ".")))
    .filter((n) => Number.isFinite(n) && n >= 5 && n <= 500);
  if (!found.length) return null;
  return Math.round(found[0] * 100) / 100;
}

function slugCandidates(year, monthIndex) {
  const m = MONTHS[monthIndex];
  return [
    `nota-stampa-gas-arera-comunica-valore-materia-prima-servizio-tutela-vulnerabilita-${m}-${year}`,
    `nota-stampagas-arera-comunica-valore-materia-prima-servizio-tutela-vulnerabilita-${m}-${year}`,
    `gas-arera-comunica-il-valore-della-materia-prima-del-servizio-di-tutela-della-vulnerabilita-per-${m}-${year}`,
    `gas-arera-comunica-il-valore-della-materia-prima-del-servizio-di-tutela-della-vulnerabilita-di-${m}-${year}`,
  ];
}

/** Link ai comunicati mensili presenti nell'elenco ARERA, dal piu' recente. */
async function slugsFromListing() {
  const html = await getText(LIST_URL);
  if (!html) return [];
  const monthsRe = MONTHS.join("|");
  const re = new RegExp(
    `/comunicati-stampa/dettaglio/([^"'\\s]*materia-prima[^"'\\s]*vulnerabilita[^"'\\s]*?(${monthsRe})-(\\d{4}))`,
    "gi"
  );
  const out = new Map();
  for (const m of html.matchAll(re)) {
    const year = Number(m[3]);
    const monthIndex = MONTHS.indexOf(m[2].toLowerCase());
    out.set(m[1], { slug: m[1], year, monthIndex });
  }
  return [...out.values()].sort((a, b) => b.year * 12 + b.monthIndex - (a.year * 12 + a.monthIndex));
}

async function tryPage(slug, year, monthIndex) {
  const url = `${BASE}/comunicati-stampa/dettaglio/${slug}`;
  const html = await getText(url);
  if (!html) return null;
  const value = parsePage(html, year, monthIndex);
  return value == null ? null : { value, url };
}

async function lookup(now = new Date(), skipListing = false) {
  // 1) elenco ufficiale dei comunicati
  try {
    if (!skipListing) {
      for (const item of await slugsFromListing()) {
        const hit = await tryPage(item.slug, item.year, item.monthIndex);
        if (hit) return { ...hit, year: item.year, monthIndex: item.monthIndex };
      }
    }
  } catch (error) {
    console.error("[psv] elenco comunicati:", error?.message ?? error);
  }

  // 2) indirizzi prevedibili degli ultimi mesi
  const y = now.getUTCFullYear();
  const mi = now.getUTCMonth();
  for (let back = 0; back <= 4; back++) {
    const idx = mi - back;
    const year = idx < 0 ? y - 1 : y;
    const monthIndex = ((idx % 12) + 12) % 12;
    for (const slug of slugCandidates(year, monthIndex)) {
      try {
        const hit = await tryPage(slug, year, monthIndex);
        if (hit) return { ...hit, year, monthIndex };
      } catch {
        /* si prova il successivo */
      }
    }
  }
  return null;
}

/**
 * { value, unit, month: "2026-09", monthLabel: "settembre 2026", monthsBehind, url } oppure null.
 * Non lancia errori: se ARERA non risponde restituisce null (e riprova dopo 30 minuti).
 */
export async function getMonthlyPsv(now = new Date(), { skipListing = false } = {}) {
  const scale = Number(process.env.MARKETS_CACHE_SCALE ?? 1);
  if (cache.value !== undefined && Date.now() - cache.at < cache.ttl * scale) return cache.value;

  let value = null;
  try {
    const hit = await lookup(now, skipListing);
    if (hit) {
      const monthsBehind = now.getUTCFullYear() * 12 + now.getUTCMonth() - (hit.year * 12 + hit.monthIndex);
      value = {
        value: hit.value,
        unit: "€/MWh",
        month: `${hit.year}-${String(hit.monthIndex + 1).padStart(2, "0")}`,
        monthLabel: `${MONTHS[hit.monthIndex]} ${hit.year}`,
        monthsBehind,
        url: hit.url,
      };
    }
  } catch (error) {
    console.error("[psv]", error?.message ?? error);
  }

  cache = { at: Date.now(), ttl: value ? OK_TTL : FAIL_TTL, value };
  return value;
}
