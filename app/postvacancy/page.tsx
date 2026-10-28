import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { SiteForm, fieldClass } from "@/components/SiteForm";
import { ContactChips, Field, FieldGrid, LIVE, Split } from "@/components/student-pages";

export const metadata: Metadata = { title: "Post a Vacancy", description: "Hire trained G-TEC students. Post your vacancy and our HR team will contact you." };

export default function PostVacancyPage() {
  return (
    <>
      <PageHero eyebrow="Post a vacancy" title="We help you find the right talent." intro="Have a vacancy to fill? We are ready to help." />
      <Split
        eyebrow="For employers"
        title="Tell us about the role."
        intro={<p>Fill in the form and our HR team will get in touch with you.</p>}
        aside={
          <>
            <img src={`${LIVE}/assets/img/placements/post-placement.jpg`} alt="" className="aspect-[16/10] w-full rounded-[28px] object-cover" />
            <ContactChips />
          </>
        }
      >
        <SiteForm form="postvacancy" submit="Submit" success="Thank you for your interest, we will get in touch with you soon.">
          <FieldGrid>
            <Field label="Company name" required wide><input name="company" required autoComplete="organization" className={fieldClass} /></Field>
            <Field label="Email" required><input name="email" type="email" required autoComplete="email" className={fieldClass} /></Field>
            <Field label="Contact person" required><input name="name" required autoComplete="name" className={fieldClass} /></Field>
            <Field label="Contact number" required wide><input name="phone" type="tel" required autoComplete="tel" className={fieldClass} /></Field>
          </FieldGrid>
        </SiteForm>
      </Split>
    </>
  );
}
