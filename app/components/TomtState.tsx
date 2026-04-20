"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useT } from "@/lib/i18n";

type Props = { query?: string };

export default function TomtState({ query }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const tr = useT(params.get("land"));

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        {tr.noResults(query)}
      </h2>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        {tr.noResultsHint}
      </p>
      <button
        onClick={() => {
          const land = params.get("land");
          router.push(land ? `/?land=${land}` : "/");
        }}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition"
      >
        {tr.clearFilter}
      </button>
    </div>
  );
}
