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
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await prisma.gamePlayer.deleteMany({
      where: { gameId, userId: user.id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro leave:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
