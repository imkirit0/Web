import type { Metadata } from "next";
import { Building2, CalendarDays, DoorOpen, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections";
import { SiteForm, fieldClass } from "@/components/SiteForm";
import { Field, FieldGrid, LIVE, Split, card, h2, wrap } from "@/components/student-pages";

export const metadata: Metadata = { title: "G-TEC Job Fair", description: "Meet employers and find your job at a G-TEC Job Fair." };

// ponytail: copied from the live listing; move to content/CMS when fairs change often.
const FAIRS = [
  { date: "07 November 2026", venue: "Mankada Block Panchayath Conference Hall", entry: "Walk in", companies: "30+" },
  { date: "24 October 2026", venue: "Sree Gokulam Arts & Science College Balussery", entry: "Walk in", companies: "20+" },
];
const POSTERS = [
  `${LIVE}/storage/app/public/jobfair/09-10-26-03-02-WhatsApp-Image-2026-10-06-at-43919-PM.jpeg`,
  `${LIVE}/storage/app/public/jobfair/09-10-26-03-30-JOBBFAIR.jpeg`,
];

export default function JobFairPage() {
  return (
    <>
      <PageHero
        eyebrow="G-TEC Job Fair"
        title="Meet. Connect. Get hired."
        intro="G-TEC EDUCATION has always been at the forefront of education, in both the IT and non-IT sectors, with a drive to create job opportunities for students and job aspirants. Our job fairs connect prospective employees with their employers."
      />

      <section className="bg-mist py-[clamp(64px,8vw,112px)] text-ink">
        <div className={wrap}>
          <h2 className={`${h2} mb-10`}>Job fairs</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {FAIRS.map((f, i) => (
              <article key={f.date} className={`${card} overflow-hidden`}>
                <img src={POSTERS[i]} alt={`Job fair at ${f.venue}`} loading="lazy" className="aspect-[16/10] w-full bg-ice object-cover" />
                <dl className="grid gap-4 p-7">
                  {[
                    { icon: CalendarDays, k: "Date", v: f.date },
                    { icon: MapPin, k: "Venue", v: f.venue },
                    { icon: DoorOpen, k: "Entry", v: f.entry },
                    { icon: Building2, k: "Expected companies", v: f.companies },
                  ].map(({ icon: Icon, k, v }) => (
                    <div key={k} className="flex items-start gap-3.5">
                      <Icon className="mt-0.5 size-5 flex-none text-blue" />
                      <div>
                        <dt className="text-xs font-bold tracking-[.12em] text-ink-2 uppercase">{k}</dt>
                        <dd className="font-semibold">{v}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-ink/6">
        <Split eyebrow="Register" title="Apply to attend." intro={<p>To be approved to attend, select a job fair and fill in a few personal details.</p>}>
          <SiteForm form="jobfair" submit="Submit" success="Thank you for your interest, we will get in touch with you soon.">
            <FieldGrid>
              <Field label="Job fair" required wide>
                <select name="job_id" required defaultValue="" className={fieldClass}>
                  <option value="" disabled>Select a job fair</option>
                  {FAIRS.map((f) => <option key={f.date} value={`${f.date}, ${f.venue}`}>{f.date}, {f.venue}</option>)}
                </select>
              </Field>
              <Field label="Name" required><input name="name" required autoComplete="name" className={fieldClass} /></Field>
              <Field label="Phone" required><input name="phone" type="tel" required autoComplete="tel" className={fieldClass} /></Field>
              <Field label="Email"><input name="email" type="email" autoComplete="email" className={fieldClass} /></Field>
              <Field label="Location" required><input name="location" required className={fieldClass} /></Field>
              <Field label="Address" wide><textarea name="address" rows={3} autoComplete="street-address" className={fieldClass} /></Field>
            </FieldGrid>
          </SiteForm>
        </Split>
      </div>
    </>
  );
}
