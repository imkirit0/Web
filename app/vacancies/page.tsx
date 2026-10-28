import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { PageHero } from "@/components/sections";
import { SiteForm, fieldClass } from "@/components/SiteForm";
import { EmailNote, Field, FieldGrid, Split, card } from "@/components/student-pages";

export const metadata: Metadata = { title: "View Vacancies", description: "Current job vacancies through G-TEC Education." };

export default function VacanciesPage() {
  return (
    <>
      <PageHero eyebrow="View vacancies" title="Your future starts here." intro="Openings shared with us by employers are listed here. Apply below and our placement team will be in touch." />
      <Split
        eyebrow="Open positions"
        title="Current vacancies"
        aside={
          <>
            <div className={`${card} flex items-start gap-4 p-7`}>
              <span className="flex size-12 flex-none items-center justify-center rounded-2xl bg-ice text-blue"><BriefcaseBusiness className="size-5" /></span>
              <div>
                <p className="font-display text-lg font-bold">No openings right now</p>
                <p className="mt-1 leading-relaxed text-ink-2">Currently, we don&apos;t have any updates. Please check back later.</p>
              </div>
            </div>
            <Link href="/postvacancy" className="inline-flex items-center gap-2 text-sm font-semibold text-blue">
              Hiring? Post a vacancy <ArrowRight className="size-4" />
            </Link>
          </>
        }
      >
        <SiteForm form="vacancy-application" submit="Submit" success="Thank you for your interest, we will get in touch with you soon.">
          <h3 className="font-display text-xl font-bold text-ink">Apply for a job</h3>
          <FieldGrid>
            <Field label="Position" wide><input name="vacancy_name" className={fieldClass} placeholder="The role you're applying for" /></Field>
            <Field label="Name" required><input name="name" required autoComplete="name" className={fieldClass} /></Field>
            <Field label="Mobile no." required><input name="phone" type="tel" required autoComplete="tel" className={fieldClass} /></Field>
            <Field label="Email"><input name="email" type="email" autoComplete="email" className={fieldClass} /></Field>
            <Field label="Location" required><input name="location" required className={fieldClass} /></Field>
          </FieldGrid>
          <EmailNote what="resume (.doc, .docx or .pdf, under 1 MB)" />
        </SiteForm>
      </Split>
    </>
  );
}
