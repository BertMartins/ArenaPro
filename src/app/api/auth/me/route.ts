import { NextResponse } from "next/server";
import { jsonError, jsonFromError } from "@/shared/http";
import { getCurrentUser } from "@/application/auth/authService";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return jsonError("Não autenticado", 401);
    return NextResponse.json({ user });
  } catch (err) {
    return jsonFromError(err, "Erro interno");
  }
}
