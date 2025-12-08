import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: any) {
  try {
    const user = await verifyToken();
    if (!user || user.role !== "admin")
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { name, email } = await req.json();

    await prisma.user.update({
      where: { id: params.id },
      data: { name, email },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("UPDATE PROFILE ERROR", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
