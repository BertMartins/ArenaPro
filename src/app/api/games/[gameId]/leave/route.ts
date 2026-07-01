import { NextRequest, NextResponse } from "next/server";
import { requireAuth, jsonFromError } from "@/shared/http";
import { leaveGame } from "@/application/games/gamePlayersService";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const { gameId } = await context.params;
    const game = await leaveGame(gameId, auth.id);
    return NextResponse.json({ ok: true, game });
  } catch (err) {
    return jsonFromError(err, "Erro ao sair do jogo");
  }
}
