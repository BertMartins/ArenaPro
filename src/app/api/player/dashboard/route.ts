import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("volei_token=")[1];

    if (!token) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const decoded: any = await verifyToken(token);
    const userId = decoded.id;

    // Stats do jogador
    const stats = await prisma.userStats.findUnique({
      where: { userId },
    });

    // Jogos que ele participa
    const meusJogos = await prisma.gamePlayer.findMany({
      where: { userId },
      include: { game: true },
      orderBy: { joinedAt: "desc" },
    });

    // Jogos disponíveis
    const jogosDisponiveis = await prisma.game.findMany({
      where: { status: "open" },
      include: { players: true },
      orderBy: { date: "asc" },
    });

    // Últimos campeões
    const ultimosGames = await prisma.game.findMany({
      where: { championId: { not: null } },
      include: { champion: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      stats,
      meusJogos,
      jogosDisponiveis,
      ultimosGames,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
