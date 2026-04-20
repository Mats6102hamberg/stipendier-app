import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export type RateLimitResult =
  | { ok: true; subscriberId: string }
  | { ok: false; status: number; error: string };

type Options = {
  endpoint: string;
  windowMs?: number;
  max?: number;
};

export async function rateLimitPremium(
  req: NextRequest,
  { endpoint, windowMs = 60_000, max = 20 }: Options,
): Promise<RateLimitResult> {
  const token = req.headers.get("x-premium-token");
  if (!token) return { ok: false, status: 402, error: "Premium krävs. Uppgradera på /premium." };

  const subscriber = await prisma.subscriber.findUnique({
    where: { accessToken: token },
    select: { id: true, status: true, currentPeriodEnd: true },
  });

  const aktiv =
    !!subscriber &&
    subscriber.status === "active" &&
    !!subscriber.currentPeriodEnd &&
    subscriber.currentPeriodEnd > new Date();

  if (!aktiv) return { ok: false, status: 402, error: "Premium krävs. Uppgradera på /premium." };

  const sedan = new Date(Date.now() - windowMs);
  const count = await prisma.aiUsage.count({
    where: { subscriberId: subscriber!.id, endpoint, createdAt: { gte: sedan } },
  });
  if (count >= max) {
    return { ok: false, status: 429, error: "För många förfrågningar. Försök igen om en minut." };
  }

  // fire-and-forget — blockera inte requesten om loggning failar
  prisma.aiUsage
    .create({ data: { subscriberId: subscriber!.id, endpoint } })
    .catch((err) => console.error("[rateLimit] could not log usage", err));

  return { ok: true, subscriberId: subscriber!.id };
}

export function rateLimitErrorResponse(r: Extract<RateLimitResult, { ok: false }>) {
  return Response.json({ error: r.error }, { status: r.status });
}
