import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const token = await verifyToken();
  if (!token || token.role !== "admin")
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { date, maxPlayers, teamSize, pointsPerMatch, twoWinsRule } = await req.json();

  const gameDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (gameDate < today)
    return NextResponse.json({ error: "Não é permitido criar jogo no passado" }, { status: 400 });

  const game = await prisma.game.create({
    data: {
      date: gameDate,
      maxPlayers,
      teamSize,
      pointsPerMatch,
      twoWinsRule,
      createdById: token.id,
    },
  });

  return NextResponse.json({ ok: true, game });
}
