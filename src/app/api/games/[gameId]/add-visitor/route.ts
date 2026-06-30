import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await context.params;

    const token = await verifyToken();
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, level } = body;

    if (!name || !level) {
      return NextResponse.json({ error: "Nome e nível obrigatórios" }, { status: 400 });
    }

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
    }

    const visitor = await prisma.user.create({
      data: {
        name,
        email: `visitor_${Date.now()}@arena.tmp`,
        password: "visitor",
        role: "visitor",
        paymentType: "daily",
        level: Number(level),
        stats: { create: {} },
      },
    });

    await prisma.gamePlayer.create({
      data: { gameId, userId: visitor.id, paymentType: "daily" },
    });

    // Registrar R$15 na caixinha
    const gameDate = game.date;
    const entryMonth = new Date(gameDate);
    await prisma.financialEntry.create({
      data: {
        date: entryMonth,
        type: "daily_fee",
        gameId,
        userId: visitor.id,
        amount: 15,
        note: `Visitante: ${name}`,
      },
    });

    const updated = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: { include: { user: true } },
        teams: { include: { players: { include: { user: true } } } },
        matches: true,
      },
    });

    return NextResponse.json({ ok: true, game: updated });
  } catch (err) {
    console.error("[ADD VISITOR]", err);
    return NextResponse.json({ error: "Erro ao adicionar visitante" }, { status: 500 });
  }
}
