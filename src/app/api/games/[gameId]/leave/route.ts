import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const token = await verifyToken();
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    await prisma.gamePlayer.deleteMany({
      where: { userId: token.id, gameId: params.gameId },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
