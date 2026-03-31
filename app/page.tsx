import { Suspense } from "react";

export const dynamic = "force-dynamic";
import { sokStipendier, allaKategorier } from "@/app/actions";
import SokFilter from "@/app/components/SokFilter";
import StipendiumKort from "@/app/components/StipendiumKort";

type SearchParams = {
  q?: string;
  kat?: string;
  min?: string;
  utgångna?: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const [stipendier, kategorier] = await Promise.all([
    sokStipendier({
      query: sp.q,
      kategori: sp.kat,
      minBelopp: sp.min ? parseInt(sp.min) : undefined,
      visaUtgångna: sp.utgångna === "1",
    }),
    allaKategorier(),
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Stipendiesök
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Hitta stipendier för studier, forskning och utbyte
          </p>
        </div>

        {/* Sökfilter */}
        <Suspense fallback={null}>
          <SokFilter kategorier={kategorier} />
        </Suspense>

        {/* Resultat */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-4">
            {stipendier.length === 0
              ? "Inga stipendier matchade din sökning."
              : `${stipendier.length} stipendi${stipendier.length === 1 ? "um" : "er"} hittades`}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {stipendier.map((s) => (
              <StipendiumKort key={s.id} s={s} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
