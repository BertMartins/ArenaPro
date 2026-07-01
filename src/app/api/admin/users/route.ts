import { NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { listUsers } from "@/application/users/usersService";

export async function GET() {
  const auth = await requireAdmin("Acesso negado");
  if (auth instanceof NextResponse) return auth;

  try {
    const users = await listUsers();
    return NextResponse.json(users);
  } catch (err) {
    return jsonFromError(err);
  }
}
