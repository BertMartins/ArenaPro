import prisma from "@/infrastructure/db/prisma";

export async function getFinancialSummary() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const entries = await prisma.financialEntry.findMany({
    where: {
      date: { gte: first, lt: next },
      NOT: { note: "fee_config" },
    },
    include: { user: true, game: true },
    orderBy: { date: "desc" },
  });

  const arenaPaid = entries
    .filter((e) => e.type === "arena_payment")
    .reduce((s, e) => s + e.amount, 0);

  const dailyBox = entries
    .filter((e) => e.type === "daily_fee")
    .reduce((s, e) => s + e.amount, 0);

  const dailyPlayers = entries
    .filter((e) => e.type === "daily_fee")
    .map((e) => ({
      id: e.id,
      userId: e.userId,
      userName: e.user?.name ?? "Desconhecido",
      gameDate: e.game?.date ?? e.date,
      amount: e.amount,
    }));

  return {
    arenaPaid,
    dailyBox,
    dailyPlayers,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}
