import { readFileSync } from "fs";
import { join } from "path";

function readLocalData() {
  const path = join(process.cwd(), "data", "markets.json");
  return JSON.parse(readFileSync(path, "utf-8"));
}

// Fonte pubblica gratuita: Fraunhofer ISE — energy-charts.info
// Prezzi day-ahead zona IT-North (approssimazione del PUN nazionale).
// Nessuna chiave API richiesta.
//
// Per collegare in futuro una fonte ufficiale GME (PUN esatto):
//   const res = await fetch("https://...", {
//     headers: { Authorization: `Bearer ${process.env.GME_API_KEY}` },
//   });
async function fetchPun() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const fmt = (d) => d.toISOString().split("T")[0];

  const url =
    `https://api.energy-charts.info/price?bzn=IT-North` +
    `&start=${fmt(yesterday)}&end=${fmt(today)}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  const prices = (json.price ?? []).filter((p) => p != null);
  if (!prices.length) throw new Error("Nessun dato disponibile");

  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  return Math.round(avg * 100) / 100;
}

export async function getMarketsData() {
  const local = readLocalData();

  let pun = { ...local.pun };
  let lastUpdate = local.lastUpdate;
  let autoUpdated = false;

  try {
    const punValue = await fetchPun();
    pun = { ...pun, value: punValue };
    lastUpdate = new Date().toISOString().split("T")[0];
    autoUpdated = true;
  } catch {
    // Fonte esterna non raggiungibile — uso il valore locale del JSON
  }

  return {
    ...local,
    pun,
    lastUpdate,
    autoUpdated,
  };
}
