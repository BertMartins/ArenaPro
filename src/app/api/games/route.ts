import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const games = await prisma.game.findMany({
    where: { date: { gte: today } },
    orderBy: { date: "asc" },
    include: {
      players: true,
      champion: true,
    },
  });

  return NextResponse.json(games);
}
