import { NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { getAdminStats } from "@/application/stats/statsService";

export async function GET() {
  const auth = await requireAdmin("Não autorizado");
  if (auth instanceof NextResponse) return auth;

  try {
    const stats = await getAdminStats(auth.id);
    return NextResponse.json(stats);
  } catch (err) {
    return jsonFromError(err);
  }
}
