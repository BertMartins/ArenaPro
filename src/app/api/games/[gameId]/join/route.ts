import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const token = await verifyToken();
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const game = await prisma.game.findUnique({
      where: { id: params.gameId },
      include: { players: true },
    });

    if (!game)
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });

    if (game.players.length >= game.maxPlayers) {
      return NextResponse.json(
        { error: "Jogo cheio. Não é possível entrar." },
        { status: 400 }
      );
    }

    const already = await prisma.gamePlayer.findFirst({
      where: { userId: token.id, gameId: params.gameId },
    });

    if (already)
      return NextResponse.json({ error: "Você já está no jogo." }, { status: 400 });

    await prisma.gamePlayer.create({
      data: {
        gameId: params.gameId,
        userId: token.id,
        paymentType: token.paymentType === "daily" ? "daily" : "monthly",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
