import type { Game, GamePlayer } from "@prisma/client";

export const TEAM_CONFIGS = [
  { name: "Vermelho", color: "#EF4444" },
  { name: "Azul", color: "#3B82F6" },
  { name: "Verde", color: "#10B981" },
  { name: "Preto", color: "#374151" },
];

/**
 * Combina a data do jogo (Game.date, sempre meia-noite local) com o horário
 * "HH:mm" de paymentWindowStart num único instante.
 */
export function buildWindowStart(
  game: Pick<Game, "date" | "paymentWindowStart">
): Date {
  const d = new Date(game.date);
  const [hh, mm] = game.paymentWindowStart.split(":").map(Number);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh || 0, mm || 0, 0, 0);
}

export function isEligibleForMain(
  player: GamePlayer,
  game: Pick<Game, "type">,
  now: Date,
  windowStart: Date
) {
  if (game.type === "monthly_priority" && player.paymentType === "daily") {
    return now >= windowStart;
  }
  return true;
}
