import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { finishGame } from "@/application/games/gameLifecycleService";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  const auth = await requireAdmin("Apenas admins podem finalizar");
  if (auth instanceof NextResponse) return auth;

  try {
    const { gameId } = await context.params;
    const champion = await finishGame(gameId);
    return NextResponse.json({ ok: true, champion });
  } catch (err) {
    return jsonFromError(err, "Erro ao finalizar jogo");
  }
}
