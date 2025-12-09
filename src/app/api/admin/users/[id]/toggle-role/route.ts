import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: Request, { params }: any) {
  try {
    const admin = await verifyToken();
    if (!admin || admin.role !== "admin")
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user)
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    const newRole = user.role === "admin" ? "player" : "admin";

    await prisma.user.update({
      where: { id: params.id },
      data: { role: newRole },
    });

    return NextResponse.json({ ok: true, role: newRole });
  } catch (err) {
    console.error("[TOGGLE ROLE]", err);
    return NextResponse.json({ error: "Erro ao trocar perfil" }, { status: 500 });
  }
}
