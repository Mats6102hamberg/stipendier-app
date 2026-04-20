"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import StipendiumKort from "@/app/components/StipendiumKort";
import type { StipendiumResult } from "@/app/actions";
import { usePremium } from "@/lib/usePremium";

type Meddelande = {
  role: "user" | "assistant";
  content: string;
};

type Match = {
  id: string;
  namn: string;
  organisation: string;
  anledning: string;
};

const STARTFRÅGOR = [
  "Jag studerar ekonomi och vill göra utbyte utomlands",
  "Jag är doktorand inom medicin och söker forskningsanslag",
  "Jag har utländsk bakgrund och studerar på KTH",
  "Jag är lärare och vill forska om pedagogik",
];

function extractMatches(text: string): { text: string; matches: Match[] } {
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (!jsonMatch) return { text, matches: [] };
  try {
    const { matches } = JSON.parse(jsonMatch[1]);
    return {
      text: text.replace(/```json\n[\s\S]*?\n```/, "").trim(),
      matches: matches ?? [],
    };
  } catch {
    return { text, matches: [] };
  }
}

export default function AiPage() {
  const [meddelanden, setMeddelanden] = useState<Meddelande[]>([]);
  const [input, setInput] = useState("");
  const [laddar, setLaddar] = useState(false);
  const [matchande, setMatchande] = useState<StipendiumResult[]>([]);
  const [land, setLand] = useState("SE");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { premium, laddad: premiumLaddad, premiumHeaders } = usePremium();

  useEffect(() => {
    const sparatLand = localStorage.getItem("stipendier_land") ?? "SE";
    setLand(sparatLand);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [meddelanden, laddar]);

  async function skicka(text?: string) {
    const innehåll = text ?? input.trim();
    if (!innehåll || laddar) return;
    setInput("");

    const nyaMeddelanden: Meddelande[] = [
      ...meddelanden,
      { role: "user", content: innehåll },
    ];
    setMeddelanden(nyaMeddelanden);
    setLaddar(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...premiumHeaders() },
        body: JSON.stringify({ messages: nyaMeddelanden, land }),
      });

      if (res.status === 402) {
        setMeddelanden([...nyaMeddelanden, {
          role: "assistant",
          content: "AI-rådgivaren kräver Premium. [Uppgradera här](/premium) för 79 kr/mån — ett stipendium betalar det 200 gånger om.",
        }]);
        setLaddar(false);
        return;
      }
      if (!res.body) throw new Error("Inget svar");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullSvar = "";

      setMeddelanden([...nyaMeddelanden, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullSvar += decoder.decode(value, { stream: true });
        setMeddelanden([
          ...nyaMeddelanden,
          { role: "assistant", content: fullSvar },
        ]);
      }

      // Extrahera matchande stipendier och hämta full data
      const { matches } = extractMatches(fullSvar);
      if (matches.length > 0) {
        const ids = matches.map((m) => m.id).join(",");
        const data = await fetch(`/api/stipendier?ids=${ids}`).then((r) =>
          r.json()
        );
        setMatchande(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLaddar(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      skicka();
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col">
      {/* Header */}
      <div className="max-w-3xl w-full mx-auto px-4 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ✨ AI-stipendierådgivare
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Berätta om dig — jag hittar stipendier som passar just dig.
          </p>
        </div>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
          ← Sök manuellt
        </Link>
      </div>

      <div className="max-w-3xl w-full mx-auto px-4 flex-1 flex flex-col gap-4 pb-4">
        {/* Chattfönster */}
        <div className="flex-1 flex flex-col gap-3 min-h-[300px]">
          {meddelanden.length === 0 && (
            <div className="space-y-4 py-6">
              <p className="text-sm text-gray-500 text-center">
                Välj ett ämne eller beskriv din situation fritt:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {STARTFRÅGOR.map((f) => (
                  <button
                    key={f}
                    onClick={() => skicka(f)}
                    className="text-left px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm text-gray-700 hover:border-blue-300 hover:shadow-sm transition"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {meddelanden.map((m, i) => {
            const { text, matches } =
              m.role === "assistant" ? extractMatches(m.content) : { text: m.content, matches: [] };

            return (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {text}
                  {matches.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
                      {matches.map((match) => (
                        <div key={match.id} className="text-xs text-blue-600">
                          ★ {match.namn} — {match.anledning}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {laddar && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Matchande stipendier */}
        {matchande.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Matchande stipendier
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {matchande.map((s) => (
                <StipendiumKort key={s.id} s={s} />
              ))}
            </div>
          </div>
        )}

        {/* Inmatning */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3 flex gap-2 items-end">
          <textarea
            ref={inputRef}
            rows={2}
            placeholder="Berätta om dig och vad du vill studera eller forska om..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 resize-none text-sm focus:outline-none text-gray-800 placeholder-gray-400"
          />
          <button
            onClick={() => skicka()}
            disabled={!input.trim() || laddar}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-40 shrink-0"
          >
            Skicka
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center -mt-2">
          Enter för att skicka · Shift+Enter för ny rad
        </p>
      </div>
    </main>
  );
}
