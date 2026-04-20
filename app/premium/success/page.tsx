"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessInner() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("session_id");
  const [fel, setFel] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    let avbruten = false;

    (async () => {
      try {
        const res = await fetch("/api/auth/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        if (!res.ok) {
          const { error } = await res.json().catch(() => ({ error: "Okänt fel" }));
          throw new Error(error || "Kunde inte hämta token");
        }
        const { token, email } = await res.json();
        if (avbruten) return;
        localStorage.setItem("stipendier_token", token);
        if (email) localStorage.setItem("stipendier_email", email);
        localStorage.removeItem("stipendier_premium_cache");
      } catch (err) {
        console.error("[premium/success] claim failed", err);
        if (!avbruten) setFel(err instanceof Error ? err.message : "Okänt fel");
      }
    })();

    const timer = setTimeout(() => router.push("/ai"), 4000);
    return () => {
      avbruten = true;
      clearTimeout(timer);
    };
  }, [sessionId, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-10 max-w-md w-full text-center">
        <div className="text-5xl mb-5">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Välkommen till Premium!
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Alla AI-funktioner är nu upplåsta. Du skickas strax till AI-rådgivaren.
        </p>
        {fel && (
          <p className="text-red-600 text-sm mb-4">
            Kunde inte aktivera premium automatiskt: {fel}. Kontakta support om det kvarstår.
          </p>
        )}
        <div className="space-y-2 text-left bg-blue-50 rounded-xl p-4 mb-6">
          {[
            "AI-rådgivare — obegränsat",
            "Ansökningsskrivaren",
            "Passar jag? — kravanalys",
            "Personliga matchningar",
            "Veckodigest",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-blue-800">
              <span className="text-blue-500">✓</span>{f}
            </div>
          ))}
        </div>
        <Link
          href="/ai"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition"
        >
          Starta AI-rådgivaren →
        </Link>
      </div>
    </main>
  );
}

export default function SuccessSida() {
  return (
    <Suspense fallback={null}>
      <SuccessInner />
    </Suspense>
  );
}
