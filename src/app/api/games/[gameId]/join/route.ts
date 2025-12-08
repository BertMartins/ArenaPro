import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  req: Request,
  context: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await context.params;

    const user = await verifyToken();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    await prisma.gamePlayer.create({
      data: {
        gameId,
        userId: user.id,
        paymentType: user.role === "visitor" ? "daily" : "monthly",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro join:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
