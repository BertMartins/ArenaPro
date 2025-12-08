import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

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

    const matches = await prisma.matchHistory.findMany({
      where: { gameId },
      orderBy: { matchNumber: "asc" },
    });

    return NextResponse.json(matches);
  } catch (err) {
    console.error("Erro GET matches:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// Registrar partida (opcional — só admin)
export async function POST(
  req: Request,
  context: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await context.params;
    const user = await verifyToken();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const body = await req.json();

    const match = await prisma.matchHistory.create({
      data: {
        gameId,
        matchNumber: body.matchNumber,
        team1Id: body.team1Id,
        team2Id: body.team2Id,
        score1: body.score1,
        score2: body.score2,
        winner: body.winner,
      }
    });

    return NextResponse.json({ ok: true, match });
  } catch (err) {
    console.error("Erro POST matches:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
