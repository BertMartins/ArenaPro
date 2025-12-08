import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const game = await prisma.game.findUnique({
      where: { id: params.gameId },
      include: {
        players: { include: { user: true } },
        teams: { include: { players: true } },
        matches: true,
      },
    });

    if (!game)
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });

    return NextResponse.json({ game });
  } catch (err) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
