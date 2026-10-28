import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Stories } from "@/components/Stories";
import { SiteForm, fieldClass } from "@/components/SiteForm";
import { Band, card } from "@/components/about-pages";

export const metadata: Metadata = { title: "Testimonials", description: "What G-TEC students say about their training." };

const QUOTES = [
  ["Vimina M", "I had a great experience at the computer institute. The teachers were kind and explained lessons clearly. We got enough time for practice, and the courses like MS Office, Tally, and basic programming were taught well."],
  ["Shahad KP", "I am really satisfied with the training at this computer institute. The faculty members are skilled and always ready to clear doubts. They provide hands-on practice, which makes learning much easier."],
];

export default function TestimonialsPage() {
  return (
    <>
      <PageHero eyebrow="Testimonials" title="Hear it from our students.">
        <a href="#post" className="mt-8 inline-flex rounded-full bg-red px-7 py-3.5 text-[15px] font-bold transition hover:bg-red-dark">Post your message</a>
      </PageHero>

      <Band eyebrow="In their words">
        <div className="grid gap-4 md:grid-cols-2">
          {QUOTES.map(([name, text]) => (
            <figure key={name} className={`${card} flex flex-col p-8`}>
              <Quote className="size-8 text-red" />
              <blockquote className="mt-4 flex-1 text-[17px] leading-relaxed text-ink">{text}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="font-display flex size-11 items-center justify-center rounded-full bg-ice text-sm font-bold text-blue">{name.split(" ").map((w) => w[0]).join("")}</span>
                <span className="font-display font-bold">{name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Band>

      <Band dark eyebrow="Testimonial videos" title="Watch their stories.">
        <div className="-mx-6">
          <Stories grid />
        </div>
      </Band>

      <section id="post" className="scroll-mt-24 bg-mist py-[clamp(72px,8vw,120px)] text-ink">
        <div className="mx-auto grid w-[min(1240px,100%)] items-start gap-10 px-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="font-display text-[clamp(30px,4vw,50px)] leading-[1.08] font-bold tracking-[-.025em]">Post your message.</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-ink-2">Studied with G-TEC? Tell us about your experience. Your feedback will be published soon after review.</p>
          </div>
          <SiteForm form="testimonial" submit="Submit" success="Thank you for your feedback. It will be published soon.">
            <label className="grid gap-2 text-sm font-semibold">Name*<input name="name" required className={fieldClass} /></label>
            <label className="grid gap-2 text-sm font-semibold">Designation<input name="designation" className={fieldClass} /></label>
            <label className="grid gap-2 text-sm font-semibold">Message*<textarea name="description" required rows={5} className={fieldClass} /></label>
          </SiteForm>
        </div>
      </section>
    </>
  );
}
