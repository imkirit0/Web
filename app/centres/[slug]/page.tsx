import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { CourseHero } from "@/components/courses";
import { MistSection, PhotoGrid } from "@/components/media-pages";
import { SiteForm, fieldClass } from "@/components/SiteForm";
import { CENTRE_SLUGS, getCentre } from "@/lib/pages-data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => CENTRE_SLUGS.map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCentre((await params).slug);
  return c ? { title: c.name, description: `${c.name}: ${c.address}` } : {};
}

export default async function CentrePage({ params }: Props) {
  const c = getCentre((await params).slug);
  if (!c) notFound();
  const h2 = "font-display mb-5 text-2xl font-bold tracking-tight";

  return (
    <>
      <CourseHero crumbs={[{ label: "Centres", href: "/centres" }, { label: c.name }]} title={c.name}>
        <p data-reveal="0.2" className="mt-5 flex max-w-[620px] gap-2 text-[17px] leading-relaxed text-white/70"><MapPin className="mt-1 size-5 flex-none text-coral" /> {c.address}</p>
      </CourseHero>
      <MistSection className="grid items-start gap-10 lg:grid-cols-[1fr_360px]">
        <div className="grid min-w-0 gap-10">
          {c.banner && <img src={c.banner} alt={c.name} className="aspect-[16/8] w-full rounded-[28px] object-cover" />}
          <div className="rounded-[28px] bg-white p-[clamp(24px,4vw,48px)] ring-1 ring-ink/6">
            <h2 className={h2}>About the centre</h2>
            <p className="leading-relaxed text-ink-2">{c.about}</p>
          </div>
          {c.courses.length > 0 && (
            <div>
              <h2 className={h2}>Courses offered</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {c.courses.map((x) => (
                  <li key={x.title}>
                    {x.href ? (
                      <Link href={x.href} className="flex h-full items-center justify-between gap-3 rounded-[20px] bg-white px-5 py-4 text-[15px] font-semibold ring-1 ring-ink/6 transition hover:ring-blue/40">
                        {x.title} <ArrowUpRight className="size-4 flex-none text-blue" />
                      </Link>
                    ) : (
                      <span className="flex h-full items-center rounded-[20px] bg-white px-5 py-4 text-[15px] font-semibold ring-1 ring-ink/6">{x.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {c.photos.length > 0 && (
            <div>
              <h2 className={h2}>Gallery</h2>
              <PhotoGrid photos={c.photos} alt={c.name} />
            </div>
          )}
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-28">
          <div className="grid gap-4 rounded-[28px] bg-navy p-7 text-white">
            <p className="font-display text-xl font-bold tracking-tight">Contact the centre</p>
            {c.phones.map((p) => (
              <a key={p} href={`tel:+91${p.replace(/\D/g, "")}`} className="flex items-center gap-3 text-[15px] font-semibold hover:text-coral"><Phone className="size-4 text-coral" /> {p}</a>
            ))}
            {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-3 text-[15px] font-semibold break-all hover:text-coral"><Mail className="size-4 flex-none text-coral" /> {c.email}</a>}
          </div>
          <div id="enquire" className="scroll-mt-28">
            <SiteForm form="centre-enquiry" submit="Send enquiry">
              <p className="font-display text-xl font-bold tracking-tight text-ink">Send an enquiry</p>
              <input type="hidden" name="centre" value={c.name} />
              <input name="name" required placeholder="Name*" aria-label="Name" className={fieldClass} />
              <input name="email" type="email" placeholder="Email" aria-label="Email" className={fieldClass} />
              <input name="phone" type="tel" required placeholder="Phone number*" aria-label="Phone number" className={fieldClass} />
              <textarea name="message" required rows={4} placeholder="Message*" aria-label="Message" className={fieldClass} />
            </SiteForm>
          </div>
          <Link href="/centres" className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-blue"><ArrowLeft className="size-4" /> All centres</Link>
        </aside>
      </MistSection>
    </>
  );
}
