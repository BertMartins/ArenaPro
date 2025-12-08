import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 400 }
      );
    }

    const token = await signToken({
      id: user.id,
      role: user.role,
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
