import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { embedText, findSimilarStipendier } from "@/lib/embeddings";

export async function POST(req: NextRequest) {
  const { profilText } = await req.json();
  if (!profilText?.trim()) return Response.json([]);

  const nu = new Date();

  // Vector search om OpenAI-nyckel finns
  if (process.env.OPENAI_API_KEY) {
    try {
      const embedding = await embedText(profilText);
      const ids = await findSimilarStipendier(embedding, 5);
      if (ids.length > 0) {
        const stipendier = await prisma.stipendium.findMany({
          where: { id: { in: ids }, aktiv: true, OR: [{ deadline: null }, { deadline: { gte: nu } }] },
          select: { id: true, namn: true, organisation: true, beskrivning: true, belopp: true, beloppMax: true, deadline: true, kategorier: true, målgrupp: true, url: true },
        });
        return Response.json(stipendier);
      }
    } catch (err) {
      console.error("[matchning] vector search failed, using text fallback", err);
    }
  }

  // Fallback: textmatchning på ämne/intressen
  const ord = profilText.split(/\s+/).filter((o: string) => o.length > 3).slice(0, 5);
  const stipendier = await prisma.stipendium.findMany({
    where: {
      aktiv: true,
      OR: [{ deadline: null }, { deadline: { gte: nu } }],
      ...(ord.length > 0 && {
        OR: ord.map((o: string) => ({
          OR: [
            { namn: { contains: o, mode: "insensitive" as const } },
            { beskrivning: { contains: o, mode: "insensitive" as const } },
          ],
        })),
      }),
    },
    select: { id: true, namn: true, organisation: true, beskrivning: true, belopp: true, beloppMax: true, deadline: true, kategorier: true, målgrupp: true, url: true },
    take: 5,
  });

  return Response.json(stipendier);
}
