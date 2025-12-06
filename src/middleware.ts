import { NextRequest, NextResponse } from "next/server";
import { verifyToken, AuthToken } from "@/lib/jwt";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Libera rotas públicas
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // 📌 Pega token do header
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const token = authHeader.replace("Bearer ", "");
  const decoded = verifyToken(token) as AuthToken | null;

  // ❌ Token inválido
  if (!decoded) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔥 Proteção do painel ADMIN
  if (pathname.startsWith("/dashboard") && decoded.role !== "admin") {
    return NextResponse.json(
      { error: "Acesso negado. Apenas admins podem acessar." },
      { status: 403 }
    );
  }

  // 🔥 Proteção do painel PLAYER
  if (pathname.startsWith("/player") && decoded.role !== "player") {
    return NextResponse.json(
      { error: "Apenas jogadores podem acessar." },
      { status: 403 }
    );
  }

  // Token OK → segue viagem
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", // rotas admin
    "/player/:path*", // rotas player
    "/api/:path*", // protege APIs também
  ],
};
