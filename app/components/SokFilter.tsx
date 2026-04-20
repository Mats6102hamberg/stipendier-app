"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect, useRef, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { SortOrder } from "@/app/actions";
import { useT } from "@/lib/i18n";

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
  const mounted = useRef(false);
  const tr = useT(params.get("land"));

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [kategori, setKategori] = useState(params.get("kat") ?? "");
  const [målgrupp, setMålgrupp] = useState(params.get("mg") ?? "");
  const [minBelopp, setMinBelopp] = useState(params.get("min") ?? "");
  const [maxBelopp, setMaxBelopp] = useState(params.get("max") ?? "");
  const [sortering, setSortering] = useState<SortOrder>(
    (params.get("sort") as SortOrder) ?? "deadline"
  );
  const [visaUtgångna, setVisaUtgångna] = useState(
    params.get("utgångna") === "1"
  );

  const debouncedQuery = useDebounce(query, 400);

  const byggUrl = useCallback(
    (overrides: Partial<Record<string, string>> = {}) => {
      const p = new URLSearchParams();
      const land = params.get("land");
      const vals: Record<string, string> = {
        q: query,
        kat: kategori,
        mg: målgrupp,
        min: minBelopp,
        max: maxBelopp,
        sort: sortering,
        utgångna: visaUtgångna ? "1" : "",
        ...(land ? { land } : {}),
        ...overrides,
      };
      Object.entries(vals).forEach(([k, v]) => { if (v) p.set(k, v); });
      const str = p.toString();
      return str ? `/?${str}` : "/";
    },
    [query, kategori, målgrupp, minBelopp, maxBelopp, sortering, visaUtgångna, params]
  );

  // Stale-closure fix: kör ej på initial mount, använd debouncedQuery explicit
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const p = new URLSearchParams();
    const land = params.get("land");
    const vals: Record<string, string> = {
      q: debouncedQuery,
      kat: kategori,
      mg: målgrupp,
      min: minBelopp,
      max: maxBelopp,
      sort: sortering,
      utgångna: visaUtgångna ? "1" : "",
      ...(land ? { land } : {}),
    };
    Object.entries(vals).forEach(([k, v]) => { if (v) p.set(k, v); });
    const str = p.toString();
    startTransition(() => router.push(str ? `/?${str}` : "/"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  function navigera(overrides: Partial<Record<string, string>> = {}) {
    startTransition(() => router.push(byggUrl(overrides)));
  }

  function rensa() {
    setQuery(""); setKategori(""); setMålgrupp("");
    setMinBelopp(""); setMaxBelopp(""); setSortering("deadline"); setVisaUtgångna(false);
    const land = params.get("land");
    startTransition(() => router.push(land ? `/?land=${land}` : "/"));
  }

  const harAktivFilter =
    query || kategori || målgrupp || minBelopp || maxBelopp || visaUtgångna;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
      {/* Fritextsök */}
      <div className="relative">
        <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder={tr.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {pending && (
          <div className="absolute right-3 top-3 h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        )}
      </div>

      {/* Snabb-taggar */}
      <div className="flex flex-wrap gap-2">
        {SNABB_KATEGORIER.map((k) => {
          const aktiv = kategori === k;
          return (
            <button
              key={k}
              onClick={() => {
                const nästa = aktiv ? "" : k;
                setKategori(nästa);
                navigera({ kat: nästa });
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                aktiv
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {k}
            </button>
          );
        })}
      </div>

      {/* Filter-rad */}
      <div className="flex flex-wrap gap-3">
        <select
          value={kategori}
          onChange={(e) => { setKategori(e.target.value); navigera({ kat: e.target.value }); }}
          className="flex-1 min-w-[140px] px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">{tr.allCategories}</option>
          {kategorier.map((k) => (
            <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>
          ))}
        </select>

        <select
          value={målgrupp}
          onChange={(e) => { setMålgrupp(e.target.value); navigera({ mg: e.target.value }); }}
          className="flex-1 min-w-[140px] px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">{tr.allTargetGroups}</option>
          {målgrupper.map((m) => (
            <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
          ))}
        </select>

        <select
          value={minBelopp}
          onChange={(e) => { setMinBelopp(e.target.value); navigera({ min: e.target.value }); }}
          className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">{tr.minAmount}</option>
          <option value="5000">{tr.minAmountLabel("5 000")}</option>
          <option value="10000">{tr.minAmountLabel("10 000")}</option>
          <option value="20000">{tr.minAmountLabel("20 000")}</option>
          <option value="50000">{tr.minAmountLabel("50 000")}</option>
        </select>

        <select
          value={maxBelopp}
          onChange={(e) => { setMaxBelopp(e.target.value); navigera({ max: e.target.value }); }}
          className="flex-1 min-w-[120px] px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="">{tr.maxAmount}</option>
          <option value="10000">{tr.maxAmountLabel("10 000")}</option>
          <option value="25000">{tr.maxAmountLabel("25 000")}</option>
          <option value="50000">{tr.maxAmountLabel("50 000")}</option>
          <option value="100000">{tr.maxAmountLabel("100 000")}</option>
        </select>

        <select
          value={sortering}
          onChange={(e) => { const v = e.target.value as SortOrder; setSortering(v); navigera({ sort: v }); }}
          className="flex-1 min-w-[130px] px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="deadline">{tr.sortDeadline}</option>
          <option value="belopp">{tr.sortAmount}</option>
          <option value="namn">{tr.sortName}</option>
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
          {tr.showExpired}
        </label>
        <div className="flex items-center gap-3">
          <Link
            href="/favoriter"
            className="text-xs text-gray-400 hover:text-yellow-500 transition"
          >
            {tr.favorites}
          </Link>
          {harAktivFilter && (
            <button onClick={rensa} className="text-xs text-gray-400 hover:text-gray-600 transition underline">
              {tr.clearFilter}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
