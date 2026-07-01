import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { addVisitor } from "@/application/games/gamePlayersService";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const { gameId } = await context.params;
    const { name, level } = await request.json();
    const game = await addVisitor(gameId, name, Number(level));
    return NextResponse.json({ ok: true, game });
  } catch (err) {
    return jsonFromError(err, "Erro ao adicionar visitante");
  }
}
