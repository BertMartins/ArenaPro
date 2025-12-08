import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // rotas públicas
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  // valida token
  const user = await verifyToken(); // ← AQUI é o conserto

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // player tentando acessar área admin
  if (pathname.startsWith("/dashboard") && user.role !== "admin") {
    return NextResponse.redirect(new URL("/player", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/player/:path*", "/api/:path*"],
};
