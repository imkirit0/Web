import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { Band, card, pageImages } from "@/components/about-pages";

export const metadata: Metadata = { title: "G-TEC International", description: "G-TEC Education centres worldwide, from India to the Middle East, Africa, Asia, Europe and the Americas." };

// Same order as the flags on the live page.
const COUNTRIES = ["Africa", "Australia", "Bahrain", "Egypt", "Ghana", "India", "Iran", "Kenya", "Kuwait", "Malawi", "Malaysia", "Mexico", "Oman", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "Sri Lanka", "Tanzania", "UAE", "UK", "USA", "Zambia"];

const REGIONS = [
  ["The Americas, Europe & Oceania", "Our training centre in Mexico, Latin America, is one of the farthest from where we began. From there to the USA, UK, Australia and Singapore, we've had the privilege of being part of learning journeys all around the world."],
  ["Middle East & Asia", "We have spread our education and upskilling training across the UAE, Saudi Arabia, Oman, Bahrain, Qatar, Kuwait, Malaysia, Iran, Sri Lanka and the Philippines, providing useful skills that make a real difference in each student's life."],
  ["Africa", "Our presence in Africa holds significant value. With established centres in Tanzania, Zambia, Ghana, Kenya, Malawi and Zimbabwe, we are happy to reach out to local communities and provide impactful education and skill development."],
];

export default function InternationalPage() {
  const flags = pageImages("/gtecinternational");
  return (
    <>
      <PageHero
        eyebrow="G-TEC International"
        title="We have our centres worldwide."
        intro="We believe quality education should have no borders. G-TEC started with a small centre in the Malabar region of Kerala, India, and now reaches learners in many countries."
      />

      <Band>
        <div className="grid gap-4 md:grid-cols-3">
          {REGIONS.map(([t, d]) => (
            <article key={t} className={`${card} p-7`}>
              <h2 className="font-display text-xl font-bold tracking-tight">{t}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{d}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-[760px] text-[17px] leading-relaxed text-ink-2">
          G-TEC is growing across the world to make good education available to everyone. It&apos;s not just about opening new centres, it&apos;s about connecting with people, sharing knowledge and creating opportunities, supporting one student at a time.
        </p>
      </Band>

      <Band dark eyebrow="Our presence" title="Where you'll find G-TEC.">
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,150px),1fr))] gap-3">
          {COUNTRIES.map((c, i) => (
            <li key={c} className="flex items-center gap-3 rounded-[18px] border border-white/10 bg-white/[.04] p-3">
              {flags[i] && <img src={flags[i]} alt="" loading="lazy" className="h-9 w-12 flex-none rounded-md object-cover ring-1 ring-white/10" />}
              <span className="text-[15px] font-semibold">{c}</span>
            </li>
          ))}
        </ul>
      </Band>
    </>
  );
}
