// Date e ore sempre nel fuso di Roma: i mercati energetici italiani ragionano in ora locale.

const TZ = "Europe/Rome";

const ymdFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const hourFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  hour: "2-digit",
  hourCycle: "h23",
});

/** "2026-10-13" per un istante (secondi unix o Date), nel fuso di Roma. */
export function romeDate(input = new Date()) {
  const d = typeof input === "number" ? new Date(input * 1000) : input;
  return ymdFmt.format(d);
}

/** Data di Roma spostata di `days` giorni rispetto a oggi, come "YYYY-MM-DD". */
export function romeDateOffset(days = 0, from = new Date()) {
  // Si parte da mezzogiorno UTC per evitare scarti dovuti al cambio d'ora
  const [y, m, d] = romeDate(from).split("-").map(Number);
  const base = new Date(Date.UTC(y, m - 1, d, 12));
  base.setUTCDate(base.getUTCDate() + days);
  return base.toISOString().slice(0, 10);
}

/** "2026-10-13" -> "20261013" (formato richiesto dalle API GME). */
export const toCompact = (isoDate) => isoDate.replaceAll("-", "");

/** "20261013" o 20261013 -> "2026-10-13". */
export function fromCompact(value) {
  const s = String(value);
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

/** Ora corrente a Roma (0-23). */
export function romeHour(now = new Date()) {
  return Number(hourFmt.format(now));
}

/** "13 ott" */
export function shortLabel(isoDate) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}
