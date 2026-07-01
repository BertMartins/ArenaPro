import { NextResponse } from "next/server";
import { requireAdmin, jsonError } from "@/shared/http";
import { getMonthlySummary } from "@/application/financial/financialService";

export async function GET(req: Request) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const now = new Date();
    const month = Number(searchParams.get("month")) || now.getMonth() + 1;
    const year = Number(searchParams.get("year")) || now.getFullYear();

    const summary = await getMonthlySummary(month, year);
    return NextResponse.json(summary);
  } catch (err) {
    console.error("[GET FINANCIAL]", err);
    return jsonError("Erro interno", 500);
  }
}
