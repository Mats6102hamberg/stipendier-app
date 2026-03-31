"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";

type Props = {
  kategorier: string[];
};

export default function SokFilter({ kategorier }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [kategori, setKategori] = useState(params.get("kat") ?? "");
  const [minBelopp, setMinBelopp] = useState(params.get("min") ?? "");
  const [visaUtgångna, setVisaUtgångna] = useState(
    params.get("utgångna") === "1"
  );

  function uppdatera(overrides?: Partial<Record<string, string>>) {
    const p = new URLSearchParams();
    const vals = {
      q: query,
      kat: kategori,
      min: minBelopp,
      utgångna: visaUtgångna ? "1" : "",
      ...overrides,
    };
    Object.entries(vals).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    startTransition(() => router.push(`/?${p.toString()}`));
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
      {/* Fritextsök */}
      <div className="relative">
        <svg
          className="absolute left-3 top-3 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Sök på namn, organisation, nyckelord..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && uppdatera({ q: e.currentTarget.value })}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Kategorifilter */}
        <select
          value={kategori}
          onChange={(e) => {
            setKategori(e.target.value);
            uppdatera({ kat: e.target.value });
          }}
          className="flex-1 min-w-[160px] px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">Alla kategorier</option>
          {kategorier.map((k) => (
            <option key={k} value={k}>
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </option>
          ))}
        </select>

        {/* Minsta belopp */}
        <select
          value={minBelopp}
          onChange={(e) => {
            setMinBelopp(e.target.value);
            uppdatera({ min: e.target.value });
          }}
          className="flex-1 min-w-[160px] px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">Alla belopp</option>
          <option value="5000">Minst 5 000 kr</option>
          <option value="10000">Minst 10 000 kr</option>
          <option value="20000">Minst 20 000 kr</option>
          <option value="50000">Minst 50 000 kr</option>
        </select>

        {/* Sökknapp */}
        <button
          onClick={() => uppdatera()}
          disabled={pending}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {pending ? "Söker..." : "Sök"}
        </button>
      </div>

      {/* Visa utgångna */}
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none w-fit">
        <input
          type="checkbox"
          checked={visaUtgångna}
          onChange={(e) => {
            setVisaUtgångna(e.target.checked);
            uppdatera({ utgångna: e.target.checked ? "1" : "" });
          }}
          className="rounded"
        />
        Visa även utgångna deadline
      </label>
    </div>
  );
}
