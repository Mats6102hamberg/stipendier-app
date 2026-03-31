import { Suspense } from "react";
import { sokStipendier, allaKategorier, allaMålgrupper } from "@/app/actions";
import type { SortOrder } from "@/app/actions";
import SokFilter from "@/app/components/SokFilter";
import StipendiumKort from "@/app/components/StipendiumKort";
import SkeletonKort from "@/app/components/SkeletonKort";
import TomtState from "@/app/components/TomtState";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  kat?: string;
  mg?: string;
  min?: string;
  sort?: string;
  utgångna?: string;
};

async function Resultat({ sp }: { sp: SearchParams }) {
  const stipendier = await sokStipendier({
    query: sp.q,
    kategori: sp.kat,
    målgrupp: sp.mg,
    minBelopp: sp.min ? parseInt(sp.min) : undefined,
    visaUtgångna: sp.utgångna === "1",
    sortering: (sp.sort as SortOrder) ?? "deadline",
  });

  if (stipendier.length === 0) {
    return <TomtState query={sp.q} />;
  }

  return (
    <>
      <p className="text-sm text-gray-500 mb-4">
        {stipendier.length} stipendi{stipendier.length === 1 ? "um" : "er"} hittades
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {stipendier.map((s) => (
          <StipendiumKort key={s.id} s={s} />
        ))}
      </div>
    </>
  );
}

function ResultatSkeleton() {
  return (
    <>
      <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonKort key={i} />
        ))}
      </div>
    </>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const [kategorier, målgrupper] = await Promise.all([
    allaKategorier(),
    allaMålgrupper(),
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Stipendiesök
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Hitta stipendier för studier, forskning och utbyte
          </p>
        </div>

        <Suspense fallback={null}>
          <SokFilter kategorier={kategorier} målgrupper={målgrupper} />
        </Suspense>

        <div className="mt-6">
          <Suspense fallback={<ResultatSkeleton />}>
            <Resultat sp={sp} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
