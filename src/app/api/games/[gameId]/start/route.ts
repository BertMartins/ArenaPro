import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

const TEAM_CONFIGS = [
  { name: "Vermelho", color: "#EF4444" },
  { name: "Azul", color: "#3B82F6" },
  { name: "Verde", color: "#10B981" },
  { name: "Preto", color: "#374151" },
];

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await context.params;

    const token = await verifyToken();
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: {
          include: { user: { include: { stats: true } } },
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    if (game.status !== "open") {
      return NextResponse.json({ error: "Jogo já foi iniciado" }, { status: 400 });
    }

    // Separar mensalistas (lista principal) de diaristas
    const monthly = game.players.filter((p) => p.paymentType === "monthly");
    const daily = game.players.filter((p) => p.paymentType === "daily");
    const mainPlayers = [...monthly, ...daily].slice(0, game.maxPlayers);

    if (mainPlayers.length < game.teamSize * 2) {
      return NextResponse.json(
        { error: `Mínimo de ${game.teamSize * 2} jogadores necessários` },
        { status: 400 }
      );
    }

    const numTeams = Math.floor(mainPlayers.length / game.teamSize);

    // Ordenar por nível desc para distribuição balanceada
    const sorted = [...mainPlayers].sort((a, b) => {
      const la = a.user.stats?.level ?? a.user.level ?? 1;
      const lb = b.user.stats?.level ?? b.user.level ?? 1;
      return lb - la;
    });

    // Limpar times existentes
    await prisma.gameTeamPlayer.deleteMany({ where: { team: { gameId } } });
    await prisma.gameTeam.deleteMany({ where: { gameId } });

    // Criar times e distribuir jogadores (round-robin)
    const teamIds: string[] = [];
    for (let i = 0; i < numTeams; i++) {
      const cfg = TEAM_CONFIGS[i % TEAM_CONFIGS.length];
      const team = await prisma.gameTeam.create({
        data: { gameId, name: cfg.name, color: cfg.color },
      });
      teamIds.push(team.id);
    }

    for (let i = 0; i < sorted.length && i < numTeams * game.teamSize; i++) {
      await prisma.gameTeamPlayer.create({
        data: { teamId: teamIds[i % numTeams], userId: sorted[i].userId },
      });
    }

    // Atualizar status
    await prisma.game.update({
      where: { id: gameId },
      data: { status: "in_progress" },
    });

    const updated = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: { include: { user: true } },
        teams: { include: { players: { include: { user: { include: { stats: true } } } } } },
        matches: true,
      },
    });

    return NextResponse.json({ ok: true, game: updated });
  } catch (err) {
    console.error("[START GAME]", err);
    return NextResponse.json({ error: "Erro ao iniciar jogo" }, { status: 500 });
  }
}
