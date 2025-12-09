import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  try {
    const user = await verifyToken();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Acesso negado" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      include: {
        stats: true, // caso tenha
      },
    });

    return NextResponse.json(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        paymentType: u.paymentType,
        wins: u.stats?.wins ?? 0,
        losses: u.stats?.losses ?? 0,
        titles: u.stats?.titles ?? 0,
        level: u.stats?.level ?? 1,
      }))
    );
  } catch (err) {
    console.error("ERRO USERS:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
