import { NextResponse } from "next/server";
import { requireAuth, jsonFromError } from "@/shared/http";
import { getPlayerStats } from "@/application/stats/statsService";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const stats = await getPlayerStats(auth.id);
    return NextResponse.json(stats);
  } catch (err) {
    return jsonFromError(err);
  }
}
