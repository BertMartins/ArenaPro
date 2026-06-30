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

    // Find champion team (most wins in match history)
    const matches = await prisma.matchHistory.findMany({ where: { gameId } });
    const winCount: Record<string, number> = {};
    matches.forEach((m) => { winCount[m.winner] = (winCount[m.winner] || 0) + 1; });

    let championTeamName = "";
    let maxWins = 0;
    for (const [name, wins] of Object.entries(winCount)) {
      if (wins > maxWins) { maxWins = wins; championTeamName = name; }
    }

    // Find champion team and its players
    const championTeam = await prisma.gameTeam.findFirst({
      where: { gameId, name: championTeamName },
      include: { players: true },
    });

    // Update titles for champion players
    if (championTeam) {
      await Promise.all(
        championTeam.players.map((p) =>
          prisma.userStats.upsert({
            where: { userId: p.userId },
            create: { userId: p.userId, wins: 0, losses: 0, level: 1, titles: 1 },
            update: { titles: { increment: 1 } },
          })
        )
      );
    }

    // Get first player of champion team as representative (for championId)
    const firstChampionPlayer = championTeam?.players[0];

    await prisma.game.update({
      where: { id: gameId },
      data: {
        status: "finished",
        championId: firstChampionPlayer?.userId ?? null,
      },
    });

    return NextResponse.json({ ok: true, champion: championTeamName });
  } catch (err) {
    console.error("[FINISH]", err);
    return NextResponse.json(
      { error: "Erro ao finalizar jogo" },
      { status: 500 }
    );
  }
}
