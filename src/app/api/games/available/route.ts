import { NextResponse } from "next/server";
import { listAvailableGames } from "@/application/games/gamesService";

// =============================================
// GET → Listar jogos disponíveis (exclui finalizados)
// =============================================
export async function GET() {
  try {
    const games = await listAvailableGames();
    return NextResponse.json(games);
  } catch (err) {
    console.error("Erro ao listar jogos disponíveis:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
