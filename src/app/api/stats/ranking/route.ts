import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const token = await verifyToken();
    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: { role: { not: "visitor" } },
      include: { stats: true },
      orderBy: { name: "asc" },
    });

    const ranked = users
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

    return NextResponse.json(ranked);
  } catch (err) {
    console.error("[RANKING]", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
