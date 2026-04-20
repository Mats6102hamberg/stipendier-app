import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email, ämne, nivå, intressen } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Ogiltig e-post" }, { status: 400 });
  }

  await prisma.newsletter.upsert({
    where: { email },
    update: { ämne: ämne ?? null, nivå: nivå ?? null, intressen: intressen ?? null, aktiv: true },
    create: { email, ämne: ämne ?? null, nivå: nivå ?? null, intressen: intressen ?? null },
  });

  return Response.json({ ok: true });
}
