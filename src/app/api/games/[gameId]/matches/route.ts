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

    // Update player stats (wins/losses)
    const winnerTeamId = body.score1 > body.score2 ? body.team1Id : body.team2Id;
    const loserTeamId = body.score1 > body.score2 ? body.team2Id : body.team1Id;

    const [winnerPlayers, loserPlayers] = await Promise.all([
      prisma.gameTeamPlayer.findMany({ where: { teamId: winnerTeamId } }),
      prisma.gameTeamPlayer.findMany({ where: { teamId: loserTeamId } }),
    ]);

    await Promise.all([
      ...winnerPlayers.map((p) =>
        prisma.userStats.upsert({
          where: { userId: p.userId },
          create: { userId: p.userId, wins: 1, losses: 0, level: 1, titles: 0 },
          update: { wins: { increment: 1 } },
        })
      ),
      ...loserPlayers.map((p) =>
        prisma.userStats.upsert({
          where: { userId: p.userId },
          create: { userId: p.userId, wins: 0, losses: 1, level: 1, titles: 0 },
          update: { losses: { increment: 1 } },
        })
      ),
    ]);

    return NextResponse.json({ ok: true, match });
  } catch (err) {
    console.error("Erro POST matches:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
