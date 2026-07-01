import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { removePlayer } from "@/application/games/gamePlayersService";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const { gameId } = await context.params;
    const { playerId } = await request.json();
    const game = await removePlayer(gameId, playerId);
    return NextResponse.json({ ok: true, game });
  } catch (err) {
    return jsonFromError(err, "Erro ao remover jogador");
  }
}
