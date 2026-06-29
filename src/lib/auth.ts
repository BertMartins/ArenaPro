import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface AuthUser {
  id: string;
  role: "admin" | "player" | "visitor";
  name: string;
  email: string;
  paymentType?: "monthly" | "daily";
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);

    // 👇 Correção do TypeScript (payload → unknown → AuthUser)
    return payload as unknown as AuthUser;

  } catch (err) {
    console.error("Token inválido:", err);
    return null;
  }
}
