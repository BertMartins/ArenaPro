import { NextResponse } from "next/server";
import { requireAuth, requireAdmin, jsonError } from "@/shared/http";
import { getMatches, recordMatch } from "@/application/games/matchesService";

export async function GET(
  req: Request,
  context: { params: Promise<{ gameId: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const { gameId } = await context.params;
    const matches = await getMatches(gameId);
    return NextResponse.json(matches);
  } catch (err) {
    console.error("Erro GET matches:", err);
    return jsonError("Erro interno", 500);
  }
}

// Registrar partida (opcional — só admin)
export async function POST(
  req: Request,
  context: { params: Promise<{ gameId: string }> }
) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const { gameId } = await context.params;
    const body = await req.json();
    const match = await recordMatch(gameId, body);
    return NextResponse.json({ ok: true, match });
  } catch (err) {
    console.error("Erro POST matches:", err);
    return jsonError("Erro interno", 500);
  }
}
