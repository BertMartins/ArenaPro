import prisma from "@/infrastructure/db/prisma";
import { HttpError } from "@/shared/http";
import { computePhase, roundLevelAverage } from "@/domain/voting/votingRules";

type CreateSessionInput = {
  title?: string;
  startAt: string | Date;
  endAt: string | Date;
};

type VoteInput = { targetId: string; level: number };

type SessionRecord = {
  id: string;
  title: string;
  startAt: Date;
  endAt: Date;
  status: string;
  closedAt: Date | null;
};

export async function createSession(input: CreateSessionInput, createdById: string) {
  const startAt = new Date(input.startAt);
  const endAt = new Date(input.endAt);

  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    throw new HttpError(400, "Datas inválidas");
  }
  if (endAt <= startAt) {
    throw new HttpError(400, "A data de término deve ser depois do início");
  }

  const status = new Date() >= startAt ? "open" : "scheduled";

  return prisma.levelVotingSession.create({
    data: {
      title: input.title?.trim() || undefined,
      startAt,
      endAt,
      status,
      createdById,
    },
  });
}

export async function listSessions() {
  const sessions = await prisma.levelVotingSession.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { votes: true } } },
  });

  return sessions.map((s) => ({
    id: s.id,
    title: s.title,
    startAt: s.startAt,
    endAt: s.endAt,
    status: s.status,
    phase: computePhase(s),
    votesCount: s._count.votes,
    createdAt: s.createdAt,
    closedAt: s.closedAt,
  }));
}

async function getEligibleParticipants() {
  return prisma.user.findMany({
    where: { role: { in: ["admin", "player"] } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, photo: true, level: true },
  });
}

export async function getSessionForViewer(id: string, viewerId: string) {
  const initial = await prisma.levelVotingSession.findUnique({ where: { id } });
  if (!initial) throw new HttpError(404, "Votação não encontrada");

  const session = await finalizeIfDue(initial);
  const phase = computePhase(session);
  const participants = await getEligibleParticipants();

  const base = {
    id: session.id,
    title: session.title,
    startAt: session.startAt,
    endAt: session.endAt,
    phase,
    participants,
  };

  if (phase === "open") {
    const myVotes = await prisma.levelVote.findMany({
      where: { sessionId: id, voterId: viewerId },
      select: { targetId: true, level: true },
    });
    return { ...base, myVotes };
  }

  if (phase === "closed") {
    const results = await computeResults(id, participants);
    return { ...base, results };
  }

  return base;
}

async function computeResults(
  sessionId: string,
  participants: { id: string; name: string; photo: string | null; level: number }[]
) {
  const grouped = await prisma.levelVote.groupBy({
    by: ["targetId"],
    where: { sessionId },
    _avg: { level: true },
    _count: { level: true },
  });

  const byTarget = new Map(grouped.map((g) => [g.targetId, g]));

  return participants.map((p) => {
    const g = byTarget.get(p.id);
    const votesCount = g?._count.level ?? 0;
    const average = g?._avg.level ?? null;
    return {
      userId: p.id,
      name: p.name,
      photo: p.photo,
      votesCount,
      average,
      level: p.level,
    };
  });
}

export async function castVotes(sessionId: string, voterId: string, votes: VoteInput[]) {
  const initial = await prisma.levelVotingSession.findUnique({ where: { id: sessionId } });
  if (!initial) throw new HttpError(404, "Votação não encontrada");

  const session = await finalizeIfDue(initial);

  if (computePhase(session) !== "open") {
    throw new HttpError(400, "Esta votação não está aberta para votos");
  }

  if (!Array.isArray(votes) || votes.length === 0) {
    throw new HttpError(400, "Nenhum voto informado");
  }

  const participants = await getEligibleParticipants();
  const validIds = new Set(participants.map((p) => p.id));

  for (const v of votes) {
    if (!validIds.has(v.targetId)) {
      throw new HttpError(400, "Participante inválido");
    }
    if (!Number.isInteger(v.level) || v.level < 1 || v.level > 6) {
      throw new HttpError(400, "Nível de voto inválido");
    }
  }

  await prisma.$transaction(
    votes.map((v) =>
      prisma.levelVote.upsert({
        where: { sessionId_voterId_targetId: { sessionId, voterId, targetId: v.targetId } },
        create: { sessionId, voterId, targetId: v.targetId, level: v.level },
        update: { level: v.level },
      })
    )
  );

  return { ok: true };
}

async function finalizeIfDue(session: SessionRecord): Promise<SessionRecord> {
  if (session.status !== "closed" && computePhase(session) === "closed") {
    return finalizeSession(session.id);
  }
  return session;
}

export async function finalizeSession(id: string): Promise<SessionRecord> {
  return prisma.$transaction(async (tx) => {
    const session = await tx.levelVotingSession.findUnique({ where: { id } });
    if (!session) throw new HttpError(404, "Votação não encontrada");
    if (session.status === "closed") return session;

    const grouped = await tx.levelVote.groupBy({
      by: ["targetId"],
      where: { sessionId: id },
      _avg: { level: true },
    });

    await Promise.all(
      grouped.map(async (g) => {
        if (g._avg.level == null) return;
        const newLevel = roundLevelAverage(g._avg.level);
        await tx.user.update({ where: { id: g.targetId }, data: { level: newLevel } });
        await tx.userStats.upsert({
          where: { userId: g.targetId },
          update: { level: newLevel },
          create: { userId: g.targetId, level: newLevel },
        });
      })
    );

    return tx.levelVotingSession.update({
      where: { id },
      data: { status: "closed", closedAt: new Date() },
    });
  });
}

export async function finalizeNow(id: string) {
  return finalizeSession(id);
}
