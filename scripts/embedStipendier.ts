/**
 * embedStipendier.ts
 * Beräknar och sparar embeddings för alla stipendier i DB.
 * Kör efter seed eller när nya stipendier lagts till:
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/embedStipendier.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { embedText, sparaStipendiumEmbedding } from "../lib/embeddings";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const stipendier = await prisma.stipendium.findMany({
    where: { aktiv: true },
    select: {
      id: true,
      namn: true,
      organisation: true,
      beskrivning: true,
      kategorier: true,
      målgrupp: true,
    },
  });

  console.log(`📐 Embeddar ${stipendier.length} stipendier...\n`);
  let ok = 0;

  for (const s of stipendier) {
    // Kombinera fält som är relevanta för semantisk sökning
    const text = [
      s.namn,
      s.organisation,
      s.beskrivning,
      `Kategorier: ${s.kategorier.join(", ")}`,
      `Målgrupp: ${s.målgrupp.join(", ")}`,
    ].join(". ");

    try {
      const embedding = await embedText(text);
      await sparaStipendiumEmbedding(s.id, embedding);
      console.log(`  ✓ ${s.namn}`);
      ok++;
      // Rate limit: max 3000 req/min för text-embedding-3-small
      await new Promise((r) => setTimeout(r, 25));
    } catch (e) {
      console.error(`  ✗ ${s.namn}:`, e instanceof Error ? e.message : e);
    }
  }

  console.log(`\n✅ ${ok}/${stipendier.length} stipendier embaddade.`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
