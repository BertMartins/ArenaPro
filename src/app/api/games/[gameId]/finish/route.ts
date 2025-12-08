import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  req: Request,
  context: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await context.params;

    const user = await verifyToken();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    await prisma.game.update({
      where: { id: gameId },
      data: { status: "finished" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro finish:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
