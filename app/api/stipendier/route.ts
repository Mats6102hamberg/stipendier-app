import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  if (!ids) return NextResponse.json([]);

  const idList = ids.split(",").slice(0, 50); // max 50
  const stipendier = await prisma.stipendium.findMany({
    where: { id: { in: idList }, aktiv: true },
  });

  return NextResponse.json(stipendier);
}
