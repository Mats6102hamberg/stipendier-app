"use client";

import { useRouter } from "next/navigation";

type Props = { query?: string };

export default function TomtState({ query }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        {query
          ? `Inga stipendier matchade "${query}"`
          : "Inga stipendier hittades"}
      </h2>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        Prova att ändra filter, söka på ett annat ord, eller visa även utgångna
        deadlines.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition"
      >
        Rensa filter
      </button>
    </div>
  );
}
