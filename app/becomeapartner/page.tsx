import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/sections";
import { SiteForm, fieldClass } from "@/components/SiteForm";
import { Field, FieldGrid, LIVE, Split } from "@/components/student-pages";
import { CONTACT } from "@/lib/data";

export const metadata: Metadata = { title: "Become a Partner", description: "Join forces and grow together with G-TEC Education." };

const chip = "inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-ink/8 transition hover:ring-blue/40";

export default function BecomeAPartnerPage() {
  return (
    <>
      <PageHero
        eyebrow="Become a partner"
        title="Join forces, grow together."
        intro="G-TEC Group of Institutions is highly acclaimed across the industry for building one of the fastest growing education provider networks."
      />
      <Split
        eyebrow="Partner with us"
        title="Grow alongside us."
        intro={<p>As part of our planned expansion, we are looking for partners to grow alongside us. To receive more information, use the form to tell us about your interest. You can also post your partner interest by email or phone.</p>}
        aside={
          <>
            <img src={`${LIVE}/assets/img/partners/partners-tmb.webp`} alt="" className="aspect-[16/10] w-full rounded-[28px] object-cover" />
            <div className="flex flex-wrap gap-3">
              <a href="tel:+919349223944" className={chip}><Phone className="size-4 text-blue" /> +91 9349223944</a>
              <a href={CONTACT.email.href} className={chip}><Mail className="size-4 text-blue" /> {CONTACT.email.label}</a>
            </div>
          </>
        }
      >
        <SiteForm form="becomeapartner" submit="Submit" success="Thank you for your interest, we will get in touch with you soon.">
          <FieldGrid>
            <Field label="Name" required><input name="name" required autoComplete="name" className={fieldClass} /></Field>
            <Field label="Email" required><input name="email" type="email" required autoComplete="email" className={fieldClass} /></Field>
            <Field label="Company / organisation" required wide><input name="company" required autoComplete="organization" className={fieldClass} /></Field>
            <Field label="Enquiry details" required wide><textarea name="address" rows={5} required className={fieldClass} /></Field>
          </FieldGrid>
        </SiteForm>
      </Split>
    </>
  );
}
