import bcrypt from "bcryptjs";
import prisma from "@/infrastructure/db/prisma";
import { HttpError } from "@/shared/http";
import {
  signToken,
  setTokenCookie,
  clearTokenCookie,
  verifyToken,
} from "@/infrastructure/auth/jwt";

export async function login(email: string, password: string) {
  if (!email || !password) {
    throw new HttpError(400, "Preencha todos os campos");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { stats: true },
  });

  if (!user) {
    throw new HttpError(404, "Usuário não encontrado");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new HttpError(401, "Senha incorreta");
  }

  const token = await signToken({ id: user.id, role: user.role });
  await setTokenCookie(token);

  return { id: user.id, role: user.role, name: user.name };
}

export async function logout() {
  await clearTokenCookie();
}

export async function getCurrentUser() {
  const token = await verifyToken();
  if (!token) return null;

  const user = await prisma.user.findUnique({
    where: { id: token.id },
    select: { id: true, name: true, email: true, role: true, paymentType: true },
  });

  if (!user) throw new HttpError(404, "Usuário não encontrado");
  return user;
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
  paymentType?: string;
  level?: number;
}) {
  const { name, email, password, paymentType, level } = input;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    throw new HttpError(400, "Email já cadastrado");
  }

  const hashed = await bcrypt.hash(password, 10);
  const resolvedLevel =
    typeof level === "number" && level >= 1 && level <= 6 ? level : 1;

  return prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "player",
      level: resolvedLevel,
      paymentType: paymentType === "daily" ? "daily" : "monthly",
      stats: { create: { level: resolvedLevel } },
    },
  });
}
