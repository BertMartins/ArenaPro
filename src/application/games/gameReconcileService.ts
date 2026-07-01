import prisma from "@/infrastructure/db/prisma";
import type { GamePlayer } from "@prisma/client";
import { buildWindowStart, isEligibleForMain } from "@/domain/games/gameRules";

/**
 * Recalcula a lista principal/suplentes de um jogo aberto:
 * - mensalistas sempre prioritários (tipo "monthly_priority") ou ordem de
 *   chegada (tipo "general");
 * - diaristas só entram na lista principal a partir do paymentWindowStart
 *   (no tipo "monthly_priority") ou imediatamente (no tipo "general", mas
 *   sujeitos ao prazo de pagamento depois do paymentWindowStart);
 * - diarista na lista principal sem confirmação de pagamento até o prazo
 *   (paymentDeadlineMinutes a partir de max(mainEnteredAt, paymentWindowStart))
 *   perde a vaga (expired = true) e libera espaço para o próximo suplente.
 *
 * Persiste só os registros que mudaram. Quem chamar deve re-buscar o jogo
 * depois para ver o estado atualizado.
 */
export async function reconcileGame(gameId: string, now: Date = new Date()) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { players: true },
  });

  if (!game || game.status !== "open") return;

  const windowStart = buildWindowStart(game);
  const active = game.players.filter((p) => !p.expired);

  const priorityOrder =
    game.type === "monthly_priority"
      ? [
          ...active
            .filter((p) => p.paymentType === "monthly")
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
          ...active
            .filter((p) => p.paymentType === "daily")
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
        ]
      : [...active].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // 1) Quem já está na lista principal mantém a vaga (sticky).
  const mainList: GamePlayer[] = priorityOrder
    .filter((p) => p.mainEnteredAt != null)
    .sort((a, b) => a.mainEnteredAt!.getTime() - b.mainEnteredAt!.getTime());
  const mainIds = new Set(mainList.map((p) => p.id));

  // 2) Preenche vagas restantes em ordem de prioridade, respeitando elegibilidade.
  for (const p of priorityOrder) {
    if (mainList.length >= game.maxPlayers) break;
    if (mainIds.has(p.id)) continue;
    if (!isEligibleForMain(p, game, now, windowStart)) continue;
    mainList.push(p);
    mainIds.add(p.id);
  }

  // 3) Expira diaristas não pagos cujo prazo já passou, liberando vaga.
  type Update = { id: string; data: Partial<GamePlayer> };
  const updates: Update[] = [];
  const stillMain: GamePlayer[] = [];
  let freedSlots = 0;

  for (const p of mainList) {
    const isNewlyAssigned = p.mainEnteredAt == null;
    const mainEnteredAt = p.mainEnteredAt ?? now;

    if (p.paymentType === "daily" && !p.paid) {
      const base = mainEnteredAt > windowStart ? mainEnteredAt : windowStart;
      const deadline = new Date(base.getTime() + game.paymentDeadlineMinutes * 60000);
      if (now > deadline) {
        updates.push({ id: p.id, data: { expired: true } });
        freedSlots++;
        continue;
      }
    }

    if (isNewlyAssigned) {
      updates.push({ id: p.id, data: { mainEnteredAt: now } });
    }
    stillMain.push(p);
  }

  // 4) Promove suplentes para as vagas liberadas pela expiração.
  if (freedSlots > 0) {
    const stillMainIds = new Set(stillMain.map((p) => p.id));
    const expiredIds = new Set(
      updates.filter((u) => u.data.expired).map((u) => u.id)
    );
    for (const p of priorityOrder) {
      if (freedSlots <= 0) break;
      if (stillMainIds.has(p.id) || expiredIds.has(p.id)) continue;
      if (!isEligibleForMain(p, game, now, windowStart)) continue;
      updates.push({ id: p.id, data: { mainEnteredAt: now } });
      stillMainIds.add(p.id);
      freedSlots--;
    }
  }

  if (updates.length > 0) {
    await prisma.$transaction(
      updates.map((u) =>
        prisma.gamePlayer.update({ where: { id: u.id }, data: u.data })
      )
    );
  }
}

/** Roda reconcileGame em todos os jogos abertos. Usado pelo cron diário. */
export async function reconcileAllOpenGames(now: Date = new Date()) {
  const openGames = await prisma.game.findMany({
    where: { status: "open" },
    select: { id: true },
  });
  for (const g of openGames) {
    await reconcileGame(g.id, now);
  }
  return openGames.length;
}
