import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "volei_token";

// SALVAR TOKEN -----------------------------------------------------
export async function setUserToken(token: string) {
  const c = await cookies();

  c.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
}

// LER TOKEN --------------------------------------------------------
export async function getUserFromCookie() {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch {
    return null;
  }
}

// REMOVER TOKEN ----------------------------------------------------
export async function removeUserToken() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}
