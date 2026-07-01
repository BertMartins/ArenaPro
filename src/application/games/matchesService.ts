import prisma from "@/infrastructure/db/prisma";

export async function getMatches(gameId: string) {
  return prisma.matchHistory.findMany({
    where: { gameId },
    orderBy: { matchNumber: "asc" },
  });
}

type RecordMatchInput = {
  matchNumber: number;
  team1Id: string;
  team2Id: string;
  score1: number;
  score2: number;
  winner: string;
};

export async function recordMatch(gameId: string, input: RecordMatchInput) {
  const match = await prisma.matchHistory.create({
    data: {
      gameId,
      matchNumber: input.matchNumber,
      team1Id: input.team1Id,
      team2Id: input.team2Id,
      score1: input.score1,
      score2: input.score2,
      winner: input.winner,
    },
  });

  // Update player stats (wins/losses)
  const winnerTeamId = input.score1 > input.score2 ? input.team1Id : input.team2Id;
  const loserTeamId = input.score1 > input.score2 ? input.team2Id : input.team1Id;

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

  return match;
}
