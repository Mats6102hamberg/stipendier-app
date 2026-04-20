/**
 * setupVectors.ts
 * Aktiverar pgvector på Neon och skapar nödvändiga kolumner/tabeller/index.
 * Kör EN GÅNG: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/setupVectors.ts
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function main() {
  console.log("⚙️  Aktiverar pgvector...");

  // 1. Aktivera extension
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  console.log("✓ vector extension aktiv");

  // 2. Lägg till embedding-kolumn på Stipendium (1536 dim = text-embedding-3-small)
  await sql`
    ALTER TABLE "Stipendium"
    ADD COLUMN IF NOT EXISTS embedding vector(1536)
  `;
  console.log("✓ Stipendium.embedding kolumn skapad");

  // 3. Skapa QueryCache-tabell
  await sql`
    CREATE TABLE IF NOT EXISTS "QueryCache" (
      id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      query_hash  TEXT NOT NULL UNIQUE,
      query_text  TEXT NOT NULL,
      embedding   vector(1536) NOT NULL,
      response    TEXT NOT NULL,
      match_ids   TEXT[] NOT NULL DEFAULT '{}',
      hit_count   INTEGER NOT NULL DEFAULT 0,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log("✓ QueryCache tabell skapad");

  // 4. IVFFlat-index för snabb cosine similarity (kräver minst 100 rader för att vara effektivt)
  await sql`
    CREATE INDEX IF NOT EXISTS stipendium_embedding_idx
    ON "Stipendium" USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 10)
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS querycache_embedding_idx
    ON "QueryCache" USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 10)
  `;
  console.log("✓ IVFFlat-index skapade");

  console.log("\n✅ pgvector setup klar!");
}

main().catch((e) => { console.error(e); process.exit(1); });
