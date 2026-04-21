"use client";
import { useState } from "react";
import Link from "next/link";
import { usePremium } from "@/lib/usePremium";

const GRATIS = [
  "Sök och filtrera bland alla stipendier",
  "Se deadlines och detaljer",
  "Spara favoriter",
  "Ansökningstracker",
];

const PREMIUM = [
  "AI-rådgivare — obegränsat",
  "Ansökningsskrivaren — kompletta brev på sekunder",
  "Passar jag? — personlig kravanalys",
  "Personliga matchningar på startsidan",
  "Veckodigest med nya stipendier per e-post",
  "Allt i gratisversionen",
];

export default function PremiumSida() {
  const { premium, email: sparadEmail } = usePremium();
  const [email, setEmail] = useState(sparadEmail ?? "");
  const [plan, setPlan] = useState<"monthly" | "quarterly" | "yearly">("yearly");
  const [laddar, setLaddar] = useState(false);
  const [fel, setFel] = useState("");

  async function startCheckout() {
    if (!email) { setFel("Ange din e-postadress."); return; }
    setFel("");
    setLaddar(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan }),
      });
      const { url, error } = await res.json();
      if (error) { setFel(error); setLaddar(false); return; }
      window.location.href = url;
    } catch {
      setFel("Något gick fel. Försök igen.");
      setLaddar(false);
    }
  }

  if (premium) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Du har Premium!</h1>
          <p className="text-gray-500 text-sm mb-6">Alla AI-funktioner är upplåsta. Lycka till med ansökningarna!</p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">
            Tillbaka till stipendier →
          </Link>
        </div>
      </main>
    );
  }

  const månadsKostnad =
    plan === "yearly" ? Math.round(599 / 12) : plan === "quarterly" ? Math.round(199 / 3) : 79;
  const fakturaText =
    plan === "yearly"
      ? "Faktureras 599 kr/år — spara 350 kr"
      : plan === "quarterly"
        ? "En engångsbetalning på 199 kr för 3 mån — spara 38 kr"
        : "Faktureras månadsvis";

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Rubrik */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Uppgradera till Premium
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            AI-verktygen som hjälper dig hitta och söka stipendier du faktiskt får.
            Ett beviljat stipendium på 20 000 kr betalar appen <strong>200 gånger om.</strong>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {/* Gratis */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-700 mb-1">Gratis</h2>
            <p className="text-2xl font-bold text-gray-900 mb-4">0 kr</p>
            <ul className="space-y-2">
              {GRATIS.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-gray-400 mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium */}
          <div className="bg-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
              Populärast
            </div>
            <h2 className="font-semibold text-blue-100 mb-1">Premium</h2>
            <div className="flex items-end gap-1.5 mb-1">
              <p className="text-3xl font-bold">{månadsKostnad} kr</p>
              <p className="text-blue-200 text-sm mb-1">/månad</p>
            </div>
            <p className="text-blue-200 text-xs mb-4">{fakturaText}</p>
            <ul className="space-y-2">
              {PREMIUM.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-blue-50">
                  <span className="text-yellow-300 mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Köpformulär */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-md mx-auto">
          <h3 className="font-semibold text-gray-800 mb-4">Välj plan och betala</h3>

          {/* Planval */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {([
              { val: "yearly", label: "Årsvis", pris: "599 kr", extra: "per år", spara: "Bäst värde" },
              { val: "quarterly", label: "3 månader", pris: "199 kr", extra: "engångsavgift", spara: "Spara 38 kr" },
              { val: "monthly", label: "Månadsvis", pris: "79 kr", extra: "per månad", spara: null },
            ] as const).map(({ val, label, pris, extra, spara }) => (
              <button
                key={val}
                onClick={() => setPlan(val)}
                className={`text-left p-3 rounded-xl border-2 transition ${
                  plan === val ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="text-xs font-semibold text-gray-700">{label}</p>
                <p className="text-sm font-bold text-gray-900">{pris}</p>
                <p className="text-[11px] text-gray-500">{extra}</p>
                {spara && <p className="text-xs text-green-600 font-medium mt-0.5">{spara}</p>}
              </button>
            ))}
          </div>

          {/* E-post */}
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Din e-postadress</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="din@email.se"
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {fel && <p className="text-red-500 text-xs mb-3">{fel}</p>}

          <button
            onClick={startCheckout}
            disabled={laddar}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {laddar ? "Startar betalning..." : "Fortsätt till betalning →"}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Säker betalning via Stripe. Avsluta när som helst.
          </p>
        </div>

        {/* Social proof */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">
            "Hittade ett Fulbright-stipendium på 400 000 kr via AI-rådgivaren. Bästa investeringen jag gjort."
          </p>
          <p className="text-xs text-gray-400 mt-1">— Masterstudent, Uppsala</p>
        </div>
      </div>
    </main>
  );
}
