import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { SiteForm, fieldClass } from "@/components/SiteForm";
import { ContactChips, Field, FieldGrid, Split } from "@/components/student-pages";

export const metadata: Metadata = { title: "Feedback", description: "Tell G-TEC Education how we are doing." };

export default function FeedbackPage() {
  return (
    <>
      <PageHero eyebrow="Feedback" title="We learn and grow from your feedback." intro="We welcome your feedback." />
      <Split
        eyebrow="Your voice"
        title="Tell us how we're doing."
        intro={
          <>
            <p>Looking back and seeing how we were has always helped us go forward with better clarity and resolve. Our open approach to the student community and to our centres has earned us the trust of both, while allowing us to improve over the last decades.</p>
            <p>Every student can use our ERP software to post feedback live, and this page lets you tell us directly how we are doing.</p>
            <p>We truly believe our student community has helped shape who we are today. We are thankful to everyone who has criticised constructively and helped us grow.</p>
          </>
        }
        aside={<ContactChips />}
      >
        <SiteForm form="feedback" submit="Submit" success="Thank you for your feedback, we will get in touch with you soon.">
          <FieldGrid>
            <Field label="Name" required wide><input name="name" required autoComplete="name" className={fieldClass} /></Field>
            <Field label="Phone"><input name="phone" type="tel" autoComplete="tel" className={fieldClass} /></Field>
            <Field label="Email"><input name="email" type="email" autoComplete="email" className={fieldClass} /></Field>
            <Field label="Your feedback" required wide><textarea name="description" rows={5} required className={fieldClass} /></Field>
          </FieldGrid>
        </SiteForm>
      </Split>
    </>
  );
}
