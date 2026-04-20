"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const LAND = [
  { kode: "SE", flagg: "🇸🇪", navn: "Sverige" },
  { kode: "NO", flagg: "🇳🇴", navn: "Norge" },
  { kode: "DK", flagg: "🇩🇰", navn: "Danmark" },
  { kode: "FI", flagg: "🇫🇮", navn: "Suomi" },
  { kode: "DE", flagg: "🇩🇪", navn: "Deutschland" },
  { kode: "GB", flagg: "🇬🇧", navn: "UK" },
];

export default function LandsVelger() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [aktivt, setAktivt] = useState("SE");

  useEffect(() => {
    const fraSP = searchParams.get("land");
    const fraLS = localStorage.getItem("stipendier_land");
    const land = fraSP ?? fraLS ?? "SE";
    setAktivt(land);
    if (!fraSP && fraLS && fraLS !== "SE") {
      if (pathname === "/") {
        const params = new URLSearchParams(searchParams.toString());
        params.set("land", fraLS);
        router.replace(`/?${params.toString()}`);
      }
    }
  }, []);

  function bytt(kode: string) {
    localStorage.setItem("stipendier_land", kode);
    setAktivt(kode);
    if (pathname === "/" || pathname === "/ai") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("land", kode);
      router.push(`${pathname}?${params.toString()}`);
    } else {
      router.push(`/?land=${kode}`);
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {LAND.map((l) => (
        <button
          key={l.kode}
          onClick={() => bytt(l.kode)}
          title={l.navn}
          className={`px-2 py-1 rounded-lg text-base transition ${
            aktivt === l.kode
              ? "bg-blue-50 ring-1 ring-blue-300"
              : "hover:bg-gray-100 opacity-60 hover:opacity-100"
          }`}
        >
          {l.flagg}
        </button>
      ))}
    </div>
  );
}
