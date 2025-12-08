import { NextResponse } from "next/server";
import { clearTokenCookie } from "@/lib/jwt";

export async function POST() {
  await clearTokenCookie();
  return NextResponse.json({ ok: true });
}
