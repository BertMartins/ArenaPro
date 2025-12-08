import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const token = await verifyToken();
    if (!token || token.role !== "player")
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: token.id },
      include: { stats: true },
    });

    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    const wins = user.stats?.wins ?? 0;
    const losses = user.stats?.losses ?? 0;

    const rate = wins + losses === 0 ? 0 : Math.round((wins / (wins + losses)) * 100);

    return NextResponse.json({
      id: user.id,
      name: user.name,
      titles: user.stats?.titles ?? 0,
      level: user.stats?.level ?? 1,
      wins,
      losses,
      rate,
    });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
