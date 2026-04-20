import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { rateLimitPremium, rateLimitErrorResponse } from "@/lib/rateLimit";
import {
  embedText,
  findSimilarStipendier,
  findCachedResponse,
  cacheResponse,
} from "@/lib/embeddings";

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Router: avgör om vi kan använda cache/RAG eller behöver full kontext ──────
async function router(userMessage: string): Promise<
  | { typ: "cache"; response: string; matchIds: string[] }
  | { typ: "rag"; ids: string[]; embedding: number[] }
  | { typ: "full" }
> {
  // RAG kräver OPENAI_API_KEY
  if (!process.env.OPENAI_API_KEY) return { typ: "full" };

  let embedding: number[];
  try {
    embedding = await embedText(userMessage);
  } catch {
    return { typ: "full" };
  }

  // 1. Kolla query-cache (likhet > 92% → exakt samma typ av fråga)
  const cached = await findCachedResponse(embedding, 0.92);
  if (cached) {
    return { typ: "cache", response: cached.response, matchIds: cached.matchIds };
  }

  // 2. Vector search — hitta top-10 relevanta stipendier
  const ids = await findSimilarStipendier(embedding, 10);
  if (ids.length > 0) {
    return { typ: "rag", ids, embedding };
  }

  return { typ: "full" };
}

// ── Hämta stipendier (antingen specifika IDs eller alla) ──────────────────────
async function hämtaStipendier(ids?: string[], land = "SE") {
  if (ids && ids.length > 0) {
    return prisma.stipendium.findMany({
      where: { id: { in: ids }, aktiv: true, land },
      select: {
        id: true, namn: true, organisation: true, beskrivning: true,
        belopp: true, beloppMax: true, deadline: true,
        kategorier: true, målgrupp: true, url: true,
      },
    });
  }
  return prisma.stipendium.findMany({
    where: { aktiv: true, land },
    select: {
      id: true, namn: true, organisation: true, beskrivning: true,
      belopp: true, beloppMax: true, deadline: true,
      kategorier: true, målgrupp: true, url: true,
    },
    orderBy: { deadline: "asc" },
    take: 60,
  });
}

function formateraStipendier(stipendier: Awaited<ReturnType<typeof hämtaStipendier>>) {
  const nu = new Date();
  return stipendier.map((s) => {
    const dagKvar = s.deadline
      ? Math.ceil((new Date(s.deadline).getTime() - nu.getTime()) / 86400000)
      : null;
    return [
      `ID: ${s.id}`,
      `Namn: ${s.namn}`,
      `Organisation: ${s.organisation}`,
      `Beskrivning: ${s.beskrivning}`,
      `Belopp: ${s.belopp ? s.belopp.toLocaleString("sv-SE") + " kr" : "ej angivet"}${s.beloppMax ? ` – ${s.beloppMax.toLocaleString("sv-SE")} kr` : ""}`,
      `Deadline: ${s.deadline
        ? new Date(s.deadline).toLocaleDateString("sv-SE") +
          (dagKvar !== null && dagKvar < 0 ? " (UTGÅNGEN)" : dagKvar !== null ? ` (${dagKvar} dagar kvar)` : "")
        : "ingen deadline"
      }`,
      `Kategorier: ${s.kategorier.join(", ")}`,
      `Målgrupp: ${s.målgrupp.join(", ")}`,
    ].join("\n");
  }).join("\n\n---\n\n");
}

const SYSTEM_SE = `Du är en varm, driven och proaktiv stipendierådgivare för svenska studenter och forskare. Din uppgift är att hjälpa användaren hitta stipendier som passar just dem — och bygga upp deras självförtroende kring att söka.

Många tror att stipendier inte är för dem. Din roll är att motbevisa det konkret.

## Hur du arbetar
1. **Förstå användaren** — ställ 2–3 kärnfrågor om du saknar info: Vad studerar/forskar de? Bakgrund? Mål?
2. **Matcha proaktivt** — presentera 3–5 stipendier, förklara VARFÖR de är kvalificerade.
3. **Uppmuntra** — påpeka detaljer som talar för dem.
4. **Hjälp skriva** — om de ber om ansökningstext, skriv ett konkret utkast.

## Format för stipendieträffar
Inkludera alltid detta JSON-block sist i svaret:
\`\`\`json
{"matches": [{"id": "...", "namn": "...", "organisation": "...", "anledning": "Varför de passar"}]}
\`\`\`

## Regler
- Svara alltid på svenska
- Visa aldrig utgångna stipendier som primärt alternativ
- Håll svaren kompakta — max 3 stycken + stipendielista`;

const SYSTEM_NO = `Du er en varm, engasjert og proaktiv stipendrådgiver for norske studenter og forskere. Din oppgave er å hjelpe brukeren å finne stipender som passer akkurat dem — og bygge opp selvtilliten deres rundt det å søke.

Mange tror at stipender ikke er for dem. Din rolle er å motbevise det konkret.

## Slik jobber du
1. **Forstå brukeren** — still 2–3 kjernespørsmål hvis du mangler info: Hva studerer/forsker de? Bakgrunn? Mål?
2. **Match proaktivt** — presenter 3–5 stipender, forklar HVORFOR de er kvalifiserte.
3. **Oppmuntre** — fremhev detaljer som taler for dem.
4. **Hjelp med å skrive** — hvis de ber om søknadstekst, skriv et konkret utkast.

## Format for stipendtreff
Inkluder alltid denne JSON-blokken sist i svaret:
\`\`\`json
{"matches": [{"id": "...", "namn": "...", "organisation": "...", "anledning": "Hvorfor de passer"}]}
\`\`\`

## Regler
- Svar alltid på norsk (bokmål)
- Vis aldri utgåtte stipender som primært alternativ
- Hold svarene kompakte — maks 3 avsnitt + stipendliste`;

const SYSTEM_DK = `Du er en varm, engageret og proaktiv stipendierådgiver for danske studerende og forskere. Din opgave er at hjælpe brugeren med at finde stipendier der passer præcis til dem — og styrke deres selvtillid til at ansøge.

## Sådan arbejder du
1. **Forstå brugeren** — stil 2–3 kernespørgsmål hvis du mangler info: Hvad studerer/forsker de? Baggrund? Mål?
2. **Match proaktivt** — præsenter 3–5 stipendier, forklar HVORFOR de er kvalificerede.
3. **Opmutre** — fremhæv detaljer der taler for dem.
4. **Hjælp med at skrive** — hvis de beder om ansøgningstekst, skriv et konkret udkast.

## Format for stipendiematches
Inkluder altid denne JSON-blok sidst i svaret:
\`\`\`json
{"matches": [{"id": "...", "namn": "...", "organisation": "...", "anledning": "Hvorfor de passer"}]}
\`\`\`

## Regler
- Svar altid på dansk
- Vis aldrig udløbne stipendier som primært alternativ
- Hold svarene kompakte — maks 3 afsnit + stipendieliste`;

const SYSTEM_DE = `Du bist ein engagierter, proaktiver Stipendienberater für deutsche Studierende und Forschende. Deine Aufgabe ist es, den Nutzern zu helfen, die passenden Stipendien zu finden — und ihnen Selbstvertrauen beim Bewerben zu geben.

## So arbeitest du
1. **Verstehe den Nutzer** — stelle 2–3 Kernfragen wenn Infos fehlen: Was studieren/forschen sie? Hintergrund? Ziele?
2. **Proaktives Matching** — präsentiere 3–5 Stipendien, erkläre WARUM sie qualifiziert sind.
3. **Ermutigung** — betone Details die für sie sprechen.
4. **Beim Schreiben helfen** — wenn sie nach Bewerbungstext fragen, schreibe einen konkreten Entwurf.

## Format für Stipendientreffer
Füge am Ende der Antwort immer diesen JSON-Block ein:
\`\`\`json
{"matches": [{"id": "...", "namn": "...", "organisation": "...", "anledning": "Warum sie passen"}]}
\`\`\`

## Regeln
- Antworte immer auf Deutsch
- Zeige niemals abgelaufene Stipendien als primäre Option
- Halte Antworten kompakt — maximal 3 Absätze + Stipendienliste`;

const SYSTEM_GB = `You are a warm, driven and proactive scholarship advisor for UK students and researchers. Your goal is to help users find scholarships that fit them perfectly — and build their confidence to apply.

## How you work
1. **Understand the user** — ask 2–3 key questions if info is missing: What do they study/research? Background? Goals?
2. **Proactive matching** — present 3–5 scholarships, explain WHY they are qualified.
3. **Encourage** — highlight details that speak in their favour.
4. **Help write** — if they ask for application text, write a concrete draft.

## Format for scholarship matches
Always include this JSON block at the end of your response:
\`\`\`json
{"matches": [{"id": "...", "namn": "...", "organisation": "...", "anledning": "Why they fit"}]}
\`\`\`

## Rules
- Always respond in English
- Never show expired scholarships as primary options
- Keep responses concise — max 3 paragraphs + scholarship list`;

const SYSTEM_FI = `Olet lämmin, innostunut ja proaktiivinen apurahaneuvoja suomalaisille opiskelijoille ja tutkijoille. Tehtäväsi on auttaa käyttäjää löytämään juuri heille sopivat apurahat — ja rakentaa heidän itseluottamustaan hakemiseen.

## Näin työskentelet
1. **Ymmärrä käyttäjä** — kysy 2–3 ydinkysymystä jos tiedot puuttuvat: Mitä he opiskelevat/tutkivat? Tausta? Tavoitteet?
2. **Proaktiivinen matchaus** — esitä 3–5 apurahaa, selitä MIKSI he ovat päteviä.
3. **Rohkaise** — korosta heidän puolestaan puhuvia yksityiskohtia.
4. **Auta kirjoittamaan** — jos he pyytävät hakemustekstiä, kirjoita konkreettinen luonnos.

## Apurahaosumataulukko
Sisällytä aina tämä JSON-lohko vastauksen loppuun:
\`\`\`json
{"matches": [{"id": "...", "namn": "...", "organisation": "...", "anledning": "Miksi he sopivat"}]}
\`\`\`

## Säännöt
- Vastaa aina suomeksi
- Älä koskaan näytä vanhentuneita apurahoja ensisijaisena vaihtoehtona
- Pidä vastaukset tiiviinä — enintään 3 kappaletta + apurahalistaus`;

function getSystemBase(land: string) {
  if (land === "NO") return SYSTEM_NO;
  if (land === "DK") return SYSTEM_DK;
  if (land === "FI") return SYSTEM_FI;
  if (land === "DE") return SYSTEM_DE;
  if (land === "GB") return SYSTEM_GB;
  return SYSTEM_SE;
}

export async function POST(req: NextRequest) {
  const rl = await rateLimitPremium(req, { endpoint: "ai/chat", max: 30 });
  if (!rl.ok) return rateLimitErrorResponse(rl);
  const { messages, land = "SE" } = await req.json();
  const userMessage: string = messages.at(-1)?.content ?? "";

  // ── Router: cache → RAG → full ────────────────────────────────────────────
  const beslut = await router(userMessage);

  // Cache-träff → strömma direkt utan att anropa Claude
  if (beslut.typ === "cache") {
    const encoder = new TextEncoder();
    const cached = beslut.response;
    const readable = new ReadableStream({
      start(controller) {
        // Strömma i bitar för naturlig känsla
        const bitar = cached.match(/.{1,40}/g) ?? [cached];
        let i = 0;
        const interval = setInterval(() => {
          if (i >= bitar.length) { clearInterval(interval); controller.close(); return; }
          controller.enqueue(encoder.encode(bitar[i++]));
        }, 15);
      },
    });
    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Cache": "HIT",
      },
    });
  }

  // Hämta stipendier (RAG: top-10, full: alla)
  const ids = beslut.typ === "rag" ? beslut.ids : undefined;
  const stipendier = await hämtaStipendier(ids, land);
  const stipendierText = formateraStipendier(stipendier);

  const ragNotering = beslut.typ === "rag"
    ? `\n\n[RAG: ${stipendier.length} av ${ids?.length} relevanta stipendier presenterade]`
    : "";

  const systemPrompt = `${getSystemBase(land)}${ragNotering}\n\n## Tillgängliga stipendier\n\n${stipendierText}`;

  // ── Strömma Claude-svar ───────────────────────────────────────────────────
  const stream = claude.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  let fullSvar = "";

  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          fullSvar += event.delta.text;
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();

      // Spara i cache om RAG (embedding finns)
      if (beslut.typ === "rag" && fullSvar.length > 50) {
        const matchIds = stipendier.map((s) => s.id);
        cacheResponse(userMessage, beslut.embedding, fullSvar, matchIds).catch((err) => {
          console.error("[ai/chat] cacheResponse failed", err);
        });
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Cache": "MISS",
      "X-Mode": beslut.typ,
    },
  });
}
