import { NextResponse } from "next/server";
import { requireAdmin, jsonFromError } from "@/shared/http";
import { createSession, listSessions } from "@/application/voting/votingService";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const sessions = await listSessions();
    return NextResponse.json(sessions);
  } catch (err) {
    return jsonFromError(err, "Erro ao listar votações");
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const session = await createSession(
      { title: body.title, startAt: body.startAt, endAt: body.endAt },
      auth.id
    );
    return NextResponse.json({ ok: true, session });
  } catch (err) {
    return jsonFromError(err, "Erro ao criar votação");
  }
}
