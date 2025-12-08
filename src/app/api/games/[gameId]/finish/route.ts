import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const token = await verifyToken();
    if (!token || token.role !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await prisma.game.update({
      where: { id: params.gameId },
      data: { status: "finished" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
