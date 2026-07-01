import { NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { finalizeNow } from "@/application/voting/votingService";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    const session = await finalizeNow(id);
    return NextResponse.json({ ok: true, session });
  } catch (err) {
    return jsonFromError(err, "Erro ao finalizar votação");
  }
}
