import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { SiteForm, fieldClass } from "@/components/SiteForm";
import { EmailNote, Field, FieldGrid, LIVE, Split, h2, wrap } from "@/components/student-pages";

export const metadata: Metadata = { title: "Our Placements", description: "Where G-TEC students work: weekly placement highlights." };

const P = `${LIVE}/storage/app/public/placement`;
const WEEKS = [
  { label: "February", src: `${P}/10-03-26-04-15-feb-placement.jpg` },
  { label: "January, 2nd week", src: `${P}/02-02-26-01-22-Jan-2nd-week.jpg` },
  { label: "January, 1st week", src: `${P}/20-01-26-02-46-Jan-1st-Week.jpg` },
  { label: "December, 5th week", src: `${P}/13-01-26-02-43-Dec-week-5.jpg` },
  { label: "December, 4th week", src: `${P}/13-01-26-02-11-Dec-week-4.jpg` },
  { label: "December, 3rd week", src: `${P}/20-12-25-06-49-Dec-week-3.jpg` },
  { label: "December, 2nd week", src: `${P}/20-12-25-06-02-Dec-week-2.jpg` },
  { label: "December, 1st week", src: `${P}/20-12-25-06-33-Dec-week-1.jpg` },
];

export default function PlacementsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our placements"
        title="Where our students work."
        intro="At G-TEC Education, we believe good education should lead to a good job. That's why we don't stop with just teaching; we also help our students build strong careers."
      />

      <section className="bg-mist py-[clamp(64px,8vw,112px)] text-ink">
        <div className={wrap}>
          <h2 className={`${h2} mb-10`}>Recent placements</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-5">
            {WEEKS.map((w) => (
              <a key={w.src} href={w.src} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-[28px] bg-white ring-1 ring-ink/6 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(11,26,51,.12)]">
                <img src={w.src} alt={`G-TEC placements, ${w.label}`} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                <p className="font-display px-5 py-4 text-[15px] font-bold">{w.label}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-ink/6">
        <Split eyebrow="Got placed?" title="Add your placement." intro={<p>Placed through G-TEC? Share your details and we&apos;ll publish them here once they&apos;re reviewed.</p>}>
          <SiteForm form="placement" submit="Submit" success="Thank you! Your placement will be published soon.">
            <FieldGrid>
              <Field label="Name" required><input name="name" required autoComplete="name" className={fieldClass} /></Field>
              <Field label="Company" required><input name="company" required className={fieldClass} /></Field>
              <Field label="Designation" required><input name="designation" required className={fieldClass} /></Field>
              <Field label="Course" required><input name="course" required className={fieldClass} /></Field>
              <Field label="Centre" required wide><input name="centre" required className={fieldClass} /></Field>
            </FieldGrid>
            <EmailNote what="photo (.jpg or .png, under 1 MB, ideally 100 x 100 px)" />
          </SiteForm>
        </Split>
      </div>
    </>
  );
}
