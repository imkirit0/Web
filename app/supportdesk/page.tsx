import type { Metadata } from "next";
import { Headset, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/sections";
import { SiteForm, fieldClass } from "@/components/SiteForm";
import { Field, FieldGrid, Split, card } from "@/components/student-pages";
import { CONTACT } from "@/lib/data";

export const metadata: Metadata = { title: "Support Desk", description: "G-TEC Education support desk phone numbers." };

const DESKS = [
  { name: "Admin Desk", phone: "+91 9947703944" },
  { name: "Operations Desk", phone: "+91 9388103944" },
  { name: "PR Desk", phone: "+91 9079333944" },
  { name: "Technical Desk", phone: "+91 9349863944" },
  { name: "Quality Assurance", phone: "+91 9349863944" },
  { name: "Placement Wing", phone: "+91 9388183944" },
  { name: "Marketing Wing", phone: "+91 9349223944" },
];
const tel = (p: string) => `tel:${p.replace(/\s/g, "")}`;

export default function SupportDeskPage() {
  return (
    <>
      <PageHero eyebrow="Support desk" title="We're here to help." intro="Call the desk you need, or send us a message and the right team will get back to you." />
      <Split
        eyebrow="Office contact"
        title="Any info"
        aside={
          <>
            <div className={`${card} grid gap-4 p-7`}>
              <a href={CONTACT.phone.href} className="font-display flex flex-wrap items-center gap-x-3 gap-y-1 text-xl font-bold">
                <Phone className="size-5 text-blue" /> +91 495 4088333 <span className="font-sans text-sm font-medium text-ink-2">(60 lines)</span>
              </a>
              <a href={CONTACT.email.href} className="flex items-center gap-3 font-semibold text-blue"><Mail className="size-5" /> {CONTACT.email.label}</a>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {DESKS.map((d) => (
                <li key={d.name}>
                  <a href={tel(d.phone)} className={`${card} flex items-center gap-3.5 p-5 transition hover:ring-blue/30`}>
                    <span className="flex size-10 flex-none items-center justify-center rounded-xl bg-ice text-blue"><Headset className="size-4.5" /></span>
                    <span>
                      <span className="block text-xs font-bold tracking-[.1em] text-ink-2 uppercase">{d.name}</span>
                      <span className="block font-semibold">{d.phone}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        }
      >
        <SiteForm form="support" submit="Send" success="Thanks! Our support team will be in touch soon.">
          <h3 className="font-display text-xl font-bold text-ink">Send a support request</h3>
          <FieldGrid>
            <Field label="Name" required wide><input name="name" required autoComplete="name" className={fieldClass} /></Field>
            <Field label="Phone"><input name="phone" type="tel" autoComplete="tel" className={fieldClass} /></Field>
            <Field label="Email"><input name="email" type="email" autoComplete="email" className={fieldClass} /></Field>
            <Field label="How can we help?" required wide><textarea name="message" rows={5} required className={fieldClass} /></Field>
          </FieldGrid>
        </SiteForm>
      </Split>
    </>
  );
}
