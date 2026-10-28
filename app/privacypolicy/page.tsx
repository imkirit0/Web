import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { PAGES } from "@/lib/content";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" intro="How G-TEC Education collects, uses and protects your information." />
      <section className="bg-mist py-16 text-ink">
        <div className="mx-auto w-[min(860px,100%)] px-6">
          <article className="prose-gtec rounded-[28px] bg-white p-[clamp(24px,4vw,48px)] ring-1 ring-ink/6" dangerouslySetInnerHTML={{ __html: PAGES["/privacypolicy"].html }} />
        </div>
      </section>
    </>
  );
}
