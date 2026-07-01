import prisma from "@/infrastructure/db/prisma";

function getMonthRange() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { first, next, month: now.getMonth() + 1, year: now.getFullYear() };
}

export async function getMonthlyPayments() {
  const { first, next, month, year } = getMonthRange();

  const monthlyUsers = await prisma.user.findMany({
    where: { paymentType: "monthly" },
    include: {
      stats: true,
      payments: { where: { month, year } },
    },
    orderBy: { name: "asc" },
  });

  const feeEntry = await prisma.financialEntry.findFirst({
    where: { note: "fee_config", date: { gte: first, lt: next } },
  });

  const feeTotal = feeEntry?.amount ?? 0;
  const feePerPerson = monthlyUsers.length > 0 ? feeTotal / monthlyUsers.length : 0;

  return {
    monthlyUsers: monthlyUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      photo: u.photo ?? "🏐",
      hasPaid: u.payments.length > 0 && u.payments[0].status === "paid",
      paidAt: u.payments[0]?.paidAt ?? null,
    })),
    feeTotal,
    feePerPerson,
    month,
    year,
  };
}

export async function setMonthlyFee(feeTotal: number) {
  const { first, next } = getMonthRange();

  const existing = await prisma.financialEntry.findFirst({
    where: { note: "fee_config", date: { gte: first, lt: next } },
  });

  if (existing) {
    await prisma.financialEntry.update({
      where: { id: existing.id },
      data: { amount: Number(feeTotal) },
    });
  } else {
    await prisma.financialEntry.create({
      data: {
        date: first,
        type: "adjustment",
        amount: Number(feeTotal),
        note: "fee_config",
      },
    });
  }
}

export async function toggleMonthlyPayment(userId: string) {
  const { first, next, month, year } = getMonthRange();

  const existing = await prisma.payment.findFirst({ where: { userId, month, year } });
  const isPaid = existing?.status === "paid";

  if (isPaid) {
    // Reverter para pendente
    await prisma.payment.update({
      where: { id: existing!.id },
      data: { status: "pending", paidAt: null },
    });

    // Remover entrada financeira correspondente
    await prisma.financialEntry.deleteMany({
      where: { type: "arena_payment", userId, date: { gte: first, lt: next } },
    });

    return { hasPaid: false };
  }

  // Marcar como pago
  if (existing) {
    await prisma.payment.update({
      where: { id: existing.id },
      data: { status: "paid", paidAt: new Date() },
    });
  } else {
    await prisma.payment.create({
      data: { userId, month, year, status: "paid", paidAt: new Date() },
    });
  }

  // Calcular valor por pessoa
  const feeEntry = await prisma.financialEntry.findFirst({
    where: { note: "fee_config", date: { gte: first, lt: next } },
  });
  const monthlyCount = await prisma.user.count({ where: { paymentType: "monthly" } });
  const feeTotal = feeEntry?.amount ?? 0;
  const feePerPerson = monthlyCount > 0 ? feeTotal / monthlyCount : 0;

  // Criar entrada financeira (arena_payment) se não existir
  const existingArena = await prisma.financialEntry.findFirst({
    where: { type: "arena_payment", userId, date: { gte: first, lt: next } },
  });

  if (!existingArena && feePerPerson > 0) {
    await prisma.financialEntry.create({
      data: {
        date: new Date(),
        type: "arena_payment",
        userId,
        amount: feePerPerson,
        note: `Mensalidade ${month}/${year}`,
      },
    });
  }

  return { hasPaid: true };
}
