import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminCookie } from "@/lib/adminAuth";

async function checkAuth() {
  const cookieStore = await cookies();
  return verifyAdminCookie(cookieStore.get("admin_auth")?.value);
}

export async function POST(req: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const stipendium = await prisma.stipendium.create({
    data: {
      namn: data.namn,
      organisation: data.organisation,
      beskrivning: data.beskrivning,
      belopp: data.belopp ? parseInt(data.belopp) : null,
      beloppMax: data.beloppMax ? parseInt(data.beloppMax) : null,
      deadline: data.deadline ? new Date(data.deadline) : null,
      kategorier: data.kategorier ?? [],
      målgrupp: data.målgrupp ?? [],
      url: data.url || null,
      aktiv: true,
    },
  });
  return NextResponse.json(stipendium);
}

export async function PATCH(req: NextRequest) {
  if (!await checkAuth()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...data } = await req.json();
  const stipendium = await prisma.stipendium.update({
    where: { id },
    data: {
      ...(data.aktiv !== undefined && { aktiv: data.aktiv }),
      ...(data.namn && { namn: data.namn }),
      ...(data.beskrivning && { beskrivning: data.beskrivning }),
      ...(data.belopp !== undefined && { belopp: data.belopp ? parseInt(data.belopp) : null }),
      ...(data.deadline !== undefined && { deadline: data.deadline ? new Date(data.deadline) : null }),
    },
  });
  return NextResponse.json(stipendium);
}
