import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const token = await verifyToken();
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Pega estatísticas do admin
    const stats = await prisma.userStats.findUnique({
      where: { userId: token.id },
    });

    if (!stats) {
      return NextResponse.json(
        { level: 1, wins: 0, losses: 0, rate: 0 },
        { status: 200 }
      );
    }

    const rate =
      stats.wins + stats.losses === 0
        ? 0
        : Math.round((stats.wins / (stats.wins + stats.losses)) * 100);

    return NextResponse.json(
      {
        level: stats.level,
        wins: stats.wins,
        losses: stats.losses,
        rate,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
