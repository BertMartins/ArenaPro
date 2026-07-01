import { NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { deleteExpense } from "@/application/financial/financialService";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    await deleteExpense(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return jsonFromError(err, "Erro ao excluir gasto");
  }
}
