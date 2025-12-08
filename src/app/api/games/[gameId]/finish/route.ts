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
    if (!token || token.role !== "admin") {
      return NextResponse.json(
        { error: "Apenas admins podem finalizar" },
        { status: 401 }
      );
    }

    const game = await prisma.game.findUnique({ where: { id: gameId } });

    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    if (game.status === "finished") {
      return NextResponse.json(
        { error: "Jogo já está finalizado" },
        { status: 400 }
      );
    }

    await prisma.game.update({
      where: { id: gameId },
      data: { status: "finished" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[FINISH]", err);
    return NextResponse.json(
      { error: "Erro ao finalizar jogo" },
      { status: 500 }
    );
  }
}
