import prisma from "@/infrastructure/db/prisma";
import { HttpError } from "@/shared/http";

function getMonthRange(month: number, year: number) {
  const first = new Date(year, month - 1, 1);
  const next = new Date(year, month, 1);
  return { first, next };
}

export async function getCashBalance() {
  const [income, expense] = await Promise.all([
    prisma.financialEntry.aggregate({ where: { direction: "income" }, _sum: { amount: true } }),
    prisma.financialEntry.aggregate({ where: { direction: "expense" }, _sum: { amount: true } }),
  ]);

  return (income._sum.amount ?? 0) - (expense._sum.amount ?? 0);
}

export async function getMonthlySummary(month: number, year: number) {
  const { first, next } = getMonthRange(month, year);

  const entries = await prisma.financialEntry.findMany({
    where: { date: { gte: first, lt: next } },
    include: { user: true, game: true },
    orderBy: { date: "desc" },
  });

  const incomeEntries = entries
    .filter((e) => e.direction === "income")
    .map((e) => ({
      id: e.id,
      date: e.game?.date ?? e.date,
      category: e.category,
      amount: e.amount,
      note: e.note,
      userName: e.user?.name ?? null,
    }));

  const expenseEntries = entries
    .filter((e) => e.direction === "expense")
    .map((e) => ({
      id: e.id,
      date: e.date,
      amount: e.amount,
      note: e.note,
    }));

  const monthlyFeeIncome = incomeEntries
    .filter((e) => e.category === "monthly_fee")
    .reduce((s, e) => s + e.amount, 0);

  const dailyFeeIncome = incomeEntries
    .filter((e) => e.category === "daily_fee")
    .reduce((s, e) => s + e.amount, 0);

  const totalIncome = monthlyFeeIncome + dailyFeeIncome;
  const totalExpense = expenseEntries.reduce((s, e) => s + e.amount, 0);

  const cashBalance = await getCashBalance();

  return {
    cashBalance,
    month,
    year,
    monthlyFeeIncome,
    dailyFeeIncome,
    totalIncome,
    totalExpense,
    netMonth: totalIncome - totalExpense,
    incomeEntries,
    expenseEntries,
  };
}

export async function addExpense(input: { date: string | Date; description: string; amount: number }) {
  const description = input.description?.trim();
  const amount = Number(input.amount);
  const date = new Date(input.date);

  if (!description) throw new HttpError(400, "Descrição obrigatória");
  if (!Number.isFinite(amount) || amount <= 0) throw new HttpError(400, "Valor inválido");
  if (Number.isNaN(date.getTime())) throw new HttpError(400, "Data inválida");

  return prisma.financialEntry.create({
    data: {
      date,
      direction: "expense",
      category: "expense",
      amount,
      note: description,
    },
  });
}

export async function deleteExpense(id: string) {
  const entry = await prisma.financialEntry.findUnique({ where: { id } });
  if (!entry) throw new HttpError(404, "Lançamento não encontrado");
  if (entry.category !== "expense") {
    throw new HttpError(400, "Só é possível excluir lançamentos de gastos por aqui");
  }

  await prisma.financialEntry.delete({ where: { id } });
}
