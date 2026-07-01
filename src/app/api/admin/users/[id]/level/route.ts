import { NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { updateUserLevel } from "@/application/users/usersService";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    const body = await req.json();
    const stats = await updateUserLevel(id, Number(body.level));
    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    return jsonFromError(err, "Erro ao atualizar nível");
  }
}
