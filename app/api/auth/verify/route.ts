import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-premium-token");
  if (!token) return Response.json({ premium: false });

  const subscriber = await prisma.subscriber.findUnique({
    where: { accessToken: token },
    select: { status: true, currentPeriodEnd: true, email: true },
  });

  if (!subscriber) return Response.json({ premium: false });

  const aktiv =
    subscriber.status === "active" &&
    subscriber.currentPeriodEnd !== null &&
    subscriber.currentPeriodEnd > new Date();

  return Response.json({ premium: aktiv, email: subscriber.email });
}
