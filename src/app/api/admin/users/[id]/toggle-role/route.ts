import { NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { toggleRole } from "@/application/users/usersService";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    const role = await toggleRole(id);
    return NextResponse.json({ ok: true, role });
  } catch (err) {
    return jsonFromError(err, "Erro ao trocar perfil");
  }
}
