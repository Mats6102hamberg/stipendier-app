import { NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();
  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    return Response.json({ error: "Ogiltig session" }, { status: 400 });
  }

  const stripe = getStripe();
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    console.error("[auth/claim] Stripe session retrieval failed", err);
    return Response.json({ error: "Session hittades inte" }, { status: 404 });
  }

  if (session.payment_status !== "paid" && session.status !== "complete") {
    return Response.json({ error: "Betalning ej slutförd" }, { status: 402 });
  }

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (!customerId) {
    return Response.json({ error: "Ingen kund kopplad" }, { status: 404 });
  }

  const subscriber = await prisma.subscriber.findFirst({
    where: { stripeCustomerId: customerId },
    select: { accessToken: true, email: true },
  });
  if (!subscriber) {
    return Response.json({ error: "Prenumerant saknas" }, { status: 404 });
  }

  return Response.json({ token: subscriber.accessToken, email: subscriber.email });
}
