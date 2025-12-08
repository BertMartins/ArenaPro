import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";

export interface AuthToken {
  id: string;
  role: "admin" | "player" | "visitor";
}

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// gerar token
export async function signToken(data: AuthToken) {
  return await new SignJWT(data as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

// ler token do cookie
export async function verifyToken(): Promise<AuthToken | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);

    return {
      id: payload.id as string,
      role: payload.role as AuthToken["role"],
    };
  } catch {
    return null;
  }
}

// salvar token no cookie
export async function setTokenCookie(token: string) {
  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });
}

// limpar cookie
export async function clearTokenCookie() {
  (await cookies()).set("token", "", { maxAge: 0, path: "/" });
}
