import type { Metadata } from "next";
import { Enquire, PageHero } from "@/components/sections";
import { wrap } from "@/components/student-pages";

export const metadata: Metadata = { title: "Enquire About a Course", description: "Ask G-TEC Education about any course or certification." };

export default function EnquirePage() {
  return (
    <>
      <PageHero
        eyebrow="Enquire about a course"
        title="Looking for details on our courses?"
        intro="For any information on individual courses and certifications, use the form below and we will write back to you."
      />
      <section className="bg-navy pb-[clamp(64px,8vw,112px)] text-white">
        <div className={wrap}>
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-deep">
            <Enquire />
          </div>
        </div>
      </section>
    </>
  );
}
