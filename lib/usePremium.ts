"use client";
import { useState, useEffect } from "react";

export function usePremium() {
  const [premium, setPremium] = useState(false);
  const [laddad, setLaddad] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("stipendier_token");
    const cachedEmail = localStorage.getItem("stipendier_email");
    if (cachedEmail) setEmail(cachedEmail);

    if (!token) { setLaddad(true); return; }

    // Kolla cache (5 min — kort för att fånga webhook-uppdateringar)
    const cached = localStorage.getItem("stipendier_premium_cache");
    if (cached) {
      try {
        const { premium: p, expires } = JSON.parse(cached);
        if (Date.now() < expires) { setPremium(p); setLaddad(true); return; }
      } catch {
        localStorage.removeItem("stipendier_premium_cache");
      }
    }

    fetch("/api/auth/verify", {
      headers: { "x-premium-token": token },
    })
      .then((r) => r.json())
      .then(({ premium: p, email: e }) => {
        setPremium(p);
        if (e) { setEmail(e); localStorage.setItem("stipendier_email", e); }
        localStorage.setItem("stipendier_premium_cache", JSON.stringify({
          premium: p, expires: Date.now() + 5 * 60 * 1000,
        }));
      })
      .catch((err) => console.error("[usePremium] verify failed", err))
      .finally(() => setLaddad(true));
  }, []);

  function getToken(): string | null {
    return localStorage.getItem("stipendier_token");
  }

  function premiumHeaders(): Record<string, string> {
    const token = getToken();
    return token ? { "x-premium-token": token } : {};
  }

  return { premium, laddad, email, premiumHeaders };
}
