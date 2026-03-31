import type { StipendiumResult } from "@/app/actions";

function formatBelopp(belopp: number | null, beloppMax: number | null) {
  if (!belopp && belopp !== 0) return null;
  const fmt = (n: number) =>
    n === 0 ? "Varierar" : n.toLocaleString("sv-SE") + " kr";
  if (beloppMax && beloppMax > belopp)
    return `${fmt(belopp)} – ${fmt(beloppMax)}`;
  return fmt(belopp);
}

function deadlineFärg(deadline: Date | null): string {
  if (!deadline) return "text-gray-400";
  const dagKvar = Math.ceil(
    (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (dagKvar < 0) return "text-red-400 line-through";
  if (dagKvar <= 30) return "text-orange-500 font-semibold";
  return "text-green-600";
}

export default function StipendiumKort({ s }: { s: StipendiumResult }) {
  const belopp = formatBelopp(s.belopp, s.beloppMax);
  const deadlineStr = s.deadline
    ? new Date(s.deadline).toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold text-gray-900 text-base leading-snug">
            {s.namn}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{s.organisation}</p>
        </div>
        {belopp && (
          <span className="shrink-0 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {belopp}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">{s.beskrivning}</p>

      <div className="flex flex-wrap gap-1.5">
        {s.kategorier.map((k) => (
          <span
            key={k}
            className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
          >
            {k}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
        {deadlineStr ? (
          <span className={`text-xs ${deadlineFärg(s.deadline)}`}>
            Deadline: {deadlineStr}
          </span>
        ) : (
          <span className="text-xs text-gray-400">Ingen deadline angiven</span>
        )}
        {s.url && (
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Ansök →
          </a>
        )}
      </div>
    </div>
  );
}
