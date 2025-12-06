import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Total de usuários
    const totalUsuarios = await prisma.user.count();

    // Total de jogadores
    const totalJogadores = await prisma.user.count({
      where: { role: "player" },
    });

    // Total de jogos
    const totalJogos = await prisma.game.count();

    // Últimos campeões
    const ultimosGames = await prisma.game.findMany({
      where: { championId: { not: null } },
      include: { champion: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Jogos disponíveis (abertos)
    const jogosDisponiveis = await prisma.game.findMany({
      where: { status: "open" },
      include: {
        players: true,
      },
      orderBy: { date: "asc" },
      take: 10,
    });

    return NextResponse.json({
      totalUsuarios,
      totalJogadores,
      totalJogos,
      ultimosGames,
      jogosDisponiveis,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao carregar dashboard" }, { status: 500 });
  }
}
