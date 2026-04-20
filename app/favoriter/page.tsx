"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFavoriter } from "@/hooks/useFavoriter";
import StipendiumKort from "@/app/components/StipendiumKort";
import type { StipendiumResult } from "@/app/actions";

export default function FavoriterPage() {
  const { favoriter, toggleFavorit } = useFavoriter();
  const [stipendier, setStipendier] = useState<StipendiumResult[]>([]);
  const [laddar, setLaddar] = useState(true);

  useEffect(() => {
    if (favoriter.length === 0) { setLaddar(false); return; }
    fetch(`/api/stipendier?ids=${favoriter.join(",")}`)
      .then((r) => r.json())
      .then((data) => { setStipendier(data); setLaddar(false); })
      .catch(() => setLaddar(false));
  }, [favoriter.join(",")]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">★ Mina favoriter</h1>
            <p className="text-sm text-gray-500 mt-1">
              {favoriter.length === 0
                ? "Inga sparade favoriter ännu"
                : `${favoriter.length} sparade stipendier`}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-800 transition"
          >
            ← Tillbaka till sökning
          </Link>
        </div>

        {laddar && (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: favoriter.length || 2 }).map((_, i) => (
              <div key={i} className="h-40 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {!laddar && favoriter.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">☆</div>
            <p className="text-gray-500 text-sm mb-6">
              Klicka på stjärnan på ett stipendium för att spara det här.
            </p>
            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition"
            >
              Sök stipendier
            </Link>
          </div>
        )}

        {!laddar && stipendier.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {stipendier.map((s) => (
              <StipendiumKort key={s.id} s={s} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
