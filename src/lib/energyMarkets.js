// Dato di mercato mostrato dal sito: PSV day-ahead, media mensile, come pubblicato da ARERA.
//
// Regole:
//  - nessun valore scritto a mano o stimato: o arriva dalla fonte, o e' "non disponibile";
//  - il dato porta con se' mese di riferimento, fonte e stato;
//  - se la fonte non risponde si mostra l'ultimo mese reale ricevuto, marcato "non aggiornato";
//    oltre 4 mesi di ritardo non si mostra piu' nulla.

import { PSV_SOURCE_NAME, getMonthlyPsv } from "@/lib/psv";

const LABEL = "PSV day-ahead · media mensile";

function unavailable() {
  return {
    status: "unavailable",
    kind: "psv-monthly",
    shortLabel: "PSV",
    label: LABEL,
    unit: "€/MWh",
    value: null,
    period: null,
    source: null,
  };
}

export async function getMarketsData() {
  const psv = await getMonthlyPsv();
  const generatedAt = new Date().toISOString();

  if (!psv || psv.monthsBehind < 0 || psv.monthsBehind > 4) {
    return { generatedAt, gas: unavailable() };
  }

  return {
    generatedAt,
    gas: {
      status: psv.monthsBehind <= 2 ? "live" : "stale",
      kind: "psv-monthly",
      shortLabel: "PSV",
      label: LABEL,
      unit: psv.unit,
      value: psv.value,
      period: { month: psv.month, label: psv.monthLabel },
      source: { name: PSV_SOURCE_NAME, url: psv.url },
    },
  };
}
