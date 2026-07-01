import { NextResponse } from "next/server";
import { requireAdmin, jsonError } from "@/shared/http";
import { getMonthlyPayments, setMonthlyFee } from "@/application/payments/paymentsService";

export async function GET() {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const data = await getMonthlyPayments();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[GET PAYMENTS]", err);
    return jsonError("Erro interno", 500);
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const { feeTotal } = await req.json();
    await setMonthlyFee(Number(feeTotal));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST PAYMENTS]", err);
    return jsonError("Erro interno", 500);
  }
}
