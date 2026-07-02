import prisma from "@/infrastructure/db/prisma";
import { parseLocalDate, todayLocal } from "@/shared/date";
import { HttpError } from "@/shared/http";
import { reconcileGame } from "./gameReconcileService";

export type CreateGameInput = {
  date: string;
  maxPlayers: number;
  teamSize: number;
  pointsPerMatch: number;
  twoWinsRule?: boolean;
  type?: string;
  paymentWindowStart?: string;
  paymentDeadlineMinutes?: number;
  arenaName?: string;
  arenaLocation?: string;
  startTime?: string;
  endTime?: string;
};

export const GAME_TYPES = ["monthly_priority", "general"] as const;

export function isValidDateString(s: unknown) {
  if (typeof s !== "string") return false;
  const p = s.split("-");
  return p.length === 3 && p[0].length === 4;
}

export function isValidTimeString(s: unknown) {
  return typeof s === "string" && /^([01]\d|2[0-3]):([0-5]\d)$/.test(s);
}

export async function createGame(payload: CreateGameInput, createdById: string) {
  if (
    !payload.date ||
    !isValidDateString(payload.date) ||
    !payload.maxPlayers ||
    !payload.teamSize ||
    !payload.pointsPerMatch
  ) {
    throw new HttpError(400, "Campos obrigatórios inválidos");
  }

  if (!GAME_TYPES.includes(payload.type as (typeof GAME_TYPES)[number])) {
    throw new HttpError(400, "Tipo de jogo inválido");
  }

  if (!isValidTimeString(payload.paymentWindowStart)) {
    throw new HttpError(400, "Horário de início de pagamento inválido");
  }

  if (!payload.paymentDeadlineMinutes || payload.paymentDeadlineMinutes <= 0) {
    throw new HttpError(400, "Intervalo de pagamento inválido");
  }

  // ====== CORREÇÃO DE TIMEZONE ======
  const gameDate = parseLocalDate(payload.date);
  const today = todayLocal();

  if (gameDate < today) {
    throw new HttpError(400, "Data inválida (não pode ser no passado)");
  }

  return prisma.game.create({
    data: {
      date: gameDate,
      maxPlayers: payload.maxPlayers,
      teamSize: payload.teamSize,
      pointsPerMatch: payload.pointsPerMatch,
      twoWinsRule: payload.twoWinsRule ?? true,
      type: payload.type as (typeof GAME_TYPES)[number],
      paymentWindowStart: payload.paymentWindowStart!,
      paymentDeadlineMinutes: payload.paymentDeadlineMinutes!,
      arenaName: payload.arenaName,
      arenaLocation: payload.arenaLocation,
      startTime: payload.startTime,
      endTime: payload.endTime,
      createdById,
    },
  });
}

async function reconcileOpenGames() {
  const openGameIds = await prisma.game.findMany({
    where: { status: "open" },
    select: { id: true },
  });
  for (const g of openGameIds) {
    await reconcileGame(g.id);
  }
}

export async function listGames() {
  await reconcileOpenGames();

  return prisma.game.findMany({
    orderBy: { date: "asc" },
    include: {
      players: {
        include: {
          user: { include: { stats: true } },
        },
      },
    },
  });
}

export async function listAvailableGames() {
  await reconcileOpenGames();

  return prisma.game.findMany({
    where: { status: { not: "finished" } },
    orderBy: { date: "asc" },
    include: {
      players: {
        include: {
          user: { include: { stats: true } },
        },
      },
    },
  });
}

export async function getGame(gameId: string) {
  await reconcileGame(gameId);

  return prisma.game.findUnique({
    where: { id: gameId },
    include: {
      players: { include: { user: { include: { stats: true } } } },
      teams: {
        include: {
          players: {
            include: { user: { include: { stats: true } } },
          },
        },
      },
      matches: true,
    },
  });
}
