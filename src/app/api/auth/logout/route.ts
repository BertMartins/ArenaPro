import { NextResponse } from "next/server";
import { logout } from "@/application/auth/authService";

export async function POST() {
  await logout();
  return NextResponse.json({ ok: true });
}
