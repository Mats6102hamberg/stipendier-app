"use server";

import { prisma } from "@/lib/prisma";

export type SortOrder = "deadline" | "belopp" | "namn";

export type StipendiumResult = {
  id: string;
  namn: string;
  organisation: string;
  beskrivning: string;
  belopp: number | null;
  beloppMax: number | null;
  deadline: Date | null;
  kategorier: string[];
  målgrupp: string[];
  url: string | null;
};

export async function sokStipendier(params: {
  query?: string;
  kategori?: string;
  målgrupp?: string;
  minBelopp?: number;
  maxBelopp?: number;
  visaUtgångna?: boolean;
  sortering?: SortOrder;
  land?: string;
}): Promise<StipendiumResult[]> {
  const {
    query,
    kategori,
    målgrupp,
    minBelopp,
    maxBelopp,
    visaUtgångna,
    sortering = "deadline",
    land = "SE",
  } = params;

  const now = new Date();

  const orderBy =
    sortering === "belopp"
      ? [{ belopp: "desc" as const }]
      : sortering === "namn"
        ? [{ namn: "asc" as const }]
        : [{ deadline: "asc" as const }];

  const results = await prisma.stipendium.findMany({
    where: {
      aktiv: true,
      land,
      ...(query && {
        OR: [
          { namn: { contains: query, mode: "insensitive" } },
          { organisation: { contains: query, mode: "insensitive" } },
          { beskrivning: { contains: query, mode: "insensitive" } },
        ],
      }),
      ...(kategori && { kategorier: { has: kategori } }),
      ...(målgrupp && { målgrupp: { has: målgrupp } }),
      ...(minBelopp && { belopp: { gte: minBelopp } }),
      ...(maxBelopp && { belopp: { lte: maxBelopp } }),
      ...(!visaUtgångna && {
        OR: [{ deadline: null }, { deadline: { gte: now } }],
      }),
    },
    orderBy,
    take: 100,
  });

  return results;
}

export async function allaKategorier(): Promise<string[]> {
  const stipendier = await prisma.stipendium.findMany({
    select: { kategorier: true },
    where: { aktiv: true },
  });
  const alla: string[] = stipendier.flatMap(
    (s: { kategorier: string[] }) => s.kategorier
  );
  return Array.from(new Set(alla)).sort();
}

export async function allaMålgrupper(): Promise<string[]> {
  const stipendier = await prisma.stipendium.findMany({
    select: { målgrupp: true },
    where: { aktiv: true },
  });
  const alla: string[] = stipendier.flatMap(
    (s: { målgrupp: string[] }) => s.målgrupp
  );
  return Array.from(new Set(alla)).sort();
}

export async function hamtaStipendium(
  id: string
): Promise<StipendiumResult | null> {
  return prisma.stipendium.findUnique({ where: { id, aktiv: true } });
}
