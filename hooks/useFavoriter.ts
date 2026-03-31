"use client";

import { useEffect, useState } from "react";

const KEY = "stipendier-favoriter";

export function useFavoriter() {
  const [favoriter, setFavoriter] = useState<string[]>([]);

  useEffect(() => {
    try {
      const sparade = localStorage.getItem(KEY);
      if (sparade) setFavoriter(JSON.parse(sparade));
    } catch {}
  }, []);

  function toggleFavorit(id: string) {
    setFavoriter((prev) => {
      const nästa = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(nästa));
      return nästa;
    });
  }

  return { favoriter, toggleFavorit };
}
