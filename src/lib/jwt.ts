import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret-key");

export interface AuthToken extends JWTPayload {
  id: string;
  role: string;
  paymentType?: "monthly" | "daily";
}

// ==========================================
// 🔥 GERAR TOKEN
// ==========================================
export async function signToken(payload: AuthToken) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

// ==========================================
// 🔥 VALIDAR TOKEN
// ==========================================
export async function verifyToken(): Promise<AuthToken | null> {
  try {
    const cookieStore = await cookies(); // <-- AGORA COM await !!!
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, SECRET);
    return payload as AuthToken;
  } catch (err) {
    return null;
  }
}

// ==========================================
// 🔥 LIMPAR TOKEN 
// ==========================================
export async function clearToken() {
  const cookieStore = await cookies();
  cookieStore.set("token", "", { expires: new Date(0) });
}
