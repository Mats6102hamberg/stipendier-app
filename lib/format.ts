export function formatBelopp(
  belopp: number | null,
  beloppMax: number | null
): string | null {
  if (belopp == null) return null;
  const fmt = (n: number) =>
    n === 0 ? "Varierar" : n.toLocaleString("sv-SE") + " kr";
  if (beloppMax && beloppMax > belopp) return `${fmt(belopp)} – ${fmt(beloppMax)}`;
  return fmt(belopp);
}

export function deadlineInfo(deadline: Date | null): {
  text: string;
  cls: string;
  dagKvar: number | null;
} {
  if (!deadline) return { text: "Ingen deadline", cls: "text-gray-400", dagKvar: null };
  const dagKvar = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const text = new Date(deadline).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  if (dagKvar < 0) return { text, cls: "text-red-400 line-through", dagKvar };
  if (dagKvar <= 14)
    return {
      text: `⚡ ${text} (${dagKvar} dagar kvar)`,
      cls: "text-orange-500 font-semibold",
      dagKvar,
    };
  if (dagKvar <= 30) return { text, cls: "text-orange-400 font-medium", dagKvar };
  return { text, cls: "text-green-600", dagKvar };
}
