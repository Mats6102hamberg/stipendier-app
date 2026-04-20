"use client";

import { useState } from "react";

export default function BevakaForm({ stipendiumId }: { stipendiumId: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "ok" | "fel">("idle");
  const [laddar, setLaddar] = useState(false);

  async function bevaka(e: React.FormEvent) {
    e.preventDefault();
    setLaddar(true);
    const res = await fetch("/api/bevaka", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, stipendiumId }),
    });
    setLaddar(false);
    setStatus(res.ok ? "ok" : "fel");
  }

  if (status === "ok") {
    return (
      <div className="bg-green-50 rounded-xl p-4 text-sm text-green-700 flex items-center gap-2">
        ✓ Du får en påminnelse 7 dagar innan deadline.
      </div>
    );
  }

  return (
    <form onSubmit={bevaka} className="space-y-2">
      <p className="text-xs text-gray-500 font-medium">Få påminnelse innan deadline</p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="din@email.se"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          disabled={laddar}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {laddar ? "..." : "Bevaka"}
        </button>
      </div>
      {status === "fel" && <p className="text-xs text-red-500">Något gick fel, försök igen.</p>}
    </form>
  );
}
