import { NextResponse } from "next/server";
import { requireAuth, jsonFromError } from "@/shared/http";
import { castVotes } from "@/application/voting/votingService";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    const body = await req.json();
    const result = await castVotes(id, auth.id, body.votes);
    return NextResponse.json(result);
  } catch (err) {
    return jsonFromError(err, "Erro ao registrar votos");
  }
}
