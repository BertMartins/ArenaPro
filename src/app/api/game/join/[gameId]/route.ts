import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = auth.id;
  const gameId = params.gameId;

  // Buscar jogo
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { players: true },
  });

  if (!game) {
    return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
  }

  if (game.status !== "open") {
    return NextResponse.json(
      { error: "Esse jogo não está mais aberto" },
      { status: 400 }
    );
  }

  // Jogo cheio
  if (game.players.length >= game.maxPlayers) {
    return NextResponse.json({ error: "Jogo cheio" }, { status: 400 });
  }

  // Verificar cutoff
  const cutoff = game.cutoffTime || "15:00";
  const [h, m] = cutoff.split(":").map(Number);

  const cutoffDate = new Date(game.date);
  cutoffDate.setHours(h, m, 0, 0);

  const now = new Date();

  if (now > cutoffDate) {
    return NextResponse.json(
      { error: "Tempo limite para entrar nesse jogo já passou" },
      { status: 400 }
    );
  }

  // Verificar se já está no jogo
  const already = await prisma.gamePlayer.findFirst({
    where: { userId, gameId },
  });

  if (already) {
    return NextResponse.json(
      { error: "Você já está inscrito nesse jogo" },
      { status: 400 }
    );
  }

  // Criar inscrição
  await prisma.gamePlayer.create({
    data: {
      gameId,
      userId,
      paymentType: auth.paymentType ?? "monthly",
    },
  });

  return NextResponse.json({
    ok: true,
    message: "Você entrou no jogo!",
  });
}
