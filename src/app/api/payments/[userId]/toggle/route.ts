import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;

    const token = await verifyToken();
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const existing = await prisma.payment.findFirst({
      where: { userId, month, year },
    });

    const isPaid = existing?.status === "paid";

    if (isPaid) {
      // Reverter para pendente
      await prisma.payment.update({
        where: { id: existing!.id },
        data: { status: "pending", paidAt: null },
      });

      // Remover entrada financeira correspondente
      await prisma.financialEntry.deleteMany({
        where: {
          type: "arena_payment",
          userId,
          date: { gte: first, lt: next },
        },
      });

      return NextResponse.json({ ok: true, hasPaid: false });
    } else {
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
      const monthlyCount = await prisma.user.count({
        where: { paymentType: "monthly" },
      });
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

      return NextResponse.json({ ok: true, hasPaid: true });
    }
  } catch (err) {
    console.error("[TOGGLE PAYMENT]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
