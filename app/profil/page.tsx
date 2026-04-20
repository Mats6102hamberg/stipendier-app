"use client";
import { useState, useEffect } from "react";
import { useProfil, PROFIL_TOM, type Profil } from "@/lib/useProfile";
import Link from "next/link";

const NIVÅER = [
  { value: "gymnasieelev", label: "Gymnasieelev" },
  { value: "student", label: "Student (kandidat)" },
  { value: "masterstudent", label: "Masterstudent" },
  { value: "doktorand", label: "Doktorand" },
  { value: "forskare", label: "Forskare / Postdok" },
  { value: "yrkesverksam", label: "Yrkesverksam" },
];

export default function ProfilSida() {
  const { profil: sparad, sparaProfil, laddad } = useProfil();
  const [form, setForm] = useState<Profil>(PROFIL_TOM);
  const [sparat, setSparat] = useState(false);
  const [digest, setDigest] = useState(false);
  const [digestSkickat, setDigestSkickat] = useState(false);

  useEffect(() => {
    if (laddad) setForm(sparad);
  }, [laddad]);

  function uppdatera(fält: keyof Profil, värde: string) {
    setForm((f) => ({ ...f, [fält]: värde }));
    setSparat(false);
  }

  function spara() {
    sparaProfil(form);
    setSparat(true);
    setTimeout(() => setSparat(false), 3000);
  }

  async function prenumerera() {
    if (!form.email) return;
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, ämne: form.ämne, nivå: form.nivå, intressen: form.intressen }),
    });
    setDigestSkickat(true);
  }

  if (!laddad) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition mb-6">
          ← Tillbaka
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Min profil</h1>
            <p className="text-sm text-gray-500 mt-1">
              Dina uppgifter används för att hitta stipendier som passar just dig och för att skriva personliga ansökningar.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Namn</label>
                <input
                  type="text"
                  value={form.namn}
                  onChange={(e) => uppdatera("namn", e.target.value)}
                  placeholder="Ditt namn"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">E-post</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => uppdatera("email", e.target.value)}
                  placeholder="din@email.se"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Vad studerar / forskar du inom?</label>
              <input
                type="text"
                value={form.ämne}
                onChange={(e) => uppdatera("ämne", e.target.value)}
                placeholder="t.ex. Medicin, Maskinteknik, Historia, Konst..."
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nivå</label>
              <select
                value={form.nivå}
                onChange={(e) => uppdatera("nivå", e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              >
                {NIVÅER.map((n) => (
                  <option key={n.value} value={n.value}>{n.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Intressen och specialisering</label>
              <textarea
                value={form.intressen}
                onChange={(e) => uppdatera("intressen", e.target.value)}
                placeholder="t.ex. hållbarhet, AI, internationellt arbete, naturvård..."
                rows={2}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Vad vill du uppnå?</label>
              <textarea
                value={form.mål}
                onChange={(e) => uppdatera("mål", e.target.value)}
                placeholder="t.ex. forska utomlands, starta företag, bidra till samhället..."
                rows={2}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Bakgrund / extra information <span className="text-gray-400">(valfritt)</span>
              </label>
              <textarea
                value={form.bakgrund}
                onChange={(e) => uppdatera("bakgrund", e.target.value)}
                placeholder="t.ex. utländsk bakgrund, funktionsnedsättning, var du bor, meriter..."
                rows={2}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <button
            onClick={spara}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition"
          >
            {sparat ? "Sparat!" : "Spara profil"}
          </button>

          {/* Veckodigest */}
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="digest"
                checked={digest}
                onChange={(e) => setDigest(e.target.checked)}
                className="mt-0.5"
              />
              <div>
                <label htmlFor="digest" className="text-sm font-medium text-gray-800 cursor-pointer">
                  Veckodigest via e-post
                </label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Få nya stipendier som matchar din profil varje måndag, plus påminnelser om deadlines inom 2 veckor.
                </p>
              </div>
            </div>
            {digest && (
              <div className="mt-3">
                {digestSkickat ? (
                  <p className="text-sm text-green-600 font-medium">Du prenumererar nu!</p>
                ) : (
                  <button
                    onClick={prenumerera}
                    disabled={!form.email}
                    className="w-full py-2.5 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-900 transition disabled:opacity-40"
                  >
                    Aktivera veckodigest
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
