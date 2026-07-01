import prisma from "@/infrastructure/db/prisma";

export async function getAdminDashboard(adminId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = {
    totalUsers: await prisma.user.count(),
    totalMonthly: await prisma.user.count({ where: { paymentType: "monthly" } }),
    totalDaily: await prisma.user.count({ where: { paymentType: "daily" } }),
  };

  const gamesToday = await prisma.game.findMany({
    where: { date: { gte: today } },
    include: {
      createdBy: true,
      champion: true,
      players: { include: { user: true } },
    },
    orderBy: { date: "asc" },
  });

  const lastGames = await prisma.game.findMany({
    where: { status: "finished" },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { champion: true },
  });

  const recentFinancial = await prisma.financialEntry.findMany({
    take: 5,
    orderBy: { date: "desc" },
    include: { user: true, game: true },
  });

  return {
    stats,
    gamesToday,
    lastGames,
    recentFinancial,
    currentUserId: adminId,
  };
}

export async function getPlayerDashboard(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = await prisma.userStats.findUnique({ where: { userId } });

  const gamesToday = await prisma.game.findMany({
    where: { date: { gte: today } },
    include: {
      createdBy: true,
      players: { include: { user: true } },
    },
    orderBy: { date: "asc" },
  });

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

  return {
    stats: stats || { wins: 0, losses: 0, titles: 0, level: 1 },
    gamesToday,
    myGames,
    currentUserId: userId,
  };
}
