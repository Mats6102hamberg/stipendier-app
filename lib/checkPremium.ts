import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function checkPremium(req: NextRequest): Promise<boolean> {
  const token = req.headers.get("x-premium-token");
  if (!token) return false;

  const subscriber = await prisma.subscriber.findUnique({
    where: { accessToken: token },
    select: { status: true, currentPeriodEnd: true },
  });

  return (
    !!subscriber &&
    subscriber.status === "active" &&
    !!subscriber.currentPeriodEnd &&
    subscriber.currentPeriodEnd > new Date()
  );
}

export function premiumResponse() {
  return Response.json(
    { error: "Premium krävs. Uppgradera på /premium." },
    { status: 402 }
  );
}
