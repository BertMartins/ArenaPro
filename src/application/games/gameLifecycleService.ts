import prisma from "@/infrastructure/db/prisma";
import { TEAM_CONFIGS } from "@/domain/games/gameRules";
import { HttpError } from "@/shared/http";
import { reconcileGame } from "./gameReconcileService";

export async function startGame(gameId: string) {
  await reconcileGame(gameId);

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: {
      players: {
        include: { user: { include: { stats: true } } },
        orderBy: { timestamp: "asc" },
      },
    },
  });

  if (!game) throw new HttpError(404, "Jogo não encontrado");
  if (game.status !== "open") throw new HttpError(400, "Jogo já foi iniciado");

  // Lista principal já decidida pelo reconcileGame (prioridade/ordem de
  // chegada + pagamentos confirmados)
  const mainPlayers = game.players
    .filter((p) => p.mainEnteredAt != null && !p.expired)
    .sort((a, b) => a.mainEnteredAt!.getTime() - b.mainEnteredAt!.getTime())
    .slice(0, game.maxPlayers);

  if (mainPlayers.length < game.teamSize * 2) {
    throw new HttpError(400, `Mínimo de ${game.teamSize * 2} jogadores necessários`);
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

  await prisma.game.update({
    where: { id: gameId },
    data: { status: "in_progress" },
  });

  return prisma.game.findUnique({
    where: { id: gameId },
    include: {
      players: { include: { user: true } },
      teams: { include: { players: { include: { user: { include: { stats: true } } } } } },
      matches: true,
    },
  });
}

export async function finishGame(gameId: string) {
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) throw new HttpError(404, "Jogo não encontrado");
  if (game.status === "finished") throw new HttpError(400, "Jogo já está finalizado");

  // Find champion team (most wins in match history)
  const matches = await prisma.matchHistory.findMany({ where: { gameId } });
  const winCount: Record<string, number> = {};
  matches.forEach((m) => {
    winCount[m.winner] = (winCount[m.winner] || 0) + 1;
  });

  let championTeamName = "";
  let maxWins = 0;
  for (const [name, wins] of Object.entries(winCount)) {
    if (wins > maxWins) {
      maxWins = wins;
      championTeamName = name;
    }
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

  return championTeamName;
}
