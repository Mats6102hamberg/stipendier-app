/**
 * scrapStipendier.ts
 * Söker av externa stipendiedatabaser (HTML-scraping + Vinnova API),
 * extraherar strukturerad data med Claude och sparar nya stipendier i Neon.
 *
 * Kör: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/scrapStipendier.ts
 */

import "dotenv/config";
import * as cheerio from "cheerio";
import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);
const ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── HTML-källor ────────────────────────────────────────────────────────────
const HTML_KÄLLOR: { url: string; namn: string; typ?: string }[] = [
  // Generella stipendiedatabaser
  { url: "https://www.stipendier.nu", namn: "Stipendier.nu" },
  { url: "https://www.studera.nu/stipendier", namn: "Studera.nu" },
  { url: "https://www.csn.se/bidrag-och-lan/stipendier.html", namn: "CSN stipendier" },
  { url: "https://www.kva.se/sv/stipendier-priser", namn: "Kungliga Vetenskapsakademien" },
  { url: "https://www.vr.se/soka-finansiering.html", namn: "Vetenskapsrådet" },
  { url: "https://www.formas.se/finansiering.html", namn: "Formas" },

  // Utlandsstipendier för svenska studenter
  { url: "https://www.si.se/stipendier-och-bidrag", namn: "Svenska Institutet – utland", typ: "internationell" },
  { url: "https://www.stint.se/stipendier", namn: "STINT – internationalisering" },
  { url: "https://www.utbyten.se/program", namn: "Universitets- och högskolerådet – utbyten" },
  { url: "https://www.fulbright.se/bidrag-stipendier", namn: "Fulbright Sverige" },
  { url: "https://www.swednor.org/stipendier", namn: "Swednor – Norden" },

  // ── Länsstyrelsen – alla 21 län ──────────────────────────────────────────
  { url: "https://www.lansstyrelsen.se/stockholm/stod-och-tillstand/lantbruk-och-landsbygd.html",       namn: "Länsstyrelsen Stockholm",       typ: "regional" },
  { url: "https://www.lansstyrelsen.se/vastmanland/stod-och-tillstand/lantbruk-och-landsbygd.html",     namn: "Länsstyrelsen Västmanland",     typ: "regional" },
  { url: "https://www.lansstyrelsen.se/dalarna/stod-och-tillstand/lantbruk-och-landsbygd.html",         namn: "Länsstyrelsen Dalarna",         typ: "regional" },
  { url: "https://www.lansstyrelsen.se/gavleborg/stod-och-tillstand/lantbruk-och-landsbygd.html",       namn: "Länsstyrelsen Gävleborg",       typ: "regional" },
  { url: "https://www.lansstyrelsen.se/vasternorrland/stod-och-tillstand/lantbruk-och-landsbygd.html",  namn: "Länsstyrelsen Västernorrland",  typ: "regional" },
  { url: "https://www.lansstyrelsen.se/jamtland/stod-och-tillstand/lantbruk-och-landsbygd.html",        namn: "Länsstyrelsen Jämtland",        typ: "regional" },
  { url: "https://www.lansstyrelsen.se/vasterbotten/stod-och-tillstand/lantbruk-och-landsbygd.html",    namn: "Länsstyrelsen Västerbotten",    typ: "regional" },
  { url: "https://www.lansstyrelsen.se/norrbotten/stod-och-tillstand/lantbruk-och-landsbygd.html",      namn: "Länsstyrelsen Norrbotten",      typ: "regional" },
  { url: "https://www.lansstyrelsen.se/uppsala/stod-och-tillstand/lantbruk-och-landsbygd.html",         namn: "Länsstyrelsen Uppsala",         typ: "regional" },
  { url: "https://www.lansstyrelsen.se/sodermanland/stod-och-tillstand/lantbruk-och-landsbygd.html",    namn: "Länsstyrelsen Södermanland",    typ: "regional" },
  { url: "https://www.lansstyrelsen.se/ostergotland/stod-och-tillstand/lantbruk-och-landsbygd.html",    namn: "Länsstyrelsen Östergötland",    typ: "regional" },
  { url: "https://www.lansstyrelsen.se/jonkoping/stod-och-tillstand/lantbruk-och-landsbygd.html",       namn: "Länsstyrelsen Jönköping",       typ: "regional" },
  { url: "https://www.lansstyrelsen.se/kronoberg/stod-och-tillstand/lantbruk-och-landsbygd.html",       namn: "Länsstyrelsen Kronoberg",       typ: "regional" },
  { url: "https://www.lansstyrelsen.se/kalmar/stod-och-tillstand/lantbruk-och-landsbygd.html",          namn: "Länsstyrelsen Kalmar",          typ: "regional" },
  { url: "https://www.lansstyrelsen.se/gotland/stod-och-tillstand/lantbruk-och-landsbygd.html",         namn: "Länsstyrelsen Gotland",         typ: "regional" },
  { url: "https://www.lansstyrelsen.se/blekinge/stod-och-tillstand/lantbruk-och-landsbygd.html",        namn: "Länsstyrelsen Blekinge",        typ: "regional" },
  { url: "https://www.lansstyrelsen.se/skane/stod-och-tillstand/lantbruk-och-landsbygd.html",           namn: "Länsstyrelsen Skåne",           typ: "regional" },
  { url: "https://www.lansstyrelsen.se/halland/stod-och-tillstand/lantbruk-och-landsbygd.html",         namn: "Länsstyrelsen Halland",         typ: "regional" },
  { url: "https://www.lansstyrelsen.se/vastragotaland/stod-och-tillstand/lantbruk-och-landsbygd.html",  namn: "Länsstyrelsen Västra Götaland", typ: "regional" },
  { url: "https://www.lansstyrelsen.se/varmland/stod-och-tillstand/lantbruk-och-landsbygd.html",        namn: "Länsstyrelsen Värmland",        typ: "regional" },
  { url: "https://www.lansstyrelsen.se/orebro/stod-och-tillstand/lantbruk-och-landsbygd.html",          namn: "Länsstyrelsen Örebro",          typ: "regional" },
];

// ── Vinnova API-handler ───────────────────────────────────────────────────
type VinnovaUtlysning = {
  Id?: string;
  Titel?: string;
  Beskrivning?: string;
  Stangningsdatum?: string;
  Belopp?: number;
  Url?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

async function hämtaVinnova(): Promise<ExtrakteratStipendium[]> {
  console.log("\n🚀 Hämtar Vinnova öppna utlysningar via API...");
  try {
    const res = await fetch(
      "https://data.vinnova.se/api/utlysningar?status=open&limit=50",
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: VinnovaUtlysning[] = await res.json();

    return data
      .filter((u) => u.Titel && u.Beskrivning)
      .map((u) => ({
        namn: u.Titel!,
        organisation: "Vinnova",
        beskrivning: (u.Beskrivning ?? "").slice(0, 300),
        belopp: u.Belopp ?? undefined,
        deadline: u.Stangningsdatum
          ? new Date(u.Stangningsdatum).toISOString().split("T")[0]
          : undefined,
        kategorier: ["innovation", "forskning", "teknik"],
        målgrupp: ["forskare", "företag", "student"],
        url: u.Url ?? "https://vinnova.se",
      }));
  } catch (e) {
    console.error("  ❌ Vinnova API-fel:", e instanceof Error ? e.message : e);
    return [];
  }
}

// ── HTML-helpers ─────────────────────────────────────────────────────────────
async function hämtaHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; StipendierBot/1.0)",
      Accept: "text/html",
    },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function extrahéraText(html: string): string {
  const $ = cheerio.load(html);
  $("nav, footer, script, style, header, aside, .menu, .sidebar, .cookie-banner").remove();
  const main =
    $("main").text() ||
    $("article").text() ||
    $('[class*="content"]').first().text() ||
    $("body").text();
  return main.replace(/\s+/g, " ").trim().slice(0, 8000);
}

// ── Claude-extraktion ────────────────────────────────────────────────────────
type ExtrakteratStipendium = {
  namn: string;
  organisation: string;
  beskrivning: string;
  belopp?: number;
  beloppMax?: number;
  deadline?: string;
  kategorier: string[];
  målgrupp: string[];
  url?: string;
};

async function extrahéraStipendierMedClaude(
  text: string,
  källUrl: string,
  extra?: string
): Promise<ExtrakteratStipendium[]> {
  const svar = await ai.messages.create({
    model: "claude-haiku-4-5-20251001", // Haiku för kostnadsbesparing på batch-jobb
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Extrahera ALLA stipendier, bidrag och anslag du hittar i texten från ${källUrl}.
${extra ?? ""}

Returnera JSON-array. Varje objekt:
- namn: string (obligatoriskt)
- organisation: string (obligatoriskt)
- beskrivning: string (1-2 meningar, obligatoriskt)
- belopp: number | undefined (kr, ej text)
- beloppMax: number | undefined
- deadline: string | undefined (YYYY-MM-DD)
- kategorier: string[] (t.ex. ["lantbruk","regional","miljö"])
- målgrupp: string[] (t.ex. ["lantbrukare","student","företag"])
- url: string | undefined

Returnera BARA JSON-arrayen. Tom array om inget hittas.

Text:
${text}`,
      },
    ],
  });

  const content = svar.content[0];
  if (content.type !== "text") return [];
  try {
    const jsonStr = content.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch {
    return [];
  }
}

// ── Spara i DB ───────────────────────────────────────────────────────────────
async function sparaStipendier(
  stipendier: ExtrakteratStipendium[],
  källUrl: string
): Promise<number> {
  let sparade = 0;
  for (const s of stipendier) {
    if (!s.namn || !s.organisation || !s.beskrivning) continue;
    const finns = await prisma.stipendium.findFirst({
      where: {
        namn: { equals: s.namn, mode: "insensitive" },
        organisation: { equals: s.organisation, mode: "insensitive" },
      },
      select: { id: true },
    });
    if (finns) { console.log(`  ↩ Finns: ${s.namn}`); continue; }

    await prisma.stipendium.create({
      data: {
        namn: s.namn,
        organisation: s.organisation,
        beskrivning: s.beskrivning,
        belopp: s.belopp ?? null,
        beloppMax: s.beloppMax ?? null,
        deadline: s.deadline ? new Date(s.deadline) : null,
        kategorier: s.kategorier ?? [],
        målgrupp: s.målgrupp ?? [],
        url: s.url ?? källUrl,
        aktiv: true,
      },
    });
    console.log(`  ✅ ${s.namn} (${s.organisation})`);
    sparade++;
  }
  return sparade;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔍 Stipendier-scraper startar...\n");
  let totalt = 0;

  // 1. Vinnova API (strukturerad data — ingen Claude-tolkning behövs)
  const vinnovaStipendier = await hämtaVinnova();
  console.log(`  🤖 Vinnova API returnerade ${vinnovaStipendier.length} utlysningar`);
  totalt += await sparaStipendier(vinnovaStipendier, "https://vinnova.se");

  // 2. HTML-källor (körs med 3 parallella workers för att spara tid)
  const batchStorlek = 3;
  for (let i = 0; i < HTML_KÄLLOR.length; i += batchStorlek) {
    const batch = HTML_KÄLLOR.slice(i, i + batchStorlek);
    await Promise.all(
      batch.map(async (källa) => {
        console.log(`\n📡 ${källa.namn}`);
        try {
          const html = await hämtaHtml(källa.url);
          const text = extrahéraText(html);
          if (text.length < 100) { console.log("  ⚠ För lite text, hoppar över"); return; }
          console.log(`  📄 ${text.length} tecken`);

          const extra = källa.typ === "regional"
            ? "Fokusera på regionala bidrag, stöd och stipendier för lantbruk, landsbygd, miljö och näringsliv i länet."
            : källa.typ === "internationell"
            ? "Fokusera på stipendier för svenska studenter och forskare att studera eller forska UTOMLANDS."
            : undefined;

          const stipendier = await extrahéraStipendierMedClaude(text, källa.url, extra);
          console.log(`  🤖 ${stipendier.length} hittade`);
          const sparade = await sparaStipendier(stipendier, källa.url);
          totalt += sparade;
        } catch (e) {
          console.error(`  ❌ ${källa.namn}:`, e instanceof Error ? e.message : e);
        }
      })
    );
    // Paus mellan batchar för att inte hammra servers
    if (i + batchStorlek < HTML_KÄLLOR.length) await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`\n✨ Klart! ${totalt} nya stipendier sparade.`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
