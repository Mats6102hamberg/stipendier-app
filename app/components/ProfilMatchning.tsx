"use client";
import { useEffect, useState } from "react";
import { useProfil, profilTillText } from "@/lib/useProfile";
import Link from "next/link";
import { formatBelopp, deadlineInfo } from "@/lib/format";
import { useSearchParams } from "next/navigation";
import { useT } from "@/lib/i18n";

type Stip = {
  id: string; namn: string; organisation: string; beskrivning: string;
  belopp: number | null; beloppMax: number | null; deadline: string | null;
  kategorier: string[]; målgrupp: string[]; url: string | null;
};

export default function ProfilMatchning() {
  const { profil, laddad, harProfil } = useProfil();
  const [matchningar, setMatchningar] = useState<Stip[]>([]);
  const [laddar, setLaddar] = useState(false);
  const params = useSearchParams();
  const tr = useT(params.get("land"));

  useEffect(() => {
    if (!laddad) return;
    if (!harProfil) return;

    const text = profilTillText(profil);
    setLaddar(true);
    fetch("/api/matchning", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profilText: text }),
    })
      .then((r) => r.json())
      .then(setMatchningar)
      .catch(() => {})
      .finally(() => setLaddar(false));
  }, [laddad, harProfil]);

  if (!laddad) return null;

  if (!harProfil) {
    return (
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-100">
        <p className="text-sm font-semibold text-gray-800 mb-1">{tr.personalMatches}</p>
        <p className="text-sm text-gray-500 mb-3">{tr.personalMatchesDesc}</p>
        <Link
          href="/profil"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-700 hover:text-purple-900 transition"
        >
          {tr.createProfile}
        </Link>
      </div>
    );
  }

  if (laddar) {
    return (
      <div className="mb-8">
        <p className="text-sm font-semibold text-gray-700 mb-3">{tr.bestMatches}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (matchningar.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-700">
          {tr.bestMatches}
          <span className="ml-2 text-xs font-normal text-gray-400">{tr.basedOnProfile}</span>
        </p>
        <Link href="/profil" className="text-xs text-gray-400 hover:text-gray-600 transition">{tr.editProfile}</Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {matchningar.slice(0, 4).map((s) => {
          const dl = deadlineInfo(s.deadline ? new Date(s.deadline) : null);
          const bel = formatBelopp(s.belopp, s.beloppMax);
          return (
            <Link
              key={s.id}
              href={`/stipendier/${s.id}`}
              className="block bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-purple-200 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{s.namn}</p>
                  <p className="text-xs text-gray-500 truncate">{s.organisation}</p>
                </div>
                {bel && (
                  <span className="shrink-0 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    {bel}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{s.beskrivning}</p>
              <p className={`text-xs mt-2 font-medium ${dl.cls}`}>{dl.text}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
