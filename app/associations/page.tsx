import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Band, card } from "@/components/about-pages";
import { PAGES } from "@/lib/content";

export const metadata: Metadata = { title: "Associations", description: "G-TEC associate partners: colleges, schools and institutions working with G-TEC centres." };

const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

/** Rows of the live page's partner table: [college/school, G-TEC centre, location]. */
function partners() {
  const rows = [...(PAGES["/associations"]?.html ?? "").matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
    .map((m) => [...m[1].matchAll(/<td>([\s\S]*?)<\/td>/g)].map((c) => decode(c[1])))
    .filter((r) => r.length === 3 && r[0]);
  const byLocation = new Map<string, string[][]>();
  for (const r of rows) byLocation.set(r[2], [...(byLocation.get(r[2]) ?? []), r]);
  return { total: rows.length, groups: [...byLocation].sort((a, b) => b[1].length - a[1].length) };
}

export default function AssociationsPage() {
  const { total, groups } = partners();
  return (
    <>
      <PageHero
        eyebrow="G-TEC associate partners"
        title="Strong associations, stronger impact."
        intro="G-TEC EDUCATION also provides for the establishment of associations between universities, colleges and schools."
      />

      <Band eyebrow="Our partners" title={`${total} colleges, schools and institutions.`} intro={<p>Grouped by location, with the G-TEC centre or college each partner works with.</p>}>
        <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
          {groups.map(([loc, rows]) => (
            <section key={loc} className={`${card} mb-4 break-inside-avoid p-6`}>
              <h3 className="font-display flex items-center gap-2 text-lg font-bold">
                <MapPin className="size-4 text-red" /> {loc}
                <span className="ml-auto rounded-full bg-ice px-2.5 py-0.5 text-xs font-bold text-blue">{rows.length}</span>
              </h3>
              <ul className="mt-4 grid divide-y divide-ink/6">
                {rows.map(([college, centre], i) => (
                  <li key={i} className="py-2.5">
                    <p className="text-[14px] leading-snug font-semibold text-ink">{college}</p>
                    <p className="mt-0.5 text-[13px] text-ink-2">G-TEC {centre}</p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Band>
    </>
  );
}
