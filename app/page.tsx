import { Suspense } from "react";
import { sokStipendier, allaKategorier, allaMålgrupper } from "@/app/actions";
import type { SortOrder } from "@/app/actions";
import SokFilter from "@/app/components/SokFilter";
import StipendiumKort from "@/app/components/StipendiumKort";
import SkeletonKort from "@/app/components/SkeletonKort";
import TomtState from "@/app/components/TomtState";
import ProfilMatchning from "@/app/components/ProfilMatchning";
import { getLang, t } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type SearchParams = {
  q?: string;
  kat?: string;
  mg?: string;
  min?: string;
  max?: string;
  sort?: string;
  utgångna?: string;
  land?: string;
};

async function Resultat({ sp }: { sp: SearchParams }) {
  const lang = getLang(sp.land);
  const tr = t[lang];
  const stipendier = await sokStipendier({
    query: sp.q,
    kategori: sp.kat,
    målgrupp: sp.mg,
    minBelopp: sp.min ? parseInt(sp.min) : undefined,
    maxBelopp: sp.max ? parseInt(sp.max) : undefined,
    visaUtgångna: sp.utgångna === "1",
    sortering: (sp.sort as SortOrder) ?? "deadline",
    land: sp.land ?? "SE",
  });

  if (stipendier.length === 0) {
    return <TomtState query={sp.q} />;
  }

  return (
    <>
      <p className="text-sm text-gray-500 mb-4">
        {tr.found(stipendier.length)}
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
  const lang = getLang(sp.land);
  const tr = t[lang];
  const [kategorier, målgrupper] = await Promise.all([
    allaKategorier(),
    allaMålgrupper(),
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {tr.appName}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {tr.tagline}
          </p>
          <a
            href="/ai"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition shadow-sm"
          >
            {tr.aiCta}
          </a>
        </div>

        <ProfilMatchning />

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
