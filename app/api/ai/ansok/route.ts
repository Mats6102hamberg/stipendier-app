import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { rateLimitPremium, rateLimitErrorResponse } from "@/lib/rateLimit";

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const rl = await rateLimitPremium(req, { endpoint: "ai/ansok", max: 10 });
  if (!rl.ok) return rateLimitErrorResponse(rl);
  const { stipendiumId, profilText, extra } = await req.json();

  const s = await prisma.stipendium.findUnique({
    where: { id: stipendiumId },
    select: { namn: true, organisation: true, beskrivning: true, kategorier: true, målgrupp: true, deadline: true, belopp: true },
  });

  if (!s) return new Response("Stipendium hittades inte", { status: 404 });

  const deadlineStr = s.deadline
    ? new Date(s.deadline).toLocaleDateString("sv-SE")
    : "ingen angiven deadline";

  const systemPrompt = `Du är en expert på att skriva övertygande stipendieansökningar på svenska.
Skriv ett personligt, engagerande och konkret ansökningsbrev (350–500 ord) som verkligen lyfter fram sökanden.
Undvik klichéer. Var specifik. Knyt ihop sökandens bakgrund med stipendiets syfte.`;

  const userPrompt = `Skriv ett ansökningsbrev för följande stipendium:

STIPENDIUM
Namn: ${s.namn}
Organisation: ${s.organisation}
Beskrivning: ${s.beskrivning}
Kategorier: ${s.kategorier.join(", ")}
Målgrupp: ${s.målgrupp.join(", ")}
Belopp: ${s.belopp ? s.belopp.toLocaleString("sv-SE") + " kr" : "ej angivet"}
Deadline: ${deadlineStr}

SÖKANDEN
${profilText || "Ingen profilinformation angiven"}
${extra ? `\nExtra att lyfta fram: ${extra}` : ""}

Skriv brevet riktat till ${s.organisation}. Börja med en stark inledning, motivera varför sökanden passar, koppla till stipendiets syfte, och avsluta med en tydlig begäran.`;

  const stream = claude.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1200,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
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
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
