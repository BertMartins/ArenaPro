import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await context.params;

    const token = await verifyToken();
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    });

    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    if (game.status !== "open") {
      return NextResponse.json({ error: "Jogo não está aberto" }, { status: 400 });
    }

    if (game.players.length >= game.maxPlayers) {
      return NextResponse.json({ error: "Jogo cheio" }, { status: 400 });
    }

    const already = await prisma.gamePlayer.findFirst({
      where: { gameId, userId: token.id },
    });

    if (already) {
      return NextResponse.json({ error: "Você já está no jogo" }, { status: 400 });
    }

    await prisma.gamePlayer.create({
      data: {
        gameId,
        userId: token.id,
        paymentType: "monthly", // ou do usuário, se quiser
      },
    });

    return NextResponse.json({ ok: true, message: "Entrou no jogo" });
  } catch (err) {
    console.error("[JOIN]", err);
    return NextResponse.json(
      { error: "Erro ao entrar no jogo" },
      { status: 500 }
    );
  }
}
