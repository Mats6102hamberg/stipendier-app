import { notFound } from "next/navigation";
import Link from "next/link";
import { hamtaStipendium } from "@/app/actions";
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

function formatBelopp(belopp: number | null, beloppMax: number | null) {
  if (!belopp && belopp !== 0) return "Ej angivet";
  const fmt = (n: number) =>
    n === 0 ? "Varierar" : n.toLocaleString("sv-SE") + " kr";
  if (beloppMax && beloppMax > belopp)
    return `${fmt(belopp)} – ${fmt(beloppMax)}`;
  return fmt(belopp);
}

function deadlineFärg(deadline: Date | null): string {
  if (!deadline) return "text-gray-500";
  const dagKvar = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (dagKvar < 0) return "text-red-500";
  if (dagKvar <= 30) return "text-orange-500 font-semibold";
  return "text-green-600";
}

export default async function StipendiumPage({ params }: Props) {
  const { id } = await params;
  const s = await hamtaStipendium(id);
  if (!s) notFound();

  const deadlineStr = s.deadline
    ? new Date(s.deadline).toLocaleDateString("sv-SE", {
        year: "numeric", month: "long", day: "numeric",
      })
    : null;

  const dagKvar = s.deadline
    ? Math.ceil((new Date(s.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Tillbaka */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition mb-6"
        >
          ← Tillbaka till sökning
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          {/* Rubrik */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-snug">{s.namn}</h1>
            <p className="text-gray-500 mt-1">{s.organisation}</p>
          </div>

          {/* Metadata-grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-500 font-medium mb-1">Belopp</p>
              <p className="text-base font-semibold text-blue-800">
                {formatBelopp(s.belopp, s.beloppMax)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-medium mb-1">Deadline</p>
              {deadlineStr ? (
                <p className={`text-base font-semibold ${deadlineFärg(s.deadline)}`}>
                  {deadlineStr}
                  {dagKvar !== null && dagKvar >= 0 && (
                    <span className="block text-xs font-normal mt-0.5">
                      {dagKvar === 0 ? "Idag!" : `${dagKvar} dagar kvar`}
                    </span>
                  )}
                  {dagKvar !== null && dagKvar < 0 && (
                    <span className="block text-xs font-normal mt-0.5 text-red-400">
                      Utgången
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-base font-semibold text-gray-400">Ingen deadline</p>
              )}
            </div>
          </div>

          {/* Beskrivning */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Om stipendiet</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{s.beskrivning}</p>
          </div>

          {/* Kategorier + målgrupp */}
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

          {/* CTA */}
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
