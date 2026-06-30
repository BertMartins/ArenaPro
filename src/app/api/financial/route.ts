import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const token = await verifyToken();
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

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

    return NextResponse.json({
      arenaPaid,
      dailyBox,
      dailyPlayers,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });
  } catch (err) {
    console.error("[GET FINANCIAL]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
