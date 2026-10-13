import { NextResponse } from "next/server";
import { getMarketHistory } from "@/lib/energyMarkets";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SITE_URL ?? "*",
  "Access-Control-Allow-Methods": "GET",
};

export async function GET(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { ok, remaining } = rateLimit(`history:${ip}`, 20, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Troppe richieste. Riprova tra un minuto." },
      { status: 429, headers: { "Retry-After": "60", ...CORS_HEADERS } }
    );
  }

  // Lo storico non ricade mai su dati statici: se la fonte non risponde, history e' vuoto
  const data = await getMarketHistory(30);
  return NextResponse.json(data, {
    headers: {
      "X-RateLimit-Remaining": String(remaining),
      "Cache-Control":
        data.status === "live"
          ? "public, s-maxage=900, stale-while-revalidate=900"
          : "no-store",
      ...CORS_HEADERS,
    },
  });
}

export async function POST() {
  return NextResponse.json({ error: "Metodo non consentito." }, { status: 405 });
}
