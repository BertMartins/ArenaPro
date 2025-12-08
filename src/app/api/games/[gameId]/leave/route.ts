import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(_: Request, { params }: { params: { gameId: string } }) {
  const token = await verifyToken();
  if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  await prisma.gamePlayer.deleteMany({
    where: { userId: token.id, gameId: params.gameId },
  });

  return NextResponse.json({ ok: true });
}
