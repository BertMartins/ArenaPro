import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: any) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("volei_token")?.value;

  const publicRoutes = ["/login", "/register", "/forgot-password"];

  // se rota é pública → segue
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // se não tem token → redireciona
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // tenta verificar o token
  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );

    return NextResponse.next();
  } catch (err) {
    console.error("Erro JWT:", err);

    // remove cookie inválido
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("volei_token", "", { expires: new Date(0), path: "/" });
    return res;
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/player/:path*",
    "/player"
  ]
};

