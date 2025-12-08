import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const user = await verifyToken();

  // Player não pode acessar /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!user || user.role !== "admin") {
      return NextResponse.redirect(new URL("/player", req.url));
    }
  }

  // Admin não pode acessar /player
  if (pathname.startsWith("/player")) {
    if (!user || user.role !== "player") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}
