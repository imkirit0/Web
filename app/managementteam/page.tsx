import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Band, pageImages } from "@/components/about-pages";

export const metadata: Metadata = { title: "Management Team", description: "The people behind G-TEC Education." };

export default function ManagementTeamPage() {
  const [team] = pageImages("/managementteam");
  return (
    <>
      <PageHero
        eyebrow="Management team"
        title="The team behind G-TEC."
        intro="A young, experienced, dynamic and enthusiastic team of Software and Networking Engineers, Functional Experts and Management professionals."
      />

      <Band>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {team && <img src={team} alt="The G-TEC management team" className="w-full rounded-[28px] object-cover" />}
          <div className="grid gap-5 text-[17px] leading-relaxed text-ink-2">
            <p>G-TEC is dedicated to providing quality IT education and academic excellence by staying updated with the latest trends in teaching and learning. We focus on having the right resources, trained staff, clear policies, proper systems and a positive work culture, and we make sure we stay up to date.</p>
            <p>The hard work, creativity and active efforts of everyone are the key strengths that help us achieve our quality goals and policies.</p>
          </div>
        </div>
      </Band>

      <Band dark eyebrow="Expertise" title="Skilled professionals with international exposure.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Technical", "Our technical experts have strong backgrounds in their fields and years of training experience."],
            ["Management", "Knowledge-based education delivered by skilled and experienced professionals across management and functional areas."],
            ["Long-term commitment", "Their long-term association with G-TEC and proven expertise help ensure every task is done efficiently and with high quality."],
          ].map(([t, d]) => (
            <article key={t} className="rounded-[28px] border border-white/10 bg-white/[.04] p-7">
              <h3 className="font-display text-xl font-bold">{t}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/65">{d}</p>
            </article>
          ))}
        </div>
        <Link href="/ouroffices" className="mt-10 inline-flex items-center gap-2 rounded-full bg-red px-7 py-3.5 text-[15px] font-bold transition hover:bg-red-dark">
          Contact us <ArrowRight className="size-4" />
        </Link>
      </Band>
    </>
  );
}
