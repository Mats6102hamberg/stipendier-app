"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { SortOrder } from "@/app/actions";

const SNABB_KATEGORIER = [
  "teknik", "forskning", "internationell", "medicin", "kultur", "utbyte",
];

type Props = {
  kategorier: string[];
  målgrupper: string[];
};

export default function SokFilter({ kategorier, målgrupper }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [kategori, setKategori] = useState(params.get("kat") ?? "");
  const [målgrupp, setMålgrupp] = useState(params.get("mg") ?? "");
  const [minBelopp, setMinBelopp] = useState(params.get("min") ?? "");
  const [sortering, setSortering] = useState<SortOrder>(
    (params.get("sort") as SortOrder) ?? "deadline"
  );
  const [visaUtgångna, setVisaUtgångna] = useState(
    params.get("utgångna") === "1"
  );

  const debouncedQuery = useDebounce(query, 400);

  // Auto-sök när debouncat query ändras
  useEffect(() => {
    navigera({ q: debouncedQuery });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  function navigera(overrides: Partial<Record<string, string>> = {}) {
    const p = new URLSearchParams();
    const vals: Record<string, string> = {
      q: query,
      kat: kategori,
      mg: målgrupp,
      min: minBelopp,
      sort: sortering,
      utgångna: visaUtgångna ? "1" : "",
      ...overrides,
    };
    Object.entries(vals).forEach(([k, v]) => { if (v) p.set(k, v); });
    startTransition(() => router.push(`/?${p.toString()}`));
  }

  function rensa() {
    setQuery(""); setKategori(""); setMålgrupp("");
    setMinBelopp(""); setSortering("deadline"); setVisaUtgångna(false);
    startTransition(() => router.push("/"));
  }

  const harAktivFilter =
    query || kategori || målgrupp || minBelopp || visaUtgångna;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
      {/* Fritextsök */}
      <div className="relative">
        <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Sök på namn, organisation, nyckelord..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {pending && (
          <div className="absolute right-3 top-3 h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        )}
      </div>

      {/* Snabb-taggar */}
      <div className="flex flex-wrap gap-2">
        {SNABB_KATEGORIER.map((k) => (
          <button
            key={k}
            onClick={() => { setKategori(k === kategori ? "" : k); navigera({ kat: k === kategori ? "" : k }); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              kategori === k
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      {/* Filter-rad */}
      <div className="flex flex-wrap gap-3">
        <select
          value={kategori}
          onChange={(e) => { setKategori(e.target.value); navigera({ kat: e.target.value }); }}
          className="flex-1 min-w-[140px] px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">Alla kategorier</option>
          {kategorier.map((k) => (
            <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
          ))}
        </select>

        <select
          value={målgrupp}
          onChange={(e) => { setMålgrupp(e.target.value); navigera({ mg: e.target.value }); }}
          className="flex-1 min-w-[140px] px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">Alla målgrupper</option>
          {målgrupper.map((m) => (
            <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
          ))}
        </select>

        <select
          value={minBelopp}
          onChange={(e) => { setMinBelopp(e.target.value); navigera({ min: e.target.value }); }}
          className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">Alla belopp</option>
          <option value="5000">Minst 5 000 kr</option>
          <option value="10000">Minst 10 000 kr</option>
          <option value="20000">Minst 20 000 kr</option>
          <option value="50000">Minst 50 000 kr</option>
        </select>

        <select
          value={sortering}
          onChange={(e) => { const v = e.target.value as SortOrder; setSortering(v); navigera({ sort: v }); }}
          className="flex-1 min-w-[130px] px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="deadline">Sortера: Deadline</option>
          <option value="belopp">Sortera: Belopp</option>
          <option value="namn">Sortera: Namn A–Ö</option>
        </select>
      </div>

      {/* Botten-rad */}
      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={visaUtgångna}
            onChange={(e) => { setVisaUtgångna(e.target.checked); navigera({ utgångna: e.target.checked ? "1" : "" }); }}
            className="rounded"
          />
          Visa även utgångna deadlines
        </label>
        {harAktivFilter && (
          <button onClick={rensa} className="text-xs text-gray-400 hover:text-gray-600 transition underline">
            Rensa filter
          </button>
        )}
      </div>
    </div>
  );
}
