import prisma from "@/infrastructure/db/prisma";
import { HttpError } from "@/shared/http";

export async function listUsers() {
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    include: { stats: true },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    paymentType: u.paymentType,
    wins: u.stats?.wins ?? 0,
    losses: u.stats?.losses ?? 0,
    titles: u.stats?.titles ?? 0,
    level: u.stats?.level ?? 1,
  }));
}

export async function updateUserLevel(userId: string, level: number) {
  return prisma.userStats.upsert({
    where: { userId },
    update: { level: Number(level) },
    create: { userId, level: Number(level) },
  });
}

export async function togglePaymentType(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, "Usuário não encontrado");

  const newType = user.paymentType === "monthly" ? "daily" : "monthly";
  await prisma.user.update({ where: { id: userId }, data: { paymentType: newType } });

  return newType;
}

export async function toggleRole(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, "Usuário não encontrado");

  const newRole = user.role === "admin" ? "player" : "admin";
  await prisma.user.update({ where: { id: userId }, data: { role: newRole } });

  return newRole;
}
