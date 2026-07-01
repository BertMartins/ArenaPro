import { NextRequest, NextResponse } from "next/server";
import { requireAuth, jsonError } from "@/shared/http";
import { getGame } from "@/application/games/gamesService";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const { gameId } = await context.params;
    const game = await getGame(gameId);
    if (!game) return jsonError("Jogo não encontrado", 404);
    return NextResponse.json({ game });
  } catch (err) {
    console.error("[GET GAME]", err);
    return jsonError("Erro interno ao carregar jogo", 500);
  }
}
