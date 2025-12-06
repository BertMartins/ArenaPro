import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
    }

    const token = await signToken({
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    const res = NextResponse.json({
      message: "Login ok",
      user: { id: user.id, role: user.role, name: user.name, email: user.email },
    });

    res.cookies.set("volei_token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
