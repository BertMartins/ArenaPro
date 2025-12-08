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

    const player = await prisma.gamePlayer.findFirst({
      where: { gameId, userId: token.id },
    });

    if (!player) {
      return NextResponse.json(
        { error: "Você não está no jogo" },
        { status: 400 }
      );
    }

    await prisma.gamePlayer.delete({
      where: { id: player.id },
    });

    return NextResponse.json({ ok: true, message: "Saiu do jogo" });
  } catch (err) {
    console.error("[LEAVE]", err);
    return NextResponse.json(
      { error: "Erro ao sair do jogo" },
      { status: 500 }
    );
  }
}
