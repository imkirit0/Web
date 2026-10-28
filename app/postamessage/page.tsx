import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { SiteForm, fieldClass } from "@/components/SiteForm";
import { Field, FieldGrid, LIVE, Split } from "@/components/student-pages";
import { CONTACT } from "@/lib/data";

export const metadata: Metadata = { title: "Post a Message", description: "Share your thoughts with G-TEC Education." };

export default function PostAMessagePage() {
  return (
    <>
      <PageHero eyebrow="Post a message" title="Share your thoughts with us." intro="We are always looking for ways to improve and would love to hear your opinions." />
      <Split
        eyebrow="Write to us"
        title="Comments and new ideas are always welcome."
        intro={
          <p>
            Tell us what you think of our service, or share ideas to make your experience with us even better. Post your response using the form, or write to us directly at{" "}
            <a href={CONTACT.email.href} className="font-semibold text-blue underline underline-offset-2">{CONTACT.email.label}</a>.
          </p>
        }
        aside={<img src={`${LIVE}/assets/img/contact/post-msg-tmb.webp`} alt="" className="aspect-[16/10] w-full rounded-[28px] object-cover" />}
      >
        <SiteForm form="postamessage" submit="Submit" success="Thank you for your message, we will get in touch with you soon.">
          <FieldGrid>
            <Field label="Name" required wide><input name="name" required autoComplete="name" className={fieldClass} /></Field>
            <Field label="Phone" required><input name="phone" type="tel" required autoComplete="tel" className={fieldClass} /></Field>
            <Field label="Email" required><input name="email" type="email" required autoComplete="email" className={fieldClass} /></Field>
            <Field label="Message" required wide><textarea name="description" rows={5} required className={fieldClass} /></Field>
          </FieldGrid>
        </SiteForm>
      </Split>
    </>
  );
}
