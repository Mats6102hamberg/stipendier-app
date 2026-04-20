import { NextRequest } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!); }

export async function POST(req: NextRequest) {
  const { email, plan } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Ogiltig e-post" }, { status: 400 });
  }

  const stripe = getStripe();
  const priceId = plan === "yearly"
    ? process.env.STRIPE_PRICE_ID_YEARLY!
    : process.env.STRIPE_PRICE_ID_MONTHLY!;

  // Hämta eller skapa subscriber (atomiskt — undviker dubletter vid samtidiga anrop)
  let subscriber = await prisma.subscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  // Hämta eller skapa Stripe-kund. updateMany med WHERE stripeCustomerId IS NULL
  // gör att endast en samtidig körning faktiskt skriver — den andra ser att raden
  // redan har ett customerId och återanvänder det.
  if (!subscriber.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email,
      metadata: { subscriberId: subscriber.id },
    });
    const result = await prisma.subscriber.updateMany({
      where: { id: subscriber.id, stripeCustomerId: null },
      data: { stripeCustomerId: customer.id },
    });
    if (result.count === 0) {
      // En annan request hann före — städa upp den kund vi råkade skapa
      await stripe.customers.del(customer.id).catch((err) => {
        console.error("[checkout] kunde inte radera dubbel Stripe-kund", err);
      });
      subscriber = (await prisma.subscriber.findUnique({ where: { id: subscriber.id } }))!;
    } else {
      subscriber.stripeCustomerId = customer.id;
    }
  }
  const customerId = subscriber.stripeCustomerId!;

  const origin = req.headers.get("origin") ?? "https://stipendier-app.vercel.app";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/premium`,
    metadata: { subscriberId: subscriber.id },
  });

  return Response.json({ url: session.url });
}
