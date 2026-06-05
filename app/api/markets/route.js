import { NextResponse } from "next/server";
import { getMarketsData } from "@/lib/energyMarkets";
import { rateLimit } from "@/lib/rateLimit";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SITE_URL ?? "*",
  "Access-Control-Allow-Methods": "GET",
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
};

export async function GET(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { ok, remaining } = rateLimit(ip, 30, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Troppe richieste. Riprova tra un minuto." },
      { status: 429, headers: { "Retry-After": "60", ...CORS_HEADERS } }
    );
  }

  try {
    const data = await getMarketsData();
    return NextResponse.json(data, {
      headers: { "X-RateLimit-Remaining": String(remaining), ...CORS_HEADERS },
    });
  } catch {
    return NextResponse.json(
      { error: "Dati non disponibili." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

// Blocca esplicitamente tutti i metodi non-GET
export async function POST() {
  return NextResponse.json({ error: "Metodo non consentito." }, { status: 405 });
}
