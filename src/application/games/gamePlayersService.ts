import prisma from "@/infrastructure/db/prisma";
import { HttpError } from "@/shared/http";
import { reconcileGame } from "./gameReconcileService";

export async function joinGame(gameId: string, userId: string) {
  const [game, userRecord] = await Promise.all([
    prisma.game.findUnique({ where: { id: gameId }, include: { players: true } }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  if (!game) throw new HttpError(404, "Jogo não encontrado");
  if (game.status !== "open") throw new HttpError(400, "Jogo não está aberto");

  const exists = await prisma.gamePlayer.findFirst({ where: { gameId, userId } });
  if (exists) throw new HttpError(400, "Você já está no jogo");

  const userPaymentType = userRecord?.paymentType ?? "monthly";

  await prisma.gamePlayer.create({
    data: { gameId, userId, paymentType: userPaymentType },
  });

  await reconcileGame(gameId);

  return prisma.game.findUnique({
    where: { id: gameId },
    include: { players: { include: { user: true } } },
  });
}

export async function leaveGame(gameId: string, userId: string) {
  const player = await prisma.gamePlayer.findFirst({ where: { gameId, userId } });
  if (!player) throw new HttpError(400, "Você não está no jogo");

  await prisma.gamePlayer.delete({ where: { id: player.id } });

  // Limpa qualquer lançamento financeiro confirmado para esse jogador neste jogo
  await prisma.financialEntry.deleteMany({
    where: { gameId, userId, category: "daily_fee" },
  });

  await reconcileGame(gameId);

  return prisma.game.findUnique({
    where: { id: gameId },
    include: { players: { include: { user: true } } },
  });
}

export async function addVisitor(gameId: string, name: string, level: number) {
  if (!name || !level) throw new HttpError(400, "Nome e nível obrigatórios");

  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) throw new HttpError(404, "Jogo não encontrado");

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

  await reconcileGame(gameId);

  return prisma.game.findUnique({
    where: { id: gameId },
    include: {
      players: { include: { user: true } },
      teams: { include: { players: { include: { user: true } } } },
      matches: true,
    },
  });
}

export async function removePlayer(gameId: string, playerId: string) {
  const player = await prisma.gamePlayer.findFirst({
    where: { gameId, userId: playerId },
  });
  if (!player) throw new HttpError(404, "Jogador não encontrado no jogo");

  await prisma.gamePlayer.delete({ where: { id: player.id } });

  // Limpa qualquer lançamento financeiro confirmado para esse jogador neste jogo
  await prisma.financialEntry.deleteMany({
    where: { gameId, userId: playerId, category: "daily_fee" },
  });

  await reconcileGame(gameId);

  return prisma.game.findUnique({
    where: { id: gameId },
    include: {
      players: { include: { user: true } },
      teams: { include: { players: { include: { user: true } } } },
      matches: true,
    },
  });
}

export async function confirmPayment(gameId: string, playerId: string) {
  const player = await prisma.gamePlayer.findFirst({
    where: { gameId, userId: playerId },
    include: { user: true, game: true },
  });

  if (!player) throw new HttpError(404, "Jogador não encontrado no jogo");

  if (player.paymentType !== "daily") {
    throw new HttpError(400, "Mensalistas não usam confirmação de pagamento por jogo");
  }

  if (player.paid) {
    // Reverter confirmação
    await prisma.gamePlayer.update({
      where: { id: player.id },
      data: { paid: false, paidAt: null },
    });

    await prisma.financialEntry.deleteMany({
      where: { gameId, userId: playerId, category: "daily_fee" },
    });
  } else {
    await prisma.gamePlayer.update({
      where: { id: player.id },
      data: { paid: true, paidAt: new Date() },
    });

    await prisma.financialEntry.create({
      data: {
        date: player.game.date,
        direction: "income",
        category: "daily_fee",
        gameId,
        userId: playerId,
        amount: 15,
        note: `${player.user.role === "visitor" ? "Visitante" : "Diarista"}: ${player.user.name}`,
      },
    });
  }

  await reconcileGame(gameId);

  return prisma.game.findUnique({
    where: { id: gameId },
    include: { players: { include: { user: true } } },
  });
}
