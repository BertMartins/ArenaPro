import { NextResponse } from "next/server";
import { requireAuth, jsonError, jsonFromError } from "@/shared/http";
import { createGame, listGames, type CreateGameInput } from "@/application/games/gamesService";

// =============================================
// POST → Criar jogo
// =============================================
export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;
  if (auth.role !== "admin") return jsonError("Acesso negado", 403);

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
    }

    const payload: CreateGameInput = {
      date: body.date,
      maxPlayers: Number(body.maxPlayers),
      teamSize: Number(body.teamSize),
      pointsPerMatch: Number(body.pointsPerMatch),
      twoWinsRule: Boolean(body.twoWinsRule),
      type: body.type ?? "monthly_priority",
      paymentWindowStart: body.paymentWindowStart ?? "12:00",
      paymentDeadlineMinutes: Number(body.paymentDeadlineMinutes ?? 60),
      arenaName: body.arenaName?.trim() || undefined,
      arenaLocation: body.arenaLocation?.trim() || undefined,
      startTime: body.startTime?.trim() || undefined,
      endTime: body.endTime?.trim() || undefined,
    };

    const created = await createGame(payload, auth.id);
    return NextResponse.json({ ok: true, game: created }, { status: 201 });
  } catch (err) {
    return jsonFromError(err, "Erro ao criar jogo");
  }
}

// =============================================
// GET → Listar jogos (reconcilia os abertos antes)
// =============================================
export async function GET() {
  try {
    const games = await listGames();
    return NextResponse.json(games);
  } catch (err) {
    console.error("Erro ao listar jogos:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
