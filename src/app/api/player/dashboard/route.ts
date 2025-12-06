import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const userId = auth.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Stats do usuário
    const stats = await prisma.userStats.findUnique({
      where: { userId },
    });

    // Jogos de hoje
    const gamesToday = await prisma.game.findMany({
      where: { date: { gte: today } },
      include: {
        createdBy: true,
        players: { include: { user: true } },
      },
      orderBy: { date: "asc" },
    });

    // Jogos em que ele está inscrito
    const myGames = await prisma.gamePlayer.findMany({
      where: { userId },
      include: {
        game: {
          include: {
            players: { include: { user: true } },
            createdBy: true,
          },
        },
      },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json({
      dashboard: {
        stats: stats || { wins: 0, losses: 0, titles: 0, level: 1 },
        gamesToday,
        myGames,
        currentUserId: userId,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao carregar dashboard do jogador" },
      { status: 500 }
    );
  }
}
