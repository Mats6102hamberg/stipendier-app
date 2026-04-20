"use client";
import { useState, useEffect } from "react";

export type Profil = {
  namn: string;
  email: string;
  ämne: string;
  nivå: string;
  intressen: string;
  mål: string;
  bakgrund: string;
};

export const PROFIL_TOM: Profil = {
  namn: "", email: "", ämne: "", nivå: "student",
  intressen: "", mål: "", bakgrund: "",
};

export function useProfil() {
  const [profil, setProfil] = useState<Profil>(PROFIL_TOM);
  const [laddad, setLaddad] = useState(false);

  useEffect(() => {
    try {
      const sparad = localStorage.getItem("stipendier_profil");
      if (sparad) setProfil(JSON.parse(sparad));
    } catch {}
    setLaddad(true);
  }, []);

  function sparaProfil(ny: Profil) {
    setProfil(ny);
    localStorage.setItem("stipendier_profil", JSON.stringify(ny));
  }

  const harProfil = laddad && Boolean(profil.ämne || profil.intressen || profil.mål);

  return { profil, sparaProfil, laddad, harProfil };
}

export function profilTillText(p: Profil): string {
  const delar: string[] = [];
  if (p.namn) delar.push(`Namn: ${p.namn}`);
  if (p.ämne) delar.push(`Studieområde: ${p.ämne}`);
  if (p.nivå) delar.push(`Nivå: ${p.nivå}`);
  if (p.intressen) delar.push(`Intressen: ${p.intressen}`);
  if (p.mål) delar.push(`Mål: ${p.mål}`);
  if (p.bakgrund) delar.push(`Bakgrund: ${p.bakgrund}`);
  return delar.join("\n");
}
