import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(
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
      include: {
        players: { include: { user: true } },
        teams: {
          include: {
            players: {
              include: { user: true },
            },
          },
        },
        matches: true,
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ game });
  } catch (err) {
    console.error("[GET GAME]", err);
    return NextResponse.json(
      { error: "Erro interno ao carregar jogo" },
      { status: 500 }
    );
  }
}
