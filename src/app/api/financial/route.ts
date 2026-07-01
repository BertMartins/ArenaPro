import { NextResponse } from "next/server";
import { requireAdmin, jsonError } from "@/shared/http";
import { getFinancialSummary } from "@/application/financial/financialService";

export async function GET() {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const summary = await getFinancialSummary();
    return NextResponse.json(summary);
  } catch (err) {
    console.error("[GET FINANCIAL]", err);
    return jsonError("Erro interno", 500);
  }
}
