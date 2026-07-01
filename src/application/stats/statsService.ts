import prisma from "@/infrastructure/db/prisma";
import { HttpError } from "@/shared/http";

function winRate(wins: number, losses: number) {
  return wins + losses === 0 ? 0 : Math.round((wins / (wins + losses)) * 100);
}

export async function getAdminStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { stats: true },
  });

  if (!user) throw new HttpError(404, "Administrador não encontrado");

  const wins = user.stats?.wins ?? 0;
  const losses = user.stats?.losses ?? 0;

  return {
    name: user.name,
    titles: user.stats?.titles ?? 0,
    level: user.stats?.level ?? 1,
    wins,
    losses,
    rate: winRate(wins, losses),
  };
}

export async function getPlayerStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { stats: true },
  });

  if (!user) throw new HttpError(404, "Usuário não encontrado");

  const wins = user.stats?.wins ?? 0;
  const losses = user.stats?.losses ?? 0;

  return {
    id: user.id,
    name: user.name,
    titles: user.stats?.titles ?? 0,
    level: user.stats?.level ?? 1,
    wins,
    losses,
    rate: winRate(wins, losses),
  };
}

export async function getRanking() {
  const users = await prisma.user.findMany({
    where: { role: { not: "visitor" } },
    include: { stats: true },
    orderBy: { name: "asc" },
  });

  return users
    .map((u) => ({
      id: u.id,
      name: u.name,
      photo: u.photo ?? "🏐",
      level: u.stats?.level ?? u.level ?? 1,
      wins: u.stats?.wins ?? 0,
      losses: u.stats?.losses ?? 0,
      titles: u.stats?.titles ?? 0,
    }))
    .sort((a, b) => b.wins - a.wins);
}
