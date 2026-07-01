import { NextResponse } from "next/server";
import { jsonFromError } from "@/shared/http";
import { login } from "@/application/auth/authService";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await login(email, password);
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    return jsonFromError(err, "Erro interno");
  }
}
