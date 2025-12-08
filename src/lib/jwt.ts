import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export interface AuthToken {
  id: string;
  role: "admin" | "player" | "visitor";
}

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Gera token
export async function signToken(data: AuthToken) {
  return await new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

// Lê token do cookie
export async function verifyToken(): Promise<AuthToken | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);

    return payload as unknown as AuthToken;
  } catch {
    return null;
  }
}

// Salva o token no cookie
export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

// Limpa o token
export async function clearTokenCookie() {
  const cookieStore = await cookies();

  cookieStore.set("token", "", {
    path: "/",
    maxAge: 0,
  });
}
