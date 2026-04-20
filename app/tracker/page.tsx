"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatBelopp, deadlineInfo } from "@/lib/format";

export type TrackerStatus =
  | "intresserad" | "ansökt" | "väntar"
  | "beviljat" | "avslaget" | "fel_period" | "ej_kvalificerad";

export type KorrespondensPost = {
  id: string;
  datum: string;
  text: string;
  status: TrackerStatus | null;
  sammanfattning: string;
  nästaSteg: string;
  försökIgen: string | null;
  uppmuntran: string;
};

type Stip = {
  id: string; namn: string; organisation: string; beskrivning: string;
  belopp: number | null; beloppMax: number | null; deadline: string | null;
  kategorier: string[]; målgrupp: string[]; url: string | null;
};

const AKTIVA_KOLUMNER: { status: TrackerStatus; label: string; färg: string; bg: string; dot: string }[] = [
  { status: "intresserad", label: "Intresserad",  färg: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200",  dot: "bg-yellow-400" },
  { status: "ansökt",      label: "Ansökt",       färg: "text-blue-700",   bg: "bg-blue-50 border-blue-200",      dot: "bg-blue-500" },
  { status: "väntar",      label: "Väntar svar",  färg: "text-purple-700", bg: "bg-purple-50 border-purple-200",  dot: "bg-purple-500" },
];

const STATUS_INFO: Record<TrackerStatus, { label: string; färg: string; bg: string }> = {
  intresserad:   { label: "Intresserad",    färg: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  ansökt:        { label: "Ansökt",         färg: "text-blue-700",   bg: "bg-blue-50 border-blue-200" },
  väntar:        { label: "Väntar svar",    färg: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  beviljat:      { label: "Beviljat!",      färg: "text-green-700",  bg: "bg-green-50 border-green-200" },
  avslaget:      { label: "Avslaget",       färg: "text-red-600",    bg: "bg-red-50 border-red-200" },
  fel_period:    { label: "Fel period",     färg: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  ej_kvalificerad: { label: "Ej kvalificerad", färg: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
};

function getTracker(): Record<string, TrackerStatus> {
  try { return JSON.parse(localStorage.getItem("stipendier_tracker") ?? "{}"); } catch { return {}; }
}
function setTrackerLS(t: Record<string, TrackerStatus>) {
  localStorage.setItem("stipendier_tracker", JSON.stringify(t));
}
function getKorrespondens(): Record<string, KorrespondensPost[]> {
  try { return JSON.parse(localStorage.getItem("stipendier_korrespondens") ?? "{}"); } catch { return {}; }
}
function setKorrespondensLS(k: Record<string, KorrespondensPost[]>) {
  localStorage.setItem("stipendier_korrespondens", JSON.stringify(k));
}

function KorrespondensPanel({
  stip, onStatusChange,
}: {
  stip: Stip;
  onStatusChange: (id: string, s: TrackerStatus) => void;
}) {
  const [poster, setPoster] = useState<KorrespondensPost[]>([]);
  const [visar, setVisar] = useState(false);
  const [text, setText] = useState("");
  const [laddar, setLaddar] = useState(false);

  useEffect(() => {
    const k = getKorrespondens();
    setPoster(k[stip.id] ?? []);
  }, [stip.id]);

  async function analyseraOchSpara() {
    if (!text.trim()) return;
    setLaddar(true);
    try {
      const res = await fetch("/api/ai/analys-svar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, stipendiumNamn: stip.namn, organisation: stip.organisation }),
      });
      const analys = await res.json();

      const post: KorrespondensPost = {
        id: Date.now().toString(),
        datum: new Date().toISOString(),
        text,
        status: analys.status ?? null,
        sammanfattning: analys.sammanfattning ?? "",
        nästaSteg: analys.nästaSteg ?? "",
        försökIgen: analys.försökIgen ?? null,
        uppmuntran: analys.uppmuntran ?? "",
      };

      const k = getKorrespondens();
      const uppdaterad = [post, ...(k[stip.id] ?? [])];
      k[stip.id] = uppdaterad;
      setKorrespondensLS(k);
      setPoster(uppdaterad);
      setText("");

      if (analys.status && analys.status !== "oklar" && analys.status !== "mer_info") {
        onStatusChange(stip.id, analys.status as TrackerStatus);
      }
    } catch {}
    setLaddar(false);
  }

  function läggTillNotering() {
    if (!text.trim()) return;
    const post: KorrespondensPost = {
      id: Date.now().toString(),
      datum: new Date().toISOString(),
      text,
      status: null,
      sammanfattning: text,
      nästaSteg: "",
      försökIgen: null,
      uppmuntran: "",
    };
    const k = getKorrespondens();
    const uppdaterad = [post, ...(k[stip.id] ?? [])];
    k[stip.id] = uppdaterad;
    setKorrespondensLS(k);
    setPoster(uppdaterad);
    setText("");
  }

  function taBortPost(id: string) {
    const k = getKorrespondens();
    k[stip.id] = (k[stip.id] ?? []).filter((p) => p.id !== id);
    setKorrespondensLS(k);
    setPoster(k[stip.id]);
  }

  const statusFärg: Record<string, string> = {
    beviljat: "bg-green-100 text-green-800",
    avslaget: "bg-red-100 text-red-800",
    fel_period: "bg-orange-100 text-orange-800",
    ej_kvalificerad: "bg-gray-100 text-gray-700",
    mer_info: "bg-blue-100 text-blue-800",
    oklar: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="mt-2">
      <button
        onClick={() => setVisar(!visar)}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition"
      >
        <span>{visar ? "▲" : "▼"}</span>
        Korrespondens {poster.length > 0 && <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">{poster.length}</span>}
      </button>

      {visar && (
        <div className="mt-2 space-y-3">
          {/* Inmatning */}
          <div className="space-y-1.5">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Klistra in e-postsvar eller skriv en notering..."
              rows={3}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <div className="flex gap-1.5">
              <button
                onClick={analyseraOchSpara}
                disabled={!text.trim() || laddar}
                className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition disabled:opacity-40"
              >
                {laddar ? "Analyserar..." : "Klistra in svar — AI analyserar"}
              </button>
              <button
                onClick={läggTillNotering}
                disabled={!text.trim()}
                className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition disabled:opacity-40"
              >
                Notering
              </button>
            </div>
          </div>

          {/* Historik */}
          {poster.length > 0 && (
            <div className="space-y-2 border-t border-gray-100 pt-2">
              {poster.map((p) => (
                <div key={p.id} className="bg-gray-50 rounded-lg p-2.5 text-xs space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-gray-400">{new Date(p.datum).toLocaleDateString("sv-SE")}</span>
                    {p.status && (
                      <span className={`px-2 py-0.5 rounded-full font-medium ${statusFärg[p.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {STATUS_INFO[p.status as TrackerStatus]?.label ?? p.status}
                      </span>
                    )}
                    <button onClick={() => taBortPost(p.id)} className="text-gray-300 hover:text-red-400 ml-auto transition">×</button>
                  </div>
                  {p.sammanfattning && <p className="text-gray-700 font-medium">{p.sammanfattning}</p>}
                  {p.nästaSteg && (
                    <div className="bg-blue-50 rounded px-2 py-1 text-blue-700">
                      <span className="font-medium">Nästa steg: </span>{p.nästaSteg}
                    </div>
                  )}
                  {p.försökIgen && (
                    <div className="bg-orange-50 rounded px-2 py-1 text-orange-700">
                      Försök igen: {p.försökIgen}
                    </div>
                  )}
                  {p.uppmuntran && <p className="text-gray-500 italic">{p.uppmuntran}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StipendiumKort({
  s, status, tracker, onFlytta, onTaBort,
}: {
  s: Stip; status: TrackerStatus;
  tracker: Record<string, TrackerStatus>;
  onFlytta: (id: string, s: TrackerStatus) => void;
  onTaBort: (id: string) => void;
}) {
  const [visaMenu, setVisaMenu] = useState(false);
  const dl = deadlineInfo(s.deadline ? new Date(s.deadline) : null);
  const bel = formatBelopp(s.belopp, s.beloppMax);
  const info = STATUS_INFO[status];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
      <Link href={`/stipendier/${s.id}`} className="block hover:text-blue-700 transition">
        <p className="text-xs font-semibold text-gray-900 leading-snug">{s.namn}</p>
        <p className="text-xs text-gray-400 mt-0.5">{s.organisation}</p>
      </Link>
      {bel && <p className="text-xs text-blue-600 font-medium mt-1">{bel}</p>}
      <p className={`text-xs mt-1 ${dl.cls}`}>{dl.text}</p>

      <div className="mt-2 flex items-center gap-1 flex-wrap">
        <div className="relative">
          <button
            onClick={() => setVisaMenu(!visaMenu)}
            className={`text-xs px-2 py-0.5 rounded-full border font-medium transition ${info.bg} ${info.färg}`}
          >
            {info.label} ▾
          </button>
          {visaMenu && (
            <div className="absolute left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 min-w-[160px] py-1">
              {(Object.keys(STATUS_INFO) as TrackerStatus[]).filter((st) => st !== status).map((st) => (
                <button
                  key={st}
                  onClick={() => { onFlytta(s.id, st); setVisaMenu(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition"
                >
                  {STATUS_INFO[st].label}
                </button>
              ))}
              <button
                onClick={() => { onTaBort(s.id); setVisaMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 border-t border-gray-100 transition"
              >
                Ta bort
              </button>
            </div>
          )}
        </div>
      </div>

      <KorrespondensPanel
        stip={s}
        onStatusChange={onFlytta}
      />
    </div>
  );
}

export default function TrackerSida() {
  const [tracker, setTrackerState] = useState<Record<string, TrackerStatus>>({});
  const [stipendier, setStipendier] = useState<Stip[]>([]);
  const [laddad, setLaddad] = useState(false);

  useEffect(() => {
    const t = getTracker();
    setTrackerState(t);
    const ids = Object.keys(t);
    if (ids.length === 0) { setLaddad(true); return; }

    fetch(`/api/stipendier?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then(setStipendier)
      .finally(() => setLaddad(true));
  }, []);

  function flytta(id: string, status: TrackerStatus) {
    const t = { ...tracker, [id]: status };
    setTrackerLS(t);
    setTrackerState(t);
  }

  function taBort(id: string) {
    const t = { ...tracker };
    delete t[id];
    setTrackerLS(t);
    setTrackerState(t);
  }

  const totalt = Object.keys(tracker).length;
  const beviljat = Object.values(tracker).filter((s) => s === "beviljat").length;

  const aktivaIds = Object.entries(tracker)
    .filter(([, s]) => ["intresserad", "ansökt", "väntar"].includes(s))
    .map(([id]) => id);

  const avslutadeIds = Object.entries(tracker)
    .filter(([, s]) => ["beviljat", "avslaget", "fel_period", "ej_kvalificerad"].includes(s))
    .map(([id]) => id);

  const getSt = (id: string) => stipendier.find((s) => s.id === id);

  if (!laddad) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mina ansökningar</h1>
            <p className="text-sm text-gray-500 mt-1">
              {totalt === 0
                ? "Inga stipendier sparade ännu."
                : `${totalt} stipendi${totalt === 1 ? "um" : "er"}${beviljat > 0 ? ` · ${beviljat} beviljat${beviljat > 1 ? "e" : ""}` : ""}`
              }
            </p>
          </div>
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 transition">+ Sök fler →</Link>
        </div>

        {totalt === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-gray-400 text-sm mb-4">Gå till ett stipendium och välj "Spara i tracker" för att börja hålla koll.</p>
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">
              Sök stipendier →
            </Link>
          </div>
        ) : (
          <div className="space-y-8">

            {/* ── Aktiva ──────────────────────────────────────── */}
            {aktivaIds.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Aktiva</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {AKTIVA_KOLUMNER.map((kol) => {
                    const ids = aktivaIds.filter((id) => tracker[id] === kol.status);
                    return (
                      <div key={kol.status}>
                        <div className={`flex items-center gap-2 mb-2 px-3 py-1.5 rounded-xl border ${kol.bg}`}>
                          <div className={`w-2 h-2 rounded-full ${kol.dot}`} />
                          <span className={`text-xs font-semibold ${kol.färg}`}>{kol.label}</span>
                          <span className={`text-xs ${kol.färg} opacity-60 ml-auto`}>{ids.length}</span>
                        </div>
                        <div className="space-y-2">
                          {ids.length === 0 && (
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 text-center">
                              <p className="text-xs text-gray-400">Tomt</p>
                            </div>
                          )}
                          {ids.map((id) => {
                            const s = getSt(id);
                            if (!s) return null;
                            return (
                              <StipendiumKort
                                key={id} s={s} status={tracker[id]}
                                tracker={tracker}
                                onFlytta={flytta} onTaBort={taBort}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Avslutade ────────────────────────────────────── */}
            {avslutadeIds.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Avslutade</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {avslutadeIds.map((id) => {
                    const s = getSt(id);
                    if (!s) return null;
                    const st = tracker[id];
                    const info = STATUS_INFO[st];
                    const dl = deadlineInfo(s.deadline ? new Date(s.deadline) : null);
                    const k = getKorrespondens()[id] ?? [];
                    const senaste = k[0];
                    return (
                      <div key={id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link href={`/stipendier/${id}`} className="block hover:text-blue-700 transition">
                              <p className="text-xs font-semibold text-gray-900 leading-snug truncate">{s.namn}</p>
                              <p className="text-xs text-gray-400">{s.organisation}</p>
                            </Link>
                          </div>
                          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${info.bg} ${info.färg}`}>
                            {info.label}
                          </span>
                        </div>
                        {st === "beviljat" && (
                          <p className="text-xs text-green-600 font-medium mt-1.5">Grattis!</p>
                        )}
                        {st === "fel_period" && senaste?.försökIgen && (
                          <p className="text-xs text-orange-600 mt-1.5">Försök igen: {senaste.försökIgen}</p>
                        )}
                        {senaste?.nästaSteg && st !== "beviljat" && (
                          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{senaste.nästaSteg}</p>
                        )}
                        <p className={`text-xs mt-1 ${dl.cls}`}>{dl.text}</p>
                        <KorrespondensPanel stip={s} onStatusChange={flytta} />
                        <button
                          onClick={() => { flytta(id, "intresserad"); }}
                          className="mt-2 text-xs text-blue-500 hover:text-blue-700 transition"
                        >
                          Flytta till aktiva →
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </main>
  );
}
