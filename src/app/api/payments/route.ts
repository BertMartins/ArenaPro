import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

function getMonthRange() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { first, next, month: now.getMonth() + 1, year: now.getFullYear() };
}

export async function GET() {
  try {
    const token = await verifyToken();
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

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
    const feePerPerson =
      monthlyUsers.length > 0 ? feeTotal / monthlyUsers.length : 0;

    return NextResponse.json({
      monthlyUsers: monthlyUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        photo: u.photo ?? "🏐",
        hasPaid:
          u.payments.length > 0 && u.payments[0].status === "paid",
        paidAt: u.payments[0]?.paidAt ?? null,
      })),
      feeTotal,
      feePerPerson,
      month,
      year,
    });
  } catch (err) {
    console.error("[GET PAYMENTS]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = await verifyToken();
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const { feeTotal } = await req.json();
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

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST PAYMENTS]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
