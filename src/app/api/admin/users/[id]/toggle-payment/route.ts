import { NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { togglePaymentType } from "@/application/users/usersService";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    const paymentType = await togglePaymentType(id);
    return NextResponse.json({ ok: true, paymentType });
  } catch (err) {
    return jsonFromError(err, "Erro ao trocar tipo");
  }
}
