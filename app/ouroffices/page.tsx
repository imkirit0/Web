import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/sections";
import { LIVE, card, wrap } from "@/components/student-pages";

export const metadata: Metadata = { title: "Our Offices", description: "G-TEC Education offices in Singapore, India and Dubai." };

const OFFICES = [
  { type: "Corporate Office", country: "Singapore", flag: `${LIVE}/assets/img/flags/sg.svg`, address: ["G-TEC EDUCATION, Sunshine Plaza,", "Bencoolen St, Singapore-189652"], phones: ["+65 96503505", "+65 63360244"] },
  { type: "Administrative Office", country: "India", flag: `${LIVE}/assets/img/flags/in.svg`, address: ["HOUSE OF G-TEC, Indus Avenue,", "Kallai Road, Calicut-673002, Kerala, India"], phones: ["+91 495 4088333"] },
  {
    type: "Regional Office",
    country: "United Arab Emirates",
    flag: "https://gteceducation.com/storage/app/public/filemanager/04-11-25-04-40-Flag_of_the_United_Arab_Emirates.svg.png",
    address: ["AL-QUSAIS G-TEC EDUCATION INSTITUTE,", "Villa-19, Behind Al Twar Centre, Al Qusais 2, Dubai"],
    phones: ["+971 42665884", "+971 503980768"],
  },
];

export default function OurOfficesPage() {
  return (
    <>
      <PageHero eyebrow="Our offices" title="Connecting you globally." intro="Reach our corporate, administrative and regional offices in Singapore, India and Dubai." />
      <section className="bg-mist py-[clamp(64px,8vw,112px)] text-ink">
        <div className={wrap}>
          <div className="grid gap-5 md:grid-cols-3">
            {OFFICES.map((o) => (
              <article key={o.type} className={`${card} flex flex-col p-7`}>
                <img src={o.flag} alt={`Flag of ${o.country}`} className="mb-6 h-9 w-[54px] rounded-md object-cover ring-1 ring-ink/10" />
                <p className="text-xs font-bold tracking-[.16em] text-red uppercase">{o.type}</p>
                <h2 className="font-display mt-1 mb-5 text-2xl font-bold tracking-tight">{o.country}</h2>
                <p className="mb-5 flex gap-3 leading-relaxed text-ink-2">
                  <MapPin className="mt-1 size-4.5 flex-none text-blue" />
                  <span>{o.address.map((l) => <span key={l} className="block">{l}</span>)}</span>
                </p>
                <div className="mt-auto grid gap-2">
                  {o.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="flex items-center gap-3 font-semibold transition hover:text-blue"><Phone className="size-4.5 text-blue" /> {p}</a>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <Link href="/centres" className="mt-10 inline-flex items-center gap-2 rounded-full bg-blue px-7 py-3.5 text-[15px] font-bold text-white transition hover:bg-blue-dark">
            Find a centre near you <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
