"use client";

import Link from "next/link";
import { useState } from "react";
import { useFavoriter } from "@/hooks/useFavoriter";
import type { StipendiumResult } from "@/app/actions";
import { formatBelopp, deadlineInfo } from "@/lib/format";

export default function StipendiumKort({ s }: { s: StipendiumResult }) {
  const { favoriter, toggleFavorit } = useFavoriter();
  const [kopierat, setKopierat] = useState(false);
  const ärFavorit = favoriter.includes(s.id);
  const belopp = formatBelopp(s.belopp, s.beloppMax);
  const dl = deadlineInfo(s.deadline);

  function dela(e: React.MouseEvent) {
    e.preventDefault();
    const url = `${window.location.origin}/stipendier/${s.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setKopierat(true);
      setTimeout(() => setKopierat(false), 2000);
    });
  }

  return (
    <Link
      href={`/stipendier/${s.id}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 p-5 flex flex-col gap-3 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-blue-700 transition-colors">
            {s.namn}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{s.organisation}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {belopp && (
            <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {belopp}
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">{s.beskrivning}</p>

      <div className="flex flex-wrap gap-1.5">
        {s.kategorier.slice(0, 4).map((k) => (
          <span key={k} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            {k}
          </span>
        ))}
        {s.målgrupp.slice(0, 2).map((m) => (
          <span key={m} className="bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-full">
            {m}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
        <span className={`text-xs ${dl.cls}`}>{dl.text}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorit(s.id); }}
            title={ärFavorit ? "Ta bort favorit" : "Spara som favorit"}
            className="text-lg transition-transform hover:scale-110"
          >
            {ärFavorit ? "★" : "☆"}
          </button>
          <button
            onClick={dela}
            title="Kopiera länk"
            className={`text-xs transition px-2 py-0.5 rounded-full ${
              kopierat
                ? "bg-green-100 text-green-600 font-medium"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {kopierat ? "✓ Kopierat!" : "🔗"}
          </button>
        </div>
      </div>
    </Link>
  );
}
