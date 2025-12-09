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
    if (!token)
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    });

    if (!game)
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });

    if (game.players.length >= game.maxPlayers)
      return NextResponse.json({ error: "Jogo cheio" }, { status: 400 });

    const exists = await prisma.gamePlayer.findFirst({
      where: { gameId, userId: token.id },
    });

    if (exists)
      return NextResponse.json({ error: "Você já está no jogo" }, { status: 400 });

    await prisma.gamePlayer.create({
      data: {
        gameId,
        userId: token.id,
        paymentType: "monthly",
      },
    });

    const updated = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: { include: { user: true } } },
    });

    return NextResponse.json({ ok: true, game: updated });
  } catch (err) {
    console.error("[JOIN]", err);
    return NextResponse.json(
      { error: "Erro ao entrar no jogo" },
      { status: 500 }
    );
  }
}
