import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { startGame } from "@/application/games/gameLifecycleService";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const { gameId } = await context.params;
    const game = await startGame(gameId);
    return NextResponse.json({ ok: true, game });
  } catch (err) {
    return jsonFromError(err, "Erro ao iniciar jogo");
  }
}
