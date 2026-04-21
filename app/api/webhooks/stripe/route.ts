import { NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!); }

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  // Idempotens — Stripe kan retry:a samma event
  try {
    await prisma.processedStripeEvent.create({
      data: { eventId: event.id, type: event.type },
    });
  } catch {
    return Response.json({ received: true, duplicate: true });
  }

  async function uppdateraSubscriber(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;
    const subscriber = await prisma.subscriber.findFirst({
      where: { stripeCustomerId: customerId },
    });
    if (!subscriber) return;

    const aktiv = subscription.status === "active" || subscription.status === "trialing";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodEnd = new Date((subscription as any).current_period_end * 1000);
    const priceId = subscription.items.data[0]?.price.id;
    const plan =
      priceId === process.env.STRIPE_PRICE_ID_YEARLY
        ? "yearly"
        : priceId === process.env.STRIPE_PRICE_ID_QUARTERLY
          ? "quarterly"
          : "monthly";

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        status: aktiv ? "active" : subscription.status,
        currentPeriodEnd: periodEnd,
        plan,
      },
    });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const session = event.data.object as any;
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await uppdateraSubscriber(sub);
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await uppdateraSubscriber(event.data.object as any);
      break;
    }
  }

  return Response.json({ received: true });
}
