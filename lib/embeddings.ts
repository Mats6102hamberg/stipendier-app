import OpenAI from "openai";
import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

// Lazy — skapas inte förrän embedText anropas (undviker build-fel utan API-nyckel)
let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

function getSql() {
  return neon(process.env.DATABASE_URL!);
}

// ── Embed text med text-embedding-3-small ────────────────────────────────────
export async function embedText(text: string): Promise<number[]> {
  const res = await getOpenAI().embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000), // max safe input
  });
  return res.data[0].embedding;
}

// ── Hitta top-K stipendier via cosine similarity ─────────────────────────────
export async function findSimilarStipendier(
  embedding: number[],
  limit = 10
): Promise<string[]> {
  const sql = getSql();
  const vec = `[${embedding.join(",")}]`;

  const rows = await sql`
    SELECT id, 1 - (embedding <=> ${vec}::vector) AS similarity
    FROM "Stipendium"
    WHERE aktiv = true AND embedding IS NOT NULL
    ORDER BY embedding <=> ${vec}::vector
    LIMIT ${limit}
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rows.map((r: any) => r.id as string);
}

// ── Kolla query-cache (returnerar svar om likhet > threshold) ────────────────
export async function findCachedResponse(
  embedding: number[],
  threshold = 0.92
): Promise<{ response: string; matchIds: string[]; id: string } | null> {
  const sql = getSql();
  const vec = `[${embedding.join(",")}]`;

  const rows = await sql`
    SELECT id, response, match_ids,
           1 - (embedding <=> ${vec}::vector) AS similarity
    FROM "QueryCache"
    WHERE 1 - (embedding <=> ${vec}::vector) > ${threshold}
    ORDER BY embedding <=> ${vec}::vector
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  // Räkna upp hit_count
  await sql`
    UPDATE "QueryCache"
    SET hit_count = hit_count + 1, updated_at = NOW()
    WHERE id = ${rows[0].id}
  `;

  return {
    id: rows[0].id,
    response: rows[0].response,
    matchIds: rows[0].match_ids,
  };
}

// ── Spara ett nytt svar i cache ───────────────────────────────────────────────
export async function cacheResponse(
  queryText: string,
  embedding: number[],
  response: string,
  matchIds: string[]
): Promise<void> {
  const sql = getSql();
  const vec = `[${embedding.join(",")}]`;
  const hash = crypto.createHash("sha256").update(queryText).digest("hex");

  await sql`
    INSERT INTO "QueryCache" (id, query_hash, query_text, embedding, response, match_ids)
    VALUES (
      gen_random_uuid()::text,
      ${hash},
      ${queryText},
      ${vec}::vector,
      ${response},
      ${matchIds}
    )
    ON CONFLICT (query_hash) DO UPDATE
    SET response = EXCLUDED.response,
        match_ids = EXCLUDED.match_ids,
        updated_at = NOW()
  `;
}

// ── Spara embedding för ett stipendium ───────────────────────────────────────
export async function sparaStipendiumEmbedding(
  id: string,
  embedding: number[]
): Promise<void> {
  const sql = getSql();
  const vec = `[${embedding.join(",")}]`;
  await sql`
    UPDATE "Stipendium" SET embedding = ${vec}::vector WHERE id = ${id}
  `;
}
