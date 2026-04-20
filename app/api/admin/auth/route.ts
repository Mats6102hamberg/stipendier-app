import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createAdminCookie } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const { lösen } = await req.json();
  const secret = process.env.ADMIN_SECRET;
  if (!secret || typeof lösen !== "string") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const a = Buffer.from(lösen);
  const b = Buffer.from(secret);
  const match = a.length === b.length && timingSafeEqual(a, b);
  if (!match) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_auth", createAdminCookie(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return res;
}
