import type { Metadata } from "next";
import { Eyebrow, Global, PageHero } from "@/components/sections";
import { CentreGrid, MistSection } from "@/components/media-pages";
import { CENTRES } from "@/lib/pages-data";

export const metadata: Metadata = { title: "Global presence" };

export default function CentresPage() {
  return (
    <>
      <PageHero
        eyebrow="Global"
        title="800+ centres. 23 countries."
        intro="Wherever you are, there's a G-TEC centre close by. Pick your country to visit the regional site, or send an enquiry and we'll connect you with the nearest centre."
      >
        <a
          data-reveal="0.3"
          href="#directory"
          className="mt-9 inline-flex rounded-full bg-red px-7 py-4 text-[15px] font-bold shadow-[0_12px_32px_rgba(255,1,0,.38)] transition hover:-translate-y-0.5 hover:bg-red-dark"
        >
          Browse centres
        </a>
      </PageHero>
      <Global cta={false} />
      <div id="directory" className="scroll-mt-20">
        <MistSection>
          <Eyebrow>Centre directory</Eyebrow>
          <h2 className="font-display mb-10 text-[clamp(28px,3.4vw,44px)] leading-[1.06] font-bold tracking-[-.025em]">Find a centre near you</h2>
          <CentreGrid centres={CENTRES} />
        </MistSection>
      </div>
    </>
  );
}
