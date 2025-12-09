import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { parseLocalDate, todayLocal, formatDateBR } from "@/lib/date";

// Tipagem do payload de criação
type CreatePayload = {
  date: string;
  maxPlayers: number;
  teamSize: number;
  pointsPerMatch: number;
  twoWinsRule?: boolean;
};

function isValidDateString(s: any) {
  if (typeof s !== "string") return false;
  const p = s.split("-");
  return p.length === 3 && p[0].length === 4;
}

// =============================================
// POST → Criar jogo
// =============================================
export async function POST(req: Request) {
  try {
    // autenticação
    const user = await verifyToken();
    if (!user)
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    if (user.role !== "admin")
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

    // parse do body
    let body: any;
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }

    const payload: CreatePayload = {
      date: body.date,
      maxPlayers: Number(body.maxPlayers),
      teamSize: Number(body.teamSize),
      pointsPerMatch: Number(body.pointsPerMatch),
      twoWinsRule: Boolean(body.twoWinsRule),
    };

    // validações
    if (
      !payload.date ||
      !isValidDateString(payload.date) ||
      !payload.maxPlayers ||
      !payload.teamSize ||
      !payload.pointsPerMatch
    ) {
      return NextResponse.json(
        { error: "Campos obrigatórios inválidos" },
        { status: 400 }
      );
    }

    // ====== CORREÇÃO DE TIMEZONE ======
    const gameDate = parseLocalDate(payload.date);
    const today = todayLocal();

    if (gameDate < today) {
      return NextResponse.json(
        { error: "Data inválida (não pode ser no passado)" },
        { status: 400 }
      );
    }

    // criar jogo
    const created = await prisma.game.create({
      data: {
        date: gameDate,
        maxPlayers: payload.maxPlayers,
        teamSize: payload.teamSize,
        pointsPerMatch: payload.pointsPerMatch,
        twoWinsRule: payload.twoWinsRule ?? true,
        createdById: user.id,
      },
    });

    return NextResponse.json({ ok: true, game: created }, { status: 201 });
  } catch (err: any) {
    console.error("[/api/games] ERRO INTERNO", err);
    return NextResponse.json(
      { error: "Erro ao criar jogo" },
      { status: 500 }
    );
  }
}

// =============================================
// GET → Listar jogos futuros (hoje +)
// =============================================
// GET → Listar jogos futuros
export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: { date: "asc" },
      include: {
        players: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(games);
  } catch (e) {
    console.error("Erro ao listar jogos:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
