import prisma from "@/infrastructure/db/prisma";

export async function getTeams(gameId: string) {
  return prisma.gameTeam.findMany({
    where: { gameId },
    include: {
      players: {
        include: { user: { include: { stats: true } } },
      },
    },
    orderBy: { name: "asc" },
  });
}

type ManualTeamInput = { name: string; color: string; players: string[] };

/** Define times manualmente (substitui os times existentes do jogo). */
export async function setTeamsManually(gameId: string, teams: ManualTeamInput[]) {
  await prisma.gameTeamPlayer.deleteMany({ where: { team: { gameId } } });
  await prisma.gameTeam.deleteMany({ where: { gameId } });

  for (const t of teams) {
    const team = await prisma.gameTeam.create({
      data: { name: t.name, color: t.color, gameId },
    });

    for (const userId of t.players) {
      await prisma.gameTeamPlayer.create({
        data: { teamId: team.id, userId },
      });
    }
  }
}
