import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  req: Request,
  context: { params: Promise<{ gameId: string }> }
) {
  try {
    const { gameId } = await context.params;

    const user = await verifyToken();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const teams = await prisma.gameTeam.findMany({
      where: { gameId },
      include: {
        players: {
          include: { user: true }
        }
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json(teams);
  } catch (err) {
    console.error("Erro GET teams:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// Criar times (somente admin)
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

    const { teams } = await req.json();

    // Ex: teams = [{ name: "Time Vermelho", color: "#FF0000", players: [userIds...] }]

    // limpar times anteriores
    await prisma.gameTeamPlayer.deleteMany({ where: { team: { gameId } } });
    await prisma.gameTeam.deleteMany({ where: { gameId } });

    for (const t of teams) {
      const team = await prisma.gameTeam.create({
        data: {
          name: t.name,
          color: t.color,
          gameId
        }
      });

      for (const userId of t.players) {
        await prisma.gameTeamPlayer.create({
          data: {
            teamId: team.id,
            userId
          }
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro POST teams:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
