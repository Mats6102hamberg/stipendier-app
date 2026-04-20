"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LandsVelger from "./LandsVelger";
import { useT } from "@/lib/i18n";

function NavInner() {
  const path = usePathname();
  const params = useSearchParams();
  const land = params.get("land");
  const tr = useT(land);
  const isAdmin = path.startsWith("/admin");
  if (isAdmin) return null;

  const LÄNKAR = [
    { href: land ? `/?land=${land}` : "/", label: tr.navSearch },
    { href: "/ai", label: tr.navAi },
    { href: "/tracker", label: tr.navTracker },
    { href: "/profil", label: tr.navProfile },
    { href: "/premium", label: tr.navPremium },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-0.5 h-12 overflow-x-auto">
        <Link href={land ? `/?land=${land}` : "/"} className="font-bold text-blue-600 text-sm mr-3 shrink-0 tracking-tight">
          {tr.appName}
        </Link>
        {LÄNKAR.map(({ href, label }) => {
          const isActive = href === "/" || href === `/?land=${land}`
            ? path === "/"
            : path === href || path.startsWith(href + "/");
          return (
            <Link
              key={label}
              href={href}
              className={`text-xs px-3 py-1.5 rounded-lg shrink-0 transition whitespace-nowrap ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {label}
            </Link>
          );
        })}
        <div className="ml-auto shrink-0">
          <Suspense fallback={null}>
            <LandsVelger />
          </Suspense>
        </div>
      </div>
    </nav>
  );
}

export default function Nav() {
  return (
    <Suspense fallback={null}>
      <NavInner />
    </Suspense>
  );
}
