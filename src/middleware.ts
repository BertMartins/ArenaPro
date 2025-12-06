import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: any) {
  const token = req.cookies.get("volei_token")?.value;

  const url = req.nextUrl.pathname;

  // 🔓 Rotas públicas
  if (
    url.startsWith("/login") ||
    url.startsWith("/register") ||
    url.startsWith("/forgot-password") ||
    url.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);

    // 🔥 Proteção de rotas ADMIN
    if (url.startsWith("/dashboard") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/player", req.url));
    }

    // 🔥 Proteção de rota PLAYER
    if (url.startsWith("/player") && payload.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.log("Invalid Token:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/player/:path*",
  ],
};
