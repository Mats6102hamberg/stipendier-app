import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimitPremium, rateLimitErrorResponse } from "@/lib/rateLimit";

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const rl = await rateLimitPremium(req, { endpoint: "ai/analys-svar", max: 20 });
  if (!rl.ok) return rateLimitErrorResponse(rl);
  const { text, stipendiumNamn, organisation } = await req.json();

  const prompt = `Analysera detta svar på en stipendieansökan och returnera ENBART ett JSON-objekt.

Stipendium: ${stipendiumNamn} (${organisation})

MOTTAGET SVAR:
${text}

Returnera JSON:
{
  "status": "beviljat" | "avslaget" | "fel_period" | "ej_kvalificerad" | "mer_info" | "oklar",
  "sammanfattning": "<1-2 meningar om vad svaret säger>",
  "nästaSteg": "<konkret råd om vad man ska göra nu>",
  "försökIgen": "<årstal eller period om applicerbart, annars null>",
  "uppmuntran": "<kort positiv mening om lärdom eller möjlighet>"
}

- "beviljat" = ansökan godkänd
- "avslaget" = nekad men inga specifika hinder
- "fel_period" = ansökningsperioden är stängd eller fel tidpunkt
- "ej_kvalificerad" = sökanden uppfyller inte kriterierna
- "mer_info" = de behöver mer information
- "oklar" = oklart vad svaret innebär`;

  const svar = await claude.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const t = svar.content[0].type === "text" ? svar.content[0].text : "{}";
  try {
    const json = JSON.parse(t.replace(/```json?\n?/g, "").replace(/```/g, "").trim());
    return Response.json(json);
  } catch {
    return Response.json({ status: "oklar", sammanfattning: "Kunde inte analysera svaret.", nästaSteg: "Läs igenom svaret manuellt.", försökIgen: null, uppmuntran: "" });
  }
}
