import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(_: Request, { params }: { params: { gameId: string } }) {
  const token = await verifyToken();
  if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const game = await prisma.game.findUnique({
    where: { id: params.gameId },
    include: { players: true },
  });

  if (!game) return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });

  if (game.players.length >= game.maxPlayers)
    return NextResponse.json({ error: "Jogo lotado" }, { status: 400 });

  await prisma.gamePlayer.create({
    data: {
      userId: token.id,
      gameId: params.gameId,
      paymentType: "monthly",
    },
  });

  return NextResponse.json({ ok: true });
}
