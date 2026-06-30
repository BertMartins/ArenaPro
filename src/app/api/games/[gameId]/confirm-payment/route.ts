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
      include: { user: true, game: true },
    });

    if (!player) {
      return NextResponse.json({ error: "Jogador não encontrado no jogo" }, { status: 404 });
    }

    if (player.paymentType !== "daily") {
      return NextResponse.json(
        { error: "Mensalistas não usam confirmação de pagamento por jogo" },
        { status: 400 }
      );
    }

    if (player.paid) {
      // Reverter confirmação
      await prisma.gamePlayer.update({
        where: { id: player.id },
        data: { paid: false, paidAt: null },
      });

      await prisma.financialEntry.deleteMany({
        where: { gameId, userId: playerId, type: "daily_fee" },
      });
    } else {
      await prisma.gamePlayer.update({
        where: { id: player.id },
        data: { paid: true, paidAt: new Date() },
      });

      await prisma.financialEntry.create({
        data: {
          date: player.game.date,
          type: "daily_fee",
          gameId,
          userId: playerId,
          amount: 15,
          note: `${player.user.role === "visitor" ? "Visitante" : "Diarista"}: ${player.user.name}`,
        },
      });
    }

    await reconcileGame(gameId);

    const updated = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: { include: { user: true } } },
    });

    return NextResponse.json({ ok: true, game: updated });
  } catch (err) {
    console.error("[CONFIRM PAYMENT]", err);
    return NextResponse.json({ error: "Erro ao confirmar pagamento" }, { status: 500 });
  }
}
