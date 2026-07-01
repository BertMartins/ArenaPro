import { NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/shared/http";
import { getPlayerDashboard } from "@/application/dashboard/dashboardService";

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const dashboard = await getPlayerDashboard(auth.id);
    return NextResponse.json({ dashboard });
  } catch (err) {
    console.error(err);
    return jsonError("Erro ao carregar dashboard do jogador", 500);
  }
}
