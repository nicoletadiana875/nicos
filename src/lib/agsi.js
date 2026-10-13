// Livello di riempimento degli stoccaggi di gas in Italia (GIE AGSI+).
// L'API e' gratuita ma richiede una chiave personale (registrazione su agsi.gie.eu).
// Condizioni: riuso consentito citando GIE/AGSI come fonte (la chiave puo' essere disattivata
// se manca l'attribuzione). Senza AGSI_API_KEY la funzione non fa nulla.

import { romeDateOffset } from "@/lib/time";

const BASE = process.env.AGSI_BASE || "https://agsi.gie.eu/api";
const OK_TTL = 30 * 60_000;
const FAIL_TTL = 10 * 60_000;

export const AGSI_SOURCE = {
  name: "GIE – AGSI+ (Gas Infrastructure Europe)",
  url: "https://agsi.gie.eu/data-overview/IT",
};

let cache = { at: 0, ttl: 0, value: null };

const num = (v) => {
  const n = typeof v === "string" ? Number(v.replace(",", ".")) : Number(v);
  return Number.isFinite(n) ? n : null;
};

/** { percent, date, twh, trend } oppure null se non configurato o non disponibile. */
export async function getGasStorage() {
  const key = process.env.AGSI_API_KEY;
  if (!key) return null;

  const scale = Number(process.env.MARKETS_CACHE_SCALE ?? 1);
  if (cache.at && Date.now() - cache.at < cache.ttl * scale) return cache.value;

  try {
    const url = `${BASE}?country=IT&from=${romeDateOffset(-10)}&to=${romeDateOffset(0)}&size=15`;
    const res = await fetch(url, {
      headers: { "x-key": key, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) throw new Error(`AGSI HTTP ${res.status}`);
    const json = await res.json();
    if (json.error) throw new Error(`AGSI: ${json.error}`);

    const rows = (json.data ?? [])
      .map((r) => ({
        date: r.gasDayStart,
        percent: num(r.full),
        twh: num(r.gasInStorage),
        trend: num(r.trend),
        status: r.status ?? null,
      }))
      .filter((r) => r.date && r.percent != null)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (!rows.length) throw new Error("AGSI: nessun dato per l'Italia");

    const latest = rows[0];
    cache = { at: Date.now(), ttl: OK_TTL, value: { ...latest, source: AGSI_SOURCE } };
  } catch (error) {
    console.error("[agsi]", error?.message ?? error);
    cache = { at: Date.now(), ttl: FAIL_TTL, value: null };
  }
  return cache.value;
}
