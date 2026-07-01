import { NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { addExpense } from "@/application/financial/financialService";

export async function POST(req: Request) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const entry = await addExpense({
      date: body.date,
      description: body.description,
      amount: body.amount,
    });
    return NextResponse.json({ ok: true, entry });
  } catch (err) {
    return jsonFromError(err, "Erro ao lançar gasto");
  }
}
