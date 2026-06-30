import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { reconcileGame } from "@/lib/gameReconcile";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await context.params;

    const token = await verifyToken();
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const { playerId } = await request.json();

    const player = await prisma.gamePlayer.findFirst({
      where: { gameId, userId: playerId },
    });

    if (!player) {
      return NextResponse.json({ error: "Jogador não encontrado no jogo" }, { status: 404 });
    }

    await prisma.gamePlayer.delete({ where: { id: player.id } });

    // Limpa qualquer lançamento financeiro confirmado para esse jogador neste jogo
    await prisma.financialEntry.deleteMany({
      where: { gameId, userId: playerId, type: "daily_fee" },
    });

    await reconcileGame(gameId);

    const updated = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: { include: { user: true } },
        teams: { include: { players: { include: { user: true } } } },
        matches: true,
      },
    });

    return NextResponse.json({ ok: true, game: updated });
  } catch (err) {
    console.error("[REMOVE PLAYER]", err);
    return NextResponse.json({ error: "Erro ao remover jogador" }, { status: 500 });
  }
}
