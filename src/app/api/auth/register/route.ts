import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, paymentType, level } = await req.json();

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "player",
        level: typeof level === "number" && level >= 1 && level <= 6 ? level : 1,
        paymentType: paymentType === "daily" ? "daily" : "monthly",
        stats: { create: { level: typeof level === "number" && level >= 1 && level <= 6 ? level : 1 } },
      },
    });

    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
