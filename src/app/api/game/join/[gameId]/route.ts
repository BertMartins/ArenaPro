import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, context: { params: Promise<{ gameId: string }> }) {
  try {
    const { gameId } = await context.params;

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId não informado" }, { status: 400 });
    }

    // pega jogo
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true }
    });

    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    const already = game.players.some((p) => p.userId === userId);
    if (already) {
      return NextResponse.json({ error: "Já está no jogo" }, { status: 400 });
    }

    // cria vínculo
    await prisma.gamePlayer.create({
      data: {
        gameId,
        userId,
      },
    });

    return NextResponse.json({ ok: true, message: "Entrou no jogo" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
