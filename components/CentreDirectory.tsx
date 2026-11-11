"use client";

import { useDeferredValue, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, Search } from "lucide-react";
import { fieldClass } from "@/components/SiteForm";

export type DirCentre = { slug: string; name: string; address: string; phones: string[]; email: string; image: string | null; country: string };

// Bare 10-digit numbers on the live site are Indian; anything else already carries its country code.
const tel = (p: string, country: string) => {
  const d = p.replace(/[^\d+]/g, "");
  return `tel:${d.startsWith("+") ? d : country === "India" && d.length === 10 ? `+91${d}` : d.length > 10 ? `+${d}` : d}`;
};

export function CentreDirectory({ centres, detail }: { centres: DirCentre[]; detail: string[] }) {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("All");
  const query = useDeferredValue(q.trim().toLowerCase());
  const countries = ["All", ...new Set(centres.map((c) => c.country))];
  const shown = centres.filter(
    (c) => (country === "All" || c.country === country) && (!query || `${c.name} ${c.address}`.toLowerCase().includes(query)),
  );

  return (
    <>
      <div className="mb-8 grid gap-4">
        <label className="relative block max-w-[560px]">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/40" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by centre, town, district or PIN"
            aria-label="Search centres"
            className={`${fieldClass} bg-white pl-11`}
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by country">
          {countries.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={country === c}
              onClick={() => setCountry(c)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${country === c ? "bg-navy text-white ring-navy" : "bg-white text-ink-2 ring-ink/10 hover:ring-blue/40"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="text-sm font-semibold text-ink-2" aria-live="polite">{shown.length} centre{shown.length === 1 ? "" : "s"} found</p>
      </div>

      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5">
        {shown.map((c) => (
          <li key={c.slug} className="flex flex-col overflow-hidden rounded-[24px] bg-white ring-1 ring-ink/[.07] shadow-card">
            {c.image && <img src={encodeURI(decodeURI(c.image))} alt="" loading="lazy" className="aspect-[16/9] w-full bg-ice object-cover" />}
            <div className="flex flex-1 flex-col gap-3 p-6">
              <h3 className="font-display text-lg leading-snug font-bold tracking-tight">{c.name}</h3>
              <p className="flex gap-2 text-sm leading-relaxed text-ink-2"><MapPin className="mt-0.5 size-4 flex-none text-red" /> {c.address}</p>
              <div className="mt-auto grid gap-1.5 pt-2 text-sm font-semibold">
                {c.phones.map((p) => (
                  <a key={p} href={tel(p, c.country)} className="flex items-center gap-2 hover:text-blue"><Phone className="size-4 flex-none text-blue" /> {p}</a>
                ))}
                {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-2 [overflow-wrap:anywhere] hover:text-blue"><Mail className="size-4 flex-none text-blue" /> {c.email}</a>}
              </div>
              {detail.includes(c.slug) && (
                <Link href={`/centres/${c.slug}`} className="inline-flex items-center gap-1.5 pt-1 text-sm font-bold text-blue">View centre <ArrowUpRight className="size-4" /></Link>
              )}
            </div>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="py-16 text-center text-ink-2">No centres match that search.</p>}
    </>
  );
}
