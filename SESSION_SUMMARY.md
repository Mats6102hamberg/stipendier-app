# SESSION SUMMARY – Stipendier App

## Projektöversikt
En Next.js-app för att enkelt söka svenska stipendier med fritextsök, kategorifilter och beloppsgränser.

## Tech Stack
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS 4
- **DB**: Prisma 7 + PostgreSQL (Neon)
- **Deploy**: Vercel

## Implementationsöversikt (Session 1 – 2026-03-31)

### Vad som byggdes
- Prisma-schema med modellen `Stipendium`
- Seed-data: 12 svenska stipendier (verkliga)
- Server Actions: `sokStipendier()` och `allaKategorier()`
- UI: Sökfilter (fritext, kategori, minBelopp, visa utgångna) + kortgrid

### Strategiska beslut
- **Prisma 7**: Kräver `url` i `prisma.config.ts`, INTE i `schema.prisma`
- **Server Components** för sök (URL-params via searchParams) ger SSR + delbar URL
- **Inga mock-data i prod**: Seed-script separerat

## Filer
```
stipendier-app/
├── app/
│   ├── page.tsx               # Huvudsida (Server Component)
│   ├── actions.ts             # Server Actions: sök + kategorier
│   └── components/
│       ├── SokFilter.tsx      # Klientkomponent: sökfält + filter
│       └── StipendiumKort.tsx # Visningskort per stipendium
├── lib/
│   └── prisma.ts              # Prisma-singleton
├── prisma/
│   ├── schema.prisma          # Datamodell
│   ├── seed.ts                # 12 stipendier
│   └── prisma.config.ts       # DB-URL-konfiguration (Prisma 7)
```

## Nästa steg
1. Koppla Neon Postgres (`DATABASE_URL` i `.env.local`)
2. Kör `npx prisma migrate dev --name init`
3. Kör `npm run db:seed`
4. Lägg till fler stipendier
5. Ev. admin-UI för att lägga till stipendier manuellt
6. Deploy till Vercel med env-variabler

## Status
- [ ] DB-koppling (väntar på DATABASE_URL)
- [x] UI + sökning klar
- [x] Prisma-schema klar
- [x] Seed-data klar
