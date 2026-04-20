import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, stipendiumId } = await req.json();

  if (!email || !email.includes("@") || !stipendiumId) {
    return NextResponse.json({ error: "Ogiltiga uppgifter" }, { status: 400 });
  }

  const stipendium = await prisma.stipendium.findUnique({
    where: { id: stipendiumId, aktiv: true },
    select: { id: true, deadline: true },
  });

  if (!stipendium) {
    return NextResponse.json({ error: "Stipendium hittades inte" }, { status: 404 });
  }

  await prisma.bevakning.upsert({
    where: { email_stipendiumId: { email, stipendiumId } },
    update: { skickad: false },
    create: { email, stipendiumId },
  });

  return NextResponse.json({ ok: true });
}
