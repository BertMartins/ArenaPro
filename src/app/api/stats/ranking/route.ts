import { NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/shared/http";
import { getRanking } from "@/application/stats/statsService";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const ranked = await getRanking();
    return NextResponse.json(ranked);
  } catch (err) {
    console.error("[RANKING]", err);
    return jsonError("Erro interno", 500);
  }
}
