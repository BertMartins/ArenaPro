import { NextResponse } from "next/server";
import { requireAuth, requireAdmin, jsonError } from "@/shared/http";
import { getTeams, setTeamsManually } from "@/application/games/teamsService";

export async function GET(
  req: Request,
  context: { params: Promise<{ gameId: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const { gameId } = await context.params;
    const teams = await getTeams(gameId);
    return NextResponse.json(teams);
  } catch (err) {
    console.error("Erro GET teams:", err);
    return jsonError("Erro interno", 500);
  }
}

// Criar times (somente admin)
export async function POST(
  req: Request,
  context: { params: Promise<{ gameId: string }> }
) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const { gameId } = await context.params;
    const { teams } = await req.json();
    await setTeamsManually(gameId, teams);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro POST teams:", err);
    return jsonError("Erro interno", 500);
  }
}
