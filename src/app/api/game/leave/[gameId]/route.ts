import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await context.params;

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId não informado" },
        { status: 400 }
      );
    }

    await prisma.gamePlayer.deleteMany({
      where: {
        gameId,
        userId,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Saiu do jogo",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
