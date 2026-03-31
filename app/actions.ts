"use server";

import { prisma } from "@/lib/prisma";

export type StipendiumResult = {
  id: string;
  namn: string;
  organisation: string;
  beskrivning: string;
  belopp: number | null;
  beloppMax: number | null;
  deadline: Date | null;
  kategorier: string[];
  url: string | null;
};

export async function sokStipendier(params: {
  query?: string;
  kategori?: string;
  minBelopp?: number;
  visaUtgångna?: boolean;
}): Promise<StipendiumResult[]> {
  const { query, kategori, minBelopp, visaUtgångna } = params;

  const now = new Date();

  const results = await prisma.stipendium.findMany({
    where: {
      aktiv: true,
      ...(query && {
        OR: [
          { namn: { contains: query, mode: "insensitive" } },
          { organisation: { contains: query, mode: "insensitive" } },
          { beskrivning: { contains: query, mode: "insensitive" } },
        ],
      }),
      ...(kategori && {
        kategorier: { has: kategori },
      }),
      ...(minBelopp && {
        belopp: { gte: minBelopp },
      }),
      ...(!visaUtgångna && {
        OR: [{ deadline: null }, { deadline: { gte: now } }],
      }),
    },
    orderBy: [{ deadline: "asc" }, { belopp: "desc" }],
    take: 50,
  });

  return results;
}

export async function allaKategorier(): Promise<string[]> {
  const stipendier = await prisma.stipendium.findMany({
    select: { kategorier: true },
    where: { aktiv: true },
  });

  const alla = stipendier.flatMap((s: { kategorier: string[] }) => s.kategorier);
  const unika = [...new Set(alla)].sort();
  return unika;
}
