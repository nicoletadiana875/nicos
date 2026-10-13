// Prezzi medi finali dell'energia pagati in Italia (statistiche ufficiali semestrali Eurostat).
// Licenza: il riuso di dati statistici Eurostat, anche per fini commerciali, e' consentito
// citando la fonte (Eurostat, avviso sul copyright). Nessuna chiave richiesta.
//
// Non sono prezzi "in tempo reale": sono medie semestrali, mostrate sempre con il periodo.

const BASE = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";
const OK_TTL = 12 * 60 * 60_000;
const FAIL_TTL = 15 * 60_000;

// Ogni voce: dataset Eurostat, fascia di consumo, trattamento delle imposte
const SERIES = [
  {
    id: "famiglie-elettricita",
    audience: "Famiglie",
    energy: "Elettricità",
    dataset: "nrg_pc_204",
    band: "KWH2500-4999",
    tax: "I_TAX",
    detail: "consumo annuo 2.500–4.999 kWh, tutte le imposte incluse",
  },
  {
    id: "famiglie-gas",
    audience: "Famiglie",
    energy: "Gas",
    dataset: "nrg_pc_202",
    band: "GJ20-199",
    tax: "I_TAX",
    detail: "consumo annuo 20–199 GJ (circa 5,6–55 MWh), tutte le imposte incluse",
  },
  {
    id: "imprese-elettricita",
    audience: "Imprese",
    energy: "Elettricità",
    dataset: "nrg_pc_205",
    band: "MWH20-499",
    tax: "X_VAT",
    detail: "consumo annuo 20–499 MWh, IVA e imposte recuperabili escluse",
  },
  {
    id: "imprese-gas",
    audience: "Imprese",
    energy: "Gas",
    dataset: "nrg_pc_203",
    band: "GJ_LT1000",
    tax: "X_VAT",
    detail: "consumo annuo fino a 1.000 GJ (circa 278 MWh), IVA e imposte recuperabili escluse",
  },
];

let cache = { at: 0, ttl: 0, items: null };

function decode(json) {
  const ids = json.id;
  const sizes = json.size;
  const strides = new Array(ids.length);
  let acc = 1;
  for (let i = ids.length - 1; i >= 0; i--) {
    strides[i] = acc;
    acc *= sizes[i];
  }
  const rows = [];
  for (const [pos, value] of Object.entries(json.value ?? {})) {
    if (typeof value !== "number") continue;
    let rem = Number(pos);
    const row = { value };
    ids.forEach((id, i) => {
      const k = Math.floor(rem / strides[i]);
      rem %= strides[i];
      const index = json.dimension[id].category.index;
      row[id] = Object.keys(index).find((code) => index[code] === k);
    });
    rows.push(row);
  }
  return rows;
}

async function fetchSeries(spec) {
  const params = new URLSearchParams({
    format: "JSON",
    lang: "EN",
    nrg_cons: spec.band,
    unit: "KWH",
    tax: spec.tax,
    currency: "EUR",
    sinceTimePeriod: "2024-S1",
  });
  params.append("geo", "IT");
  params.append("geo", "EU27_2020");

  const res = await fetch(`${BASE}/${spec.dataset}?${params}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Eurostat ${spec.dataset} HTTP ${res.status}`);

  const rows = decode(await res.json());
  const italy = rows.filter((r) => r.geo === "IT").sort((a, b) => b.time.localeCompare(a.time));
  if (!italy.length) throw new Error(`Eurostat ${spec.dataset}: nessun dato per l'Italia`);

  const latest = italy[0];
  const eu = rows.find((r) => r.geo === "EU27_2020" && r.time === latest.time);

  return {
    id: spec.id,
    audience: spec.audience,
    energy: spec.energy,
    detail: spec.detail,
    unit: "€/kWh",
    value: latest.value,
    period: latest.time, // es. "2025-S2"
    eu: eu ? eu.value : null,
    source: {
      name: "Eurostat",
      url: `https://ec.europa.eu/eurostat/databrowser/view/${spec.dataset}/default/table?lang=it`,
    },
  };
}

/** Restituisce le serie disponibili. Non lancia mai errori: in caso di problemi la lista e' vuota. */
export async function getConsumerPrices() {
  const scale = Number(process.env.MARKETS_CACHE_SCALE ?? 1);
  if (cache.items && Date.now() - cache.at < cache.ttl * scale) return cache.items;

  const settled = await Promise.allSettled(SERIES.map(fetchSeries));
  const items = settled.filter((r) => r.status === "fulfilled").map((r) => r.value);
  for (const r of settled) {
    if (r.status === "rejected") console.error("[eurostat]", r.reason?.message ?? r.reason);
  }

  cache = { at: Date.now(), ttl: items.length ? OK_TTL : FAIL_TTL, items };
  return items;
}
