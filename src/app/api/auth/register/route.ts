import { NextResponse } from "next/server";
import { jsonFromError } from "@/shared/http";
import { register } from "@/application/auth/authService";

export async function POST(req: Request) {
  try {
    const { name, email, password, paymentType, level } = await req.json();
    const user = await register({ name, email, password, paymentType, level });
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    return jsonFromError(err, "Erro interno");
  }
}
