import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_PER_IP = 1;

function getIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

async function hämtaStipendier(land: string) {
  return prisma.stipendium.findMany({
    where: { aktiv: true, land, OR: [{ deadline: null }, { deadline: { gte: new Date() } }] },
    select: {
      id: true, namn: true, organisation: true, beskrivning: true,
      belopp: true, beloppMax: true, deadline: true,
      kategorier: true, målgrupp: true,
    },
    orderBy: { deadline: "asc" },
    take: 30,
  });
}

function formateraKort(stipendier: Awaited<ReturnType<typeof hämtaStipendier>>) {
  return stipendier.map((s) => (
    `ID: ${s.id}\nNamn: ${s.namn}\nOrganisation: ${s.organisation}\nBeskrivning: ${s.beskrivning}\nKategorier: ${s.kategorier.join(", ")}\nMålgrupp: ${s.målgrupp.join(", ")}`
  )).join("\n\n---\n\n");
}

const TEASER_SYSTEM = `Du är en varm, proaktiv stipendierådgivare för svenska studenter. Användaren får EN gratis fråga som smakprov.

## Så svarar du
1. Ge ett konkret, hjälpsamt svar på användarens fråga.
2. Föreslå 2–3 relevanta stipendier från listan nedan — förklara kort varför.
3. Avsluta ALLTID med raden: "Vill du ställa fler frågor? Uppgradera till Premium för obegränsade AI-svar →"

## Format för stipendieträffar
Inkludera detta JSON-block sist:
\`\`\`json
{"matches": [{"id": "...", "namn": "...", "organisation": "...", "anledning": "Varför de passer"}]}
\`\`\`

Svara alltid på svenska. Håll det kompakt — max 2 stycken + stipendielista.`;

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const sedan = new Date(Date.now() - WINDOW_MS);

  const count = await prisma.aiUsage.count({
    where: { subscriberId: `ip:${ip}`, endpoint: "ai/chat-teaser", createdAt: { gte: sedan } },
  });
  if (count >= MAX_PER_IP) {
    return Response.json(
      { error: "Teaser-kvoten är slut. Uppgradera till Premium för obegränsade frågor." },
      { status: 402 },
    );
  }

  await prisma.aiUsage.create({
    data: { subscriberId: `ip:${ip}`, endpoint: "ai/chat-teaser" },
  });

  const { messages, land = "SE" } = await req.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Inget meddelande" }, { status: 400 });
  }

  const stipendier = await hämtaStipendier(land);
  const systemPrompt = `${TEASER_SYSTEM}\n\n## Tillgängliga stipendier\n\n${formateraKort(stipendier)}`;

  const stream = claude.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Mode": "teaser",
    },
  });
}
