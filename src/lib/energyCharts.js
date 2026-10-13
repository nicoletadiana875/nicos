// Energy-Charts (Fraunhofer ISE): prezzi day-ahead per zona di mercato, dati
// Bundesnetzagentur | SMARD.de, licenza CC BY 4.0 (attribuzione obbligatoria).
// Nessuna chiave richiesta. Il servizio limita le richieste (HTTP 429):
// si usa una cache in memoria e un'unica richiesta condivisa.
//
// ATTENZIONE: e' il prezzo della zona Nord, NON il PUN nazionale.

import { romeDate, romeDateOffset } from "@/lib/time";

const BASE = process.env.ENERGY_CHARTS_BASE || "https://api.energy-charts.info";
const ZONE = "IT-North";
// MARKETS_CACHE_SCALE=0 disattiva le cache (solo per i test)
const TTL_MS = 15 * 60_000 * Number(process.env.MARKETS_CACHE_SCALE ?? 1);
const HISTORY_DAYS = 31;

export const ENERGY_CHARTS_SOURCE = {
  name: "Energy-Charts (Fraunhofer ISE) · dati Bundesnetzagentur | SMARD.de · CC BY 4.0",
  url: "https://www.energy-charts.info/charts/price_spot_market/chart.htm?l=it&c=IT&bzn=IT-North",
};

let cache = { at: 0, points: null };
let inflight = null;

async function download() {
  const url =
    `${BASE}/price?bzn=${ZONE}` +
    `&start=${romeDateOffset(-HISTORY_DAYS)}&end=${romeDateOffset(1)}`;

  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Energy-Charts HTTP ${res.status}`);

  const json = await res.json();
  const times = json.unix_seconds ?? [];
  const prices = json.price ?? [];
  const points = [];
  for (let i = 0; i < times.length; i++) {
    if (typeof prices[i] === "number" && Number.isFinite(prices[i])) {
      points.push({ t: times[i], price: prices[i] });
    }
  }
  if (!points.length) throw new Error("Energy-Charts: nessun dato");
  return points;
}

/** Punti [{t: unix secondi, price: €/MWh}] degli ultimi ~30 giorni + domani se pubblicato. */
export async function getEnergyChartsPoints() {
  if (cache.points && Date.now() - cache.at < TTL_MS) return cache.points;

  if (!inflight) {
    inflight = download()
      .then((points) => {
        cache = { at: Date.now(), points };
        return points;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Medie giornaliere nel fuso di Roma, ordinate per data. Esclude giorni molto incompleti. */
export function dailyAverages(points) {
  const days = new Map();
  for (const { t, price } of points) {
    const date = romeDate(t);
    const d = days.get(date) ?? { sum: 0, n: 0 };
    d.sum += price;
    d.n += 1;
    days.set(date, d);
  }
  return [...days.entries()]
    .filter(([, d]) => d.n >= 20)
    .map(([date, d]) => ({
      date,
      value: Math.round((d.sum / d.n) * 100) / 100,
      intervals: d.n,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Ultimo punto con orario <= adesso (prezzo dell'intervallo in corso). */
export function currentPoint(points, nowSeconds = Math.floor(Date.now() / 1000)) {
  let found = null;
  for (const p of points) {
    if (p.t <= nowSeconds) found = p;
    else break;
  }
  return found;
}
