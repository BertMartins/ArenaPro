import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: Request, { params }: any) {
  try {
    const admin = await verifyToken();
    if (!admin || admin.role !== "admin")
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });

    const body = await req.json();

    const updated = await prisma.userStats.upsert({
      where: { userId: params.id },
      update: { level: Number(body.level) },
      create: { userId: params.id, level: Number(body.level) },
    });

    return NextResponse.json({ ok: true, stats: updated });
  } catch (err) {
    console.error("[LEVEL UPDATE]", err);
    return NextResponse.json({ error: "Erro ao atualizar nível" }, { status: 500 });
  }
}
