"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [lösen, setLösen] = useState("");
  const [fel, setFel] = useState(false);
  const [laddar, setLaddar] = useState(false);
  const router = useRouter();

  async function logga(e: React.FormEvent) {
    e.preventDefault();
    setLaddar(true); setFel(false);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ lösen }),
      headers: { "Content-Type": "application/json" },
    });
    setLaddar(false);
    if (res.ok) router.push("/admin");
    else setFel(true);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Admin – Stipendiesök</h1>
        <form onSubmit={logga} className="space-y-4">
          <input
            type="password"
            placeholder="Lösenord"
            value={lösen}
            onChange={(e) => setLösen(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            autoFocus
          />
          {fel && <p className="text-xs text-red-500">Fel lösenord</p>}
          <button
            type="submit"
            disabled={laddar || !lösen}
            className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {laddar ? "Loggar in..." : "Logga in"}
          </button>
        </form>
      </div>
    </main>
  );
}
