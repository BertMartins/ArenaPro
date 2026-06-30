import { NextRequest, NextResponse } from "next/server";
import { reconcileAllOpenGames } from "@/lib/gameReconcile";

// Rede de segurança diária (Vercel Hobby só permite cron 1x/dia).
// A reconciliação "de verdade" acontece a cada leitura/escrita das rotas de
// jogo — este cron só cobre jogos que ninguém abriu no dia.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const count = await reconcileAllOpenGames();
  return NextResponse.json({ ok: true, reconciled: count });
}
