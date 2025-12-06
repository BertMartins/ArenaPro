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
  });

  if (!game) {
    return NextResponse.json({ error: "Jogo não encontrado" }, { status: 404 });
  }

  // Verificar cutoff
  const cutoff = game.cutoffTime || "15:00";
  const [h, m] = cutoff.split(":").map(Number);

  const cutoffDate = new Date(game.date);
  cutoffDate.setHours(h, m, 0, 0);

  const now = new Date();

  if (now > cutoffDate) {
    return NextResponse.json(
      { error: "Prazo para sair do jogo já encerrou" },
      { status: 400 }
    );
  }

  // Verificar se está no jogo
  const exists = await prisma.gamePlayer.findFirst({
    where: { userId, gameId },
  });

  if (!exists) {
    return NextResponse.json(
      { error: "Você não está nesse jogo" },
      { status: 400 }
    );
  }

  // Remover inscrição
  await prisma.gamePlayer.deleteMany({
    where: { userId, gameId },
  });

  return NextResponse.json({
    ok: true,
    message: "Você saiu do jogo.",
  });
}
