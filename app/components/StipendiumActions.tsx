"use client";
import { useState, useRef } from "react";
import { useProfil, profilTillText } from "@/lib/useProfile";

type Stipendium = {
  id: string;
  namn: string;
  organisation: string;
  beskrivning: string;
  kategorier: string[];
  målgrupp: string[];
};

type TrackerStatus = "intresserad" | "ansökt" | "väntar" | "beviljat" | "avslaget" | "fel_period" | "ej_kvalificerad";
const TRACKER_STATUSES: { value: TrackerStatus; label: string; color: string }[] = [
  { value: "intresserad",    label: "Intresserad",     color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { value: "ansökt",         label: "Ansökt",          color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "väntar",         label: "Väntar svar",     color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "beviljat",       label: "Beviljat!",       color: "bg-green-50 text-green-700 border-green-200" },
  { value: "avslaget",       label: "Avslaget",        color: "bg-red-50 text-red-600 border-red-200" },
  { value: "fel_period",     label: "Fel period",      color: "bg-orange-50 text-orange-600 border-orange-200" },
  { value: "ej_kvalificerad",label: "Ej kvalificerad", color: "bg-gray-50 text-gray-500 border-gray-200" },
];

function getTracker(): Record<string, TrackerStatus> {
  try { return JSON.parse(localStorage.getItem("stipendier_tracker") ?? "{}"); } catch { return {}; }
}
function setTracker(t: Record<string, TrackerStatus>) {
  localStorage.setItem("stipendier_tracker", JSON.stringify(t));
}

export default function StipendiumActions({ stipendium }: { stipendium: Stipendium }) {
  const { profil, laddad } = useProfil();
  const [visaPassar, setVisaPassar] = useState(false);
  const [visaAnsok, setVisaAnsok] = useState(false);
  const [passarResultat, setPassarResultat] = useState<{
    poäng: number; maxPoäng: number; träffar: string[]; saknas: string[]; sammanfattning: string;
  } | null>(null);
  const [passarLaddar, setPassarLaddar] = useState(false);
  const [ansokText, setAnsokText] = useState("");
  const [ansokExtra, setAnsokExtra] = useState("");
  const [ansokLaddar, setAnsokLaddar] = useState(false);
  const [kopierat, setKopierat] = useState(false);
  const [trackerStatus, setTrackerStatusState] = useState<TrackerStatus | null>(() => {
    if (typeof window === "undefined") return null;
    return getTracker()[stipendium.id] ?? null;
  });
  const [visaTrackerMenu, setVisaTrackerMenu] = useState(false);
  const ansokRef = useRef<HTMLTextAreaElement>(null);

  if (!laddad) return null;

  const profilText = profilTillText(profil);

  async function checkPassar() {
    setVisaPassar(true);
    if (passarResultat) return;
    setPassarLaddar(true);
    try {
      const res = await fetch("/api/ai/passa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stipendiumId: stipendium.id, profilText }),
      });
      setPassarResultat(await res.json());
    } catch { setPassarResultat(null); }
    setPassarLaddar(false);
  }

  async function skrivAnsok() {
    setVisaAnsok(true);
    if (ansokText) return;
    setAnsokLaddar(true);
    setAnsokText("");
    try {
      const res = await fetch("/api/ai/ansok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stipendiumId: stipendium.id, profilText, extra: ansokExtra }),
      });
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let result = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setAnsokText(result);
      }
    } catch {}
    setAnsokLaddar(false);
  }

  function sparaTracker(status: TrackerStatus) {
    const t = getTracker();
    t[stipendium.id] = status;
    setTracker(t);
    setTrackerStatusState(status);
    setVisaTrackerMenu(false);
  }

  function taBortTracker() {
    const t = getTracker();
    delete t[stipendium.id];
    setTracker(t);
    setTrackerStatusState(null);
    setVisaTrackerMenu(false);
  }

  function kopiera() {
    navigator.clipboard.writeText(ansokText).then(() => {
      setKopierat(true);
      setTimeout(() => setKopierat(false), 2000);
    });
  }

  const aktuelltStatus = TRACKER_STATUSES.find((s) => s.value === trackerStatus);

  return (
    <div className="space-y-3">
      {/* Knappar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={checkPassar}
          className="flex-1 min-w-[120px] py-2.5 px-4 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-sm font-medium hover:bg-purple-100 transition"
        >
          Passar jag?
        </button>
        <button
          onClick={() => { setAnsokText(""); skrivAnsok(); }}
          className="flex-1 min-w-[120px] py-2.5 px-4 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-medium hover:bg-green-100 transition"
        >
          Skriv ansökan
        </button>
        <div className="relative">
          <button
            onClick={() => setVisaTrackerMenu(!visaTrackerMenu)}
            className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition ${
              aktuelltStatus
                ? aktuelltStatus.color
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {aktuelltStatus ? aktuelltStatus.label : "Spara i tracker"}
          </button>
          {visaTrackerMenu && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10 min-w-[160px] py-1">
              {TRACKER_STATUSES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => sparaTracker(s.value)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition"
                >
                  {s.label}
                </button>
              ))}
              {trackerStatus && (
                <button
                  onClick={taBortTracker}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 border-t border-gray-100 transition"
                >
                  Ta bort från tracker
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Passar-jag-panel */}
      {visaPassar && (
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-purple-900">Passar jag?</h3>
            <button onClick={() => setVisaPassar(false)} className="text-purple-400 hover:text-purple-700 text-lg leading-none">×</button>
          </div>
          {passarLaddar && (
            <div className="flex items-center gap-2 text-purple-600 text-sm">
              <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
              Analyserar...
            </div>
          )}
          {!passarLaddar && !profil.ämne && !profil.intressen && (
            <p className="text-sm text-purple-700">
              <a href="/profil" className="underline font-medium">Fyll i din profil</a> för en personlig analys.
            </p>
          )}
          {passarResultat && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: passarResultat.maxPoäng }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-5 h-5 rounded-full ${i < passarResultat.poäng ? "bg-purple-500" : "bg-purple-200"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-purple-800">
                  {passarResultat.poäng}/{passarResultat.maxPoäng} krav matchade
                </span>
              </div>
              <p className="text-sm text-purple-800 font-medium">{passarResultat.sammanfattning}</p>
              {passarResultat.träffar.length > 0 && (
                <ul className="space-y-1">
                  {passarResultat.träffar.map((t, i) => (
                    <li key={i} className="text-xs text-green-700 flex gap-1.5">
                      <span>✓</span>{t}
                    </li>
                  ))}
                </ul>
              )}
              {passarResultat.saknas.length > 0 && (
                <ul className="space-y-1">
                  {passarResultat.saknas.map((t, i) => (
                    <li key={i} className="text-xs text-orange-600 flex gap-1.5">
                      <span>?</span>{t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ansökningsskrivarpanel */}
      {visaAnsok && (
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-green-900">AI-ansökningsskrivare</h3>
            <button onClick={() => setVisaAnsok(false)} className="text-green-400 hover:text-green-700 text-lg leading-none">×</button>
          </div>
          {!ansokText && !ansokLaddar && (
            <div className="space-y-3">
              {!profil.ämne && (
                <p className="text-xs text-green-700">
                  Tips: <a href="/profil" className="underline font-medium">Fyll i din profil</a> för ett mer personligt brev.
                </p>
              )}
              <textarea
                ref={ansokRef}
                value={ansokExtra}
                onChange={(e) => setAnsokExtra(e.target.value)}
                placeholder="Något extra att lyfta fram? (t.ex. specifika meriter, projekt eller erfarenheter)"
                className="w-full text-sm border border-green-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                rows={3}
              />
              <button
                onClick={skrivAnsok}
                className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition"
              >
                Generera ansökningsbrev
              </button>
            </div>
          )}
          {ansokLaddar && (
            <div className="flex items-center gap-2 text-green-700 text-sm mb-2">
              <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin" />
              Skriver ditt brev...
            </div>
          )}
          {ansokText && (
            <div className="space-y-3">
              <div className="bg-white border border-green-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                {ansokText}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={kopiera}
                  className="flex-1 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition"
                >
                  {kopierat ? "Kopierat!" : "Kopiera text"}
                </button>
                <button
                  onClick={() => { setAnsokText(""); skrivAnsok(); }}
                  className="px-4 py-2 border border-green-200 text-green-700 rounded-xl text-sm hover:bg-green-100 transition"
                >
                  Generera nytt
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
