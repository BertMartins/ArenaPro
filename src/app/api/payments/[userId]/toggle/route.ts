import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, jsonError } from "@/shared/http";
import { toggleMonthlyPayment } from "@/application/payments/paymentsService";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const { userId } = await context.params;
    const result = await toggleMonthlyPayment(userId);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[TOGGLE PAYMENT]", err);
    return jsonError("Erro interno", 500);
  }
}
