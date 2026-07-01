import { NextResponse } from "next/server";
import { requireAuth, jsonFromError } from "@/shared/http";
import { getSessionForViewer } from "@/application/voting/votingService";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    const session = await getSessionForViewer(id, auth.id);
    return NextResponse.json(session);
  } catch (err) {
    return jsonFromError(err, "Erro ao carregar votação");
  }
}
