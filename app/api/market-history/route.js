import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SITE_URL ?? "*",
  "Access-Control-Allow-Methods": "GET",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
};

async function fetchPunHistory(days = 30) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  const fmt = (d) => d.toISOString().split("T")[0];
  const url =
    `https://api.energy-charts.info/price?bzn=IT-North` +
    `&start=${fmt(start)}&end=${fmt(end)}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();

  const dayMap = {};
  (json.unix_seconds ?? []).forEach((ts, i) => {
    const price = json.price?.[i];
    if (price == null) return;
    const date = new Date(ts * 1000).toISOString().split("T")[0];
    if (!dayMap[date]) dayMap[date] = { sum: 0, count: 0 };
    dayMap[date].sum += price;
    dayMap[date].count += 1;
  });

  return Object.entries(dayMap)
    .map(([date, { sum, count }]) => ({
      date,
      label: new Date(date).toLocaleDateString("it-IT", { day: "2-digit", month: "short" }),
      pun: Math.round((sum / count) * 100) / 100,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function GET(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { ok, remaining } = rateLimit(ip, 20, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Troppe richieste. Riprova tra un minuto." },
      { status: 429, headers: { "Retry-After": "60", ...CORS_HEADERS } }
    );
  }

  try {
    const history = await fetchPunHistory(30);
    return NextResponse.json(
      { history, status: "ok" },
      { headers: { "X-RateLimit-Remaining": String(remaining), ...CORS_HEADERS } }
    );
  } catch {
    return NextResponse.json(
      { history: [], status: "error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: "Metodo non consentito." }, { status: 405 });
}
