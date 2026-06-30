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
    if (!token)
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const [game, userRecord] = await Promise.all([
      prisma.game.findUnique({ where: { id: gameId }, include: { players: true } }),
      prisma.user.findUnique({ where: { id: token.id } }),
    ]);

    if (!game)
      return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });

    if (game.status !== "open")
      return NextResponse.json({ error: "Jogo não está aberto" }, { status: 400 });

    const exists = await prisma.gamePlayer.findFirst({
      where: { gameId, userId: token.id },
    });

    if (exists)
      return NextResponse.json({ error: "Você já está no jogo" }, { status: 400 });

    const userPaymentType = userRecord?.paymentType ?? "monthly";

    await prisma.gamePlayer.create({
      data: {
        gameId,
        userId: token.id,
        paymentType: userPaymentType,
      },
    });

    // Se for diarista, registrar R$15 na caixinha
    if (userPaymentType === "daily" && userRecord) {
      const gameDate = game.date;
      await prisma.financialEntry.create({
        data: {
          date: gameDate,
          type: "daily_fee",
          gameId,
          userId: token.id,
          amount: 15,
          note: `Diarista: ${userRecord.name}`,
        },
      });
    }

    const updated = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: { include: { user: true } } },
    });

    return NextResponse.json({ ok: true, game: updated });
  } catch (err) {
    console.error("[JOIN]", err);
    return NextResponse.json(
      { error: "Erro ao entrar no jogo" },
      { status: 500 }
    );
  }
}
