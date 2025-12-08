import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export const config = {
  matcher: ["/dashboard/:path*", "/player/:path*"],
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  // Rotas públicas que não exigem login
  const PUBLIC = ["/login", "/register"];

  if (PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Sem token → login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const user = await verifyToken(token);

    // Player não pode ver /dashboard
    if (pathname.startsWith("/dashboard") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/player", req.url));
    }

    // Admin não pode ver /player
    if (pathname.startsWith("/player") && user.role !== "player") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (e) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
