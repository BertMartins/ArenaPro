import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET — detalhes do jogo
export async function GET(
  req: Request,
  context: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await context.params;

    const user = await verifyToken();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: {
          include: {
            user: true
          }
        },
        teams: {
          include: {
            players: { include: { user: true } }
          }
        },
        matches: true
      }
    });

    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ game });
  } catch (err) {
    console.error("Erro GET gameId:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
