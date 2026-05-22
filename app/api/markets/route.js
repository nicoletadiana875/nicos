import { NextResponse } from "next/server";

export async function GET() {
  // Endpoint placeholder: collega qui sorgenti reali PUN/PSV.
  return NextResponse.json({
    source: "placeholder",
    updatedAt: new Date().toISOString(),
    pun: null,
    psv: null,
    note: "Configura qui l'integrazione API reale per i mercati energetici."
  });
}
