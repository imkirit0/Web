import type { Metadata } from "next";
import { CareersBoard } from "@/components/CareersBoard";
import { fieldClass } from "@/components/SiteForm";
import { EmailNote, Field, FieldGrid } from "@/components/student-pages";

export const metadata: Metadata = { title: "Careers", description: "Current openings at G-TEC Education, a global training network of 800+ centres across 23 countries." };

export default function CareersPage() {
  return (
    <CareersBoard>
      <FieldGrid>
        <Field label="Name" required><input name="name" required autoComplete="name" className={fieldClass} /></Field>
        <Field label="Mobile no." required><input name="phone" type="tel" required autoComplete="tel" className={fieldClass} /></Field>
        <Field label="Email" required><input name="email" type="email" required autoComplete="email" className={fieldClass} /></Field>
        <Field label="Location" required><input name="location" required autoComplete="address-level2" className={fieldClass} /></Field>
        <Field label="About you" wide><textarea name="message" rows={4} maxLength={2000} className={fieldClass} placeholder="Your experience and qualifications" /></Field>
      </FieldGrid>
      <EmailNote what="resume (.doc, .docx or .pdf, under 1 MB)" />
    </CareersBoard>
  );
}
