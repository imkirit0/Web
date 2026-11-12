import { ArrowRight } from "lucide-react";

type Item = { date: string; title: string; url: string; image: string };

/**
 * Editorial list of blue cards on one grid: date, headline, photo, arrow. From lg up the photo is a
 * print that leans and spills a little over its card; hovering straightens it. Phones show it inline.
 */
export function NewsRows({ items }: { items: Item[] }) {
  return (
    // The gap leaves room for each print's overhang, so neighbours never collide.
    <div data-stagger className="grid gap-3 lg:gap-11">
      {items.map((n, i) => {
        const [day, ...rest] = n.date.split(" ");
        return (
          <a
            key={n.url}
            href={n.url}
            className="group relative grid grid-cols-[88px_1fr] items-center gap-x-4 gap-y-1 rounded-2xl bg-blue p-4 text-white transition-colors duration-300 hover:bg-navy focus-visible:bg-navy md:grid-cols-[104px_1fr_auto] md:gap-x-8 md:rounded-[28px] md:px-8 md:py-7 lg:min-h-[168px] lg:grid-cols-[104px_1fr_248px_auto] lg:py-0"
          >
            <img src={n.image} alt="" loading="lazy" className="row-span-2 aspect-square size-full rounded-xl object-cover object-top md:hidden" />
            {/* One line on phones; from md the day stands tall beside a hairline. */}
            <span className="text-[13px] font-bold tracking-wide text-white/80 md:flex md:flex-col md:gap-1.5 md:self-stretch md:justify-center md:border-r md:border-white/20">
              <span className="md:font-display md:text-[44px] md:leading-none md:tracking-tight md:text-white">{day}</span>{" "}
              <span>{rest.join(" ")}</span>
            </span>
            <h3 className="font-display text-[19px] leading-tight font-bold tracking-tight text-balance transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5 md:text-[clamp(22px,2.3vw,32px)]">{n.title}</h3>
            <span aria-hidden className="relative hidden self-stretch lg:block">
              <img
                src={n.image}
                alt=""
                loading="lazy"
                className={`absolute top-1/2 left-0 aspect-[4/3] w-full -translate-y-1/2 rounded-2xl bg-mist object-cover object-top shadow-[0_18px_40px_rgba(5,12,31,.35)] ring-4 ring-white transition-transform duration-500 ease-out-expo group-hover:scale-[1.04] group-hover:rotate-0 ${i % 2 ? "rotate-2" : "-rotate-3"}`}
              />
            </span>
            <span aria-hidden className="hidden size-12 flex-none items-center justify-center rounded-full border border-white/60 transition-colors duration-300 group-hover:bg-white group-hover:text-blue md:flex">
              <ArrowRight className="size-5 -rotate-45 transition-transform duration-500 ease-out-expo group-hover:rotate-0" strokeWidth={2.2} />
            </span>
          </a>
        );
      })}
    </div>
  );
}
