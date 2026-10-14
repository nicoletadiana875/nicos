// Dati di mercato luce e gas.
//
// Regole:
//  - nessun valore scritto a mano o stimato: o arriva da una fonte, o e' "non disponibile";
//  - ogni valore porta con se' data di riferimento, fonte e stato;
//  - se la fonte non risponde si mostra l'ultimo dato REALE ricevuto, marcato "non aggiornato"
//    (e solo entro 36 ore), mai presentato come attuale.
//
// Fonti, in ordine di priorita':
//  - GME API ufficiali (PUN Index GME e indice gas IGI): richiedono GME_API_USER / GME_API_PASSWORD;
//  - Energy-Charts (dati ENTSO-E/Bundesnetzagentur): prezzo day-ahead della zona Nord,
//    usato per l'elettricita' quando le credenziali GME non sono configurate.

import {
  GME_SOURCE,
  currentHourPrice,
  getGmeGasIndex,
  getGmePunDaily,
  gmeConfigured,
} from "@/lib/gme";
import {
  ENERGY_CHARTS_SOURCE,
  currentPoint,
  dailyAverages,
  getEnergyChartsPoints,
} from "@/lib/energyCharts";
import { getConsumerPrices } from "@/lib/eurostat";
import { PSV_SOURCE_NAME, getMonthlyPsv } from "@/lib/psv";
import { getGasStorage } from "@/lib/agsi";
import { romeDate, romeDateOffset, shortLabel } from "@/lib/time";

const UNIT = "€/MWh";
const STALE_LIMIT_MS = 36 * 60 * 60_000;

const LABELS = {
  pun: { short: "PUN", full: "PUN Index GME", detail: "Media giornaliera dei prezzi orari" },
  zonal: {
    short: "MGP Nord",
    full: "Prezzo MGP zona Nord",
    detail: "Media giornaliera dei prezzi day-ahead (zona Nord)",
  },
  psv: {
    short: "PSV",
    full: "PSV day-ahead · media mensile",
    detail: "Media mensile del PSV day-ahead, valore pubblicato da ARERA",
  },
  igi: {
    short: "PSV · IGI",
    full: "Indice IGI GME (riferimento gas PSV)",
    detail: "Indice giornaliero del mercato gas MGP-GAS",
  },
};

// ---- memoria breve: evita di interrogare le fonti a ogni visita
const memo = new Map();
async function cached(key, ttlMs, fn) {
  const scaled = ttlMs * Number(process.env.MARKETS_CACHE_SCALE ?? 1);
  const hit = memo.get(key);
  if (hit && Date.now() - hit.at < scaled) return hit.value;
  const value = await fn();
  memo.set(key, { at: Date.now(), value });
  return value;
}

let lastGood = { electricity: null, gas: null };

function unavailable(kind) {
  const label = kind === "gas" ? LABELS.igi : LABELS.zonal;
  return {
    status: "unavailable",
    kind: kind === "gas" ? "igi" : "zonal",
    shortLabel: label.short,
    label: label.full,
    unit: UNIT,
    value: null,
    date: null,
    next: null,
    current: null,
    product: null,
    source: kind === "gas" ? GME_SOURCE : ENERGY_CHARTS_SOURCE,
    fetchedAt: null,
  };
}

function remember(slot, data) {
  lastGood[slot] = data;
  return data;
}

function fallbackToLastGood(slot) {
  const previous = lastGood[slot];
  if (previous?.fetchedAt && Date.now() - Date.parse(previous.fetchedAt) < STALE_LIMIT_MS) {
    return { ...previous, status: "stale" };
  }
  return unavailable(slot);
}

// ---- elettricita'
async function electricityFromGme() {
  const days = await cached("gme-pun", 5 * 60_000, () => getGmePunDaily({ daysBack: 1, daysForward: 1 }));
  if (!days.length) throw new Error("GME: nessun valore PUN");

  const today = romeDate();
  const todayRow = days.find((d) => d.date === today);
  const chosen = todayRow ?? days.filter((d) => d.date <= today).at(-1) ?? days.at(-1);
  const tomorrow = days.find((d) => d.date === romeDateOffset(1));
  const hour = chosen.date === today ? currentHourPrice(chosen) : null;

  return {
    status: chosen.date === today ? "live" : "stale",
    kind: "pun",
    shortLabel: LABELS.pun.short,
    label: LABELS.pun.full,
    unit: UNIT,
    value: chosen.value,
    date: chosen.date,
    next: tomorrow && tomorrow.date !== chosen.date ? { date: tomorrow.date, value: tomorrow.value } : null,
    current: hour ? { value: hour.value, at: `ora ${hour.hour}` } : null,
    product: null,
    source: GME_SOURCE,
    fetchedAt: new Date().toISOString(),
  };
}

async function electricityFromEnergyCharts() {
  const points = await getEnergyChartsPoints();
  const daily = dailyAverages(points);
  if (!daily.length) throw new Error("Energy-Charts: nessuna media giornaliera");

  const today = romeDate();
  const chosen = daily.find((d) => d.date === today) ?? daily.filter((d) => d.date <= today).at(-1);
  if (!chosen) throw new Error("Energy-Charts: nessun dato per oggi");
  const tomorrow = daily.find((d) => d.date === romeDateOffset(1));
  const now = currentPoint(points);

  return {
    status: chosen.date === today ? "live" : "stale",
    kind: "zonal",
    shortLabel: LABELS.zonal.short,
    label: LABELS.zonal.full,
    unit: UNIT,
    value: chosen.value,
    date: chosen.date,
    next: tomorrow ? { date: tomorrow.date, value: tomorrow.value } : null,
    current:
      now && romeDate(now.t) === today
        ? { value: Math.round(now.price * 100) / 100, at: new Date(now.t * 1000).toISOString() }
        : null,
    product: null,
    source: ENERGY_CHARTS_SOURCE,
    fetchedAt: new Date().toISOString(),
  };
}

async function getElectricity() {
  if (gmeConfigured()) {
    try {
      return remember("electricity", await electricityFromGme());
    } catch (error) {
      console.error("[markets] GME elettricita':", error?.message ?? error);
    }
  }
  try {
    return remember("electricity", await electricityFromEnergyCharts());
  } catch (error) {
    console.error("[markets] Energy-Charts:", error?.message ?? error);
    return fallbackToLastGood("electricity");
  }
}

// ---- gas
// Valore mensile pubblicato da ARERA (media mensile del PSV day-ahead).
async function gasFromMonthlyPsv() {
  const psv = await getMonthlyPsv();
  // Nessun dato troppo vecchio: oltre 4 mesi di ritardo non lo si mostra
  if (!psv || psv.monthsBehind < 0 || psv.monthsBehind > 4) return null;
  return remember("gas", {
    status: psv.monthsBehind <= 2 ? "live" : "stale",
    kind: "psv-monthly",
    shortLabel: LABELS.psv.short,
    label: LABELS.psv.full,
    unit: psv.unit,
    value: psv.value,
    date: null,
    period: { month: psv.month, label: psv.monthLabel },
    next: null,
    current: null,
    product: null,
    source: { name: PSV_SOURCE_NAME, url: psv.url },
    fetchedAt: new Date().toISOString(),
  });
}

async function getGas() {
  if (!gmeConfigured()) return (await gasFromMonthlyPsv()) ?? unavailable("gas");

  try {
    const igi = await cached("gme-igi", 15 * 60_000, getGmeGasIndex);
    const recent = igi.date >= romeDateOffset(-4);
    return remember("gas", {
      status: recent ? "live" : "stale",
      kind: "igi",
      shortLabel: LABELS.igi.short,
      label: LABELS.igi.full,
      unit: UNIT,
      value: igi.value,
      date: igi.date,
      next: null,
      current: null,
      product: igi.product,
      source: GME_SOURCE,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[markets] GME gas:", error?.message ?? error);
    return (await gasFromMonthlyPsv()) ?? fallbackToLastGood("gas");
  }
}

export async function getMarketsData() {
  const [electricity, gas, consumerPrices, gasStorage] = await Promise.all([
    getElectricity(),
    getGas(),
    getConsumerPrices(),
    getGasStorage(),
  ]);
  return {
    generatedAt: new Date().toISOString(),
    gmeConnected: gmeConfigured(),
    electricity,
    gas,
    // Contesto: prezzi medi finali (Eurostat, semestrali) e stoccaggi gas (AGSI+, se configurato)
    consumerPrices,
    gasStorage,
  };
}

// ---- storico elettricita' (ultimi 30 giorni)
export async function getMarketHistory(days = 30) {
  const build = (kind, series, source) => ({
    status: "live",
    kind,
    shortLabel: LABELS[kind].short,
    label: LABELS[kind].full,
    unit: UNIT,
    history: series.slice(-days).map((d) => ({
      date: d.date,
      label: shortLabel(d.date),
      value: d.value,
    })),
    source,
    fetchedAt: new Date().toISOString(),
  });

  if (gmeConfigured()) {
    try {
      const series = await cached("gme-pun-history", 3 * 60 * 60_000, () =>
        getGmePunDaily({ daysBack: days, daysForward: 0 })
      );
      if (series.length) return build("pun", series, GME_SOURCE);
    } catch (error) {
      console.error("[markets] storico GME:", error?.message ?? error);
    }
  }

  try {
    const series = dailyAverages(await getEnergyChartsPoints());
    if (series.length) return build("zonal", series, ENERGY_CHARTS_SOURCE);
  } catch (error) {
    console.error("[markets] storico Energy-Charts:", error?.message ?? error);
  }

  return {
    status: "unavailable",
    kind: "zonal",
    shortLabel: LABELS.zonal.short,
    label: LABELS.zonal.full,
    unit: UNIT,
    history: [],
    source: ENERGY_CHARTS_SOURCE,
    fetchedAt: null,
  };
}
