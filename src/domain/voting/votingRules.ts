export type VotingPhase = "scheduled" | "open" | "closed";

export function computePhase(
  session: { status: string; startAt: Date; endAt: Date },
  now: Date = new Date()
): VotingPhase {
  if (session.status === "closed") return "closed";
  if (now < session.startAt) return "scheduled";
  if (now >= session.endAt) return "closed";
  return "open";
}

export function roundLevelAverage(average: number): number {
  return Math.min(6, Math.max(1, Math.ceil(average)));
}
