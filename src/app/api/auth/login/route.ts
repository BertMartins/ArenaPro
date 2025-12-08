import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken, setTokenCookie } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
      include: { stats: true },
    });

    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 400 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: "Senha incorreta" }, { status: 400 });

    const token = await signToken({ id: user.id, role: user.role });
    await setTokenCookie(token);

    return NextResponse.json({
      message: "Login realizado!",
      user: { id: user.id, role: user.role },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
