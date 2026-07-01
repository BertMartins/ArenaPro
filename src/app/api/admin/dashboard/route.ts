import { NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { getAdminDashboard } from "@/application/dashboard/dashboardService";

export async function GET() {
  const auth = await requireAdmin("Não autorizado", 403);
  if (auth instanceof NextResponse) return auth;

  try {
    const dashboard = await getAdminDashboard(auth.id);
    return NextResponse.json({ dashboard });
  } catch (err) {
    return jsonFromError(err, "Falha ao carregar dashboard");
  }
}
