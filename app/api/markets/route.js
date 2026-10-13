import { NextResponse } from "next/server";
import { getMarketsData } from "@/lib/energyMarkets";
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

  const { ok, remaining } = rateLimit(`markets:${ip}`, 30, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Troppe richieste. Riprova tra un minuto." },
      { status: 429, headers: { "Retry-After": "60", ...CORS_HEADERS } }
    );
  }

  try {
    const data = await getMarketsData();
    const anyLive = data.electricity.status === "live" || data.gas.status === "live";
    return NextResponse.json(data, {
      headers: {
        "X-RateLimit-Remaining": String(remaining),
        // Cache breve: i prezzi day-ahead cambiano una volta al giorno, ma l'ora corrente cambia
        "Cache-Control": anyLive
          ? "public, s-maxage=300, stale-while-revalidate=300"
          : "no-store",
        ...CORS_HEADERS,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Dati non disponibili." },
      { status: 500, headers: { "Cache-Control": "no-store", ...CORS_HEADERS } }
    );
  }
}

// Blocca esplicitamente tutti i metodi non-GET
export async function POST() {
  return NextResponse.json({ error: "Metodo non consentito." }, { status: 405 });
}
