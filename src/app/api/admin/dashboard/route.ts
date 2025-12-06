import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

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
        players: { include: { user: true } }
      },
      orderBy: { date: "asc" }
    });

    const lastGames = await prisma.game.findMany({
      where: { status: "finished" },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { champion: true }
    });

    const recentFinancial = await prisma.financialEntry.findMany({
      take: 5,
      orderBy: { date: "desc" },
      include: { user: true, game: true }
    });

    return NextResponse.json({
      dashboard: {
        stats,
        gamesToday,
        lastGames,
        recentFinancial,
        currentUserId: auth.id
      }
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Falha ao carregar dashboard" }, { status: 500 });
  }
}
