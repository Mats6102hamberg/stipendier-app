import { notFound } from "next/navigation";
import Link from "next/link";
import { hamtaStipendium } from "@/app/actions";
import { formatBelopp, deadlineInfo } from "@/lib/format";
import BevakaForm from "@/app/components/BevakaForm";
import StipendiumActions from "@/app/components/StipendiumActions";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const s = await hamtaStipendium(id);
  if (!s) return { title: "Stipendium hittades inte" };
  return {
    title: `${s.namn} – Stipendiesök`,
    description: s.beskrivning,
  };
}

export default async function StipendiumPage({ params }: Props) {
  const { id } = await params;
  const s = await hamtaStipendium(id);
  if (!s) notFound();

  const dl = deadlineInfo(s.deadline);
  const belopp = formatBelopp(s.belopp, s.beloppMax) ?? "Ej angivet";

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition mb-6"
        >
          ← Tillbaka till sökning
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">{s.namn}</h1>
            <p className="text-gray-500 mt-1">{s.organisation}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-500 font-medium mb-1">Belopp</p>
              <p className="text-base font-semibold text-blue-800">{belopp}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-medium mb-1">Deadline</p>
              <p className={`text-base font-semibold ${dl.cls}`}>
                {dl.text}
                {dl.dagKvar !== null && dl.dagKvar >= 0 && (
                  <span className="block text-xs font-normal mt-0.5">
                    {dl.dagKvar === 0 ? "Idag!" : `${dl.dagKvar} dagar kvar`}
                  </span>
                )}
                {dl.dagKvar !== null && dl.dagKvar < 0 && (
                  <span className="block text-xs font-normal mt-0.5 text-red-400">Utgången</span>
                )}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Om stipendiet</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{s.beskrivning}</p>
          </div>

          <div className="space-y-2">
            {s.kategorier.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">Kategorier</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.kategorier.map((k) => (
                    <span key={k} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {s.målgrupp.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1.5">Målgrupp</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.målgrupp.map((m) => (
                    <span key={m} className="bg-purple-50 text-purple-600 text-xs px-2.5 py-1 rounded-full">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <StipendiumActions stipendium={{
            id: s.id, namn: s.namn, organisation: s.organisation,
            beskrivning: s.beskrivning, kategorier: s.kategorier, målgrupp: s.målgrupp,
          }} />

          {dl.dagKvar !== null && dl.dagKvar > 0 && (
            <BevakaForm stipendiumId={s.id} />
          )}

          {s.url && (
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition"
            >
              Ansök hos {s.organisation} →
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
