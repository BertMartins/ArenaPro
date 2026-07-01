import { NextResponse } from "next/server";
import { verifyToken, type AuthToken } from "@/infrastructure/auth/jwt";

export function jsonOk(data: Record<string, unknown> = {}, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

export function jsonError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

/** Erro de negócio com status HTTP associado, lançado pelos services. */
export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Mapeia o erro de um service para a resposta HTTP: se for um HttpError,
 * usa a mensagem/status dele; caso contrário, loga e devolve 500 genérico.
 */
export function jsonFromError(err: unknown, fallback = "Erro interno") {
  if (err instanceof HttpError) return jsonError(err.message, err.status);
  console.error(err);
  return jsonError(fallback, 500);
}

/**
 * Garante que existe um usuário autenticado. Retorna o token decodificado
 * ou já devolve a NextResponse de erro pronta para o controller repassar.
 */
export async function requireAuth(): Promise<AuthToken | NextResponse> {
  const token = await verifyToken();
  if (!token) return jsonError("Não autorizado", 401);
  return token;
}

/**
 * Garante que existe um usuário autenticado com role "admin".
 */
export async function requireAdmin(
  message = "Acesso negado",
  status = 401
): Promise<AuthToken | NextResponse> {
  const token = await verifyToken();
  if (!token || token.role !== "admin") return jsonError(message, status);
  return token;
}
