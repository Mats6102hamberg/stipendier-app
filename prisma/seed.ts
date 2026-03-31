import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const stipendier = [
  {
    namn: "Nils Ericsons stipendium",
    organisation: "Svenska Väg- och Vattenbyggares Riksförbund",
    beskrivning:
      "Stipendium för studenter inom väg- och vattenbyggnad med goda studieresultat.",
    belopp: 20000,
    deadline: new Date("2025-10-01"),
    kategorier: ["teknik", "ingenjör", "infrastruktur"],
    url: "https://svr.se",
  },
  {
    namn: "Ahlmansfonden",
    organisation: "Ahlmansfonden",
    beskrivning:
      "Stöd till studerande från Malmöhus och Kristianstads län för studier inom teknik, naturvetenskap eller medicin.",
    belopp: 15000,
    beloppMax: 50000,
    deadline: new Date("2025-09-15"),
    kategorier: ["teknik", "naturvetenskap", "medicin", "Skåne"],
    url: "https://ahlmansfonden.se",
  },
  {
    namn: "Adlerbertska stipendierna",
    organisation: "Chalmers tekniska högskola",
    beskrivning:
      "Stipendier till studenter vid Chalmers med goda studieresultat och ekonomiska behov.",
    belopp: 10000,
    beloppMax: 30000,
    deadline: new Date("2025-11-30"),
    kategorier: ["teknik", "Chalmers", "ekonomiskt behov"],
    url: "https://chalmers.se/stipendier",
  },
  {
    namn: "Hierta-Retzius stipendiefond",
    organisation: "Kungliga Vetenskapsakademien",
    beskrivning:
      "Till svenska vetenskapsmän och vetenskapskvinnor för vetenskapliga undersökningar.",
    belopp: 50000,
    deadline: new Date("2025-12-01"),
    kategorier: ["forskning", "vetenskap", "naturvetenskap"],
    url: "https://kva.se",
  },
  {
    namn: "Svenska Institutet – stipendier för studier i Sverige",
    organisation: "Svenska Institutet",
    beskrivning:
      "Stipendier för internationella studenter som läser masterprogram i Sverige.",
    belopp: 11000,
    deadline: new Date("2025-02-10"),
    kategorier: ["internationell", "master", "Sverige"],
    url: "https://si.se/stipendier",
  },
  {
    namn: "Rotarys ungdomsstipendium",
    organisation: "Rotary Sverige",
    beskrivning:
      "Utbytesstipendium för ungdomar 15–19 år för ett skolår utomlands.",
    belopp: 0,
    deadline: new Date("2025-11-01"),
    kategorier: ["utbyte", "ungdom", "gymnasiet", "internationell"],
    url: "https://rotary.se",
  },
  {
    namn: "Stiftelsen Lars Hiertas Minne",
    organisation: "Stiftelsen Lars Hiertas Minne",
    beskrivning:
      "Stöder vetenskaplig forskning, kulturellt skapande och utbildning i Sverige.",
    belopp: 30000,
    beloppMax: 100000,
    deadline: new Date("2025-09-30"),
    kategorier: ["forskning", "kultur", "utbildning"],
    url: "https://hiertas-minne.se",
  },
  {
    namn: "KTH:s stipendier",
    organisation: "Kungliga Tekniska Högskolan",
    beskrivning:
      "Olika stipendier för studenter på KTH – baserade på meriter och ekonomiska behov.",
    belopp: 10000,
    beloppMax: 40000,
    deadline: new Date("2025-10-15"),
    kategorier: ["teknik", "KTH", "forskning"],
    url: "https://kth.se/stipendier",
  },
  {
    namn: "Erasmus+",
    organisation: "Europeiska Kommissionen",
    beskrivning:
      "EU:s program för utbildning, ungdom och sport – studier och praktik i Europa.",
    belopp: 500,
    beloppMax: 700,
    deadline: new Date("2025-03-31"),
    kategorier: ["EU", "utbyte", "praktik", "internationell"],
    url: "https://erasmus-plus.ec.europa.eu",
  },
  {
    namn: "Lärarnas Riksförbunds stipendium",
    organisation: "Lärarnas Riksförbund",
    beskrivning:
      "Stipendium för lärarstudenter och verksamma lärare för kompetensutveckling.",
    belopp: 15000,
    deadline: new Date("2025-04-30"),
    kategorier: ["lärare", "utbildning", "pedagogik"],
    url: "https://lr.se",
  },
  {
    namn: "Sven och Dagmar Saléns stiftelse",
    organisation: "Sven och Dagmar Saléns stiftelse",
    beskrivning:
      "Stipendier för studier eller forskning om sjöfart och marin teknik.",
    belopp: 20000,
    deadline: new Date("2025-08-31"),
    kategorier: ["sjöfart", "marin", "teknik", "forskning"],
    url: "https://salenstiftelse.se",
  },
  {
    namn: "Helge Ax:son Johnsons stiftelse",
    organisation: "Helge Ax:son Johnsons stiftelse",
    beskrivning:
      "Understöder vetenskaplig forskning, studier och kulturella ändamål.",
    belopp: 10000,
    beloppMax: 80000,
    deadline: new Date("2025-10-31"),
    kategorier: ["forskning", "vetenskap", "kultur"],
    url: null,
  },
];

async function main() {
  console.log("Seeder: Raderar gamla stipendier...");
  await prisma.stipendium.deleteMany();

  console.log("Seeder: Skapar stipendier...");
  for (const s of stipendier) {
    await prisma.stipendium.create({ data: s });
  }
  console.log(`✅ Seedad ${stipendier.length} stipendier.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
