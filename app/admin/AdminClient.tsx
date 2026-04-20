"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Stipendium = {
  id: string;
  namn: string;
  organisation: string;
  beskrivning: string;
  belopp: number | null;
  beloppMax: number | null;
  deadline: Date | null;
  kategorier: string[];
  målgrupp: string[];
  url: string | null;
  aktiv: boolean;
};

const TOM_FORM = {
  namn: "", organisation: "", beskrivning: "", belopp: "",
  beloppMax: "", deadline: "", kategorier: "", målgrupp: "", url: "",
};

export default function AdminClient({ stipendier: initial }: { stipendier: Stipendium[] }) {
  const router = useRouter();
  const [stipendier, setStipendier] = useState(initial);
  const [form, setForm] = useState(TOM_FORM);
  const [sparar, setSparar] = useState(false);
  const [meddelande, setMeddelande] = useState("");

  async function laggTill(e: React.FormEvent) {
    e.preventDefault();
    setSparar(true);
    const res = await fetch("/api/admin/stipendier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        kategorier: form.kategorier.split(",").map((s) => s.trim()).filter(Boolean),
        målgrupp: form.målgrupp.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    setSparar(false);
    if (res.ok) {
      const nytt = await res.json();
      setStipendier([nytt, ...stipendier]);
      setForm(TOM_FORM);
      setMeddelande("✓ Stipendium tillagt");
      setTimeout(() => setMeddelande(""), 3000);
    }
  }

  async function toggleAktiv(id: string, aktiv: boolean) {
    const res = await fetch("/api/admin/stipendier", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, aktiv: !aktiv }),
    });
    if (res.ok) {
      setStipendier(stipendier.map((s) => s.id === id ? { ...s, aktiv: !aktiv } : s));
    }
  }

  const input = "w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin – Stipendiesök</h1>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-500 hover:text-gray-800 transition"
          >
            ← Till appen
          </button>
        </div>

        {/* Lägg till stipendium */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Lägg till stipendium</h2>
          <form onSubmit={laggTill} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required placeholder="Namn *" value={form.namn} onChange={(e) => setForm({ ...form, namn: e.target.value })} className={input} />
            <input required placeholder="Organisation *" value={form.organisation} onChange={(e) => setForm({ ...form, organisation: e.target.value })} className={input} />
            <textarea required placeholder="Beskrivning *" value={form.beskrivning} onChange={(e) => setForm({ ...form, beskrivning: e.target.value })} className={`${input} sm:col-span-2 resize-none`} rows={2} />
            <input type="number" placeholder="Belopp (kr)" value={form.belopp} onChange={(e) => setForm({ ...form, belopp: e.target.value })} className={input} />
            <input type="number" placeholder="Max belopp (kr)" value={form.beloppMax} onChange={(e) => setForm({ ...form, beloppMax: e.target.value })} className={input} />
            <input type="date" placeholder="Deadline" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={input} />
            <input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={input} />
            <input placeholder="Kategorier (komma-separerade)" value={form.kategorier} onChange={(e) => setForm({ ...form, kategorier: e.target.value })} className={input} />
            <input placeholder="Målgrupp (komma-separerade)" value={form.målgrupp} onChange={(e) => setForm({ ...form, målgrupp: e.target.value })} className={input} />
            <div className="sm:col-span-2 flex items-center gap-3">
              <button type="submit" disabled={sparar} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                {sparar ? "Sparar..." : "Lägg till"}
              </button>
              {meddelande && <span className="text-sm text-green-600">{meddelande}</span>}
            </div>
          </form>
        </div>

        {/* Lista stipendier */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">
              Alla stipendier ({stipendier.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {stipendier.map((s) => (
              <div key={s.id} className={`px-6 py-4 flex items-start justify-between gap-4 ${!s.aktiv ? "opacity-50" : ""}`}>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{s.namn}</p>
                  <p className="text-xs text-gray-500">{s.organisation}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {s.kategorier.map((k) => (
                      <span key={k} className="bg-gray-100 text-gray-500 text-xs px-1.5 py-0.5 rounded">{k}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {s.deadline && (
                    <span className="text-xs text-gray-400">
                      {new Date(s.deadline).toLocaleDateString("sv-SE")}
                    </span>
                  )}
                  <button
                    onClick={() => toggleAktiv(s.id, s.aktiv)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${
                      s.aktiv
                        ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700"
                        : "bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700"
                    }`}
                  >
                    {s.aktiv ? "Aktiv" : "Inaktiv"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
