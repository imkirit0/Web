import Link from "next/link";
import { cn } from "@/lib/utils";

const wrap = "mx-auto w-[min(1240px,100%)] px-6";

/** The inner-page header. Its own file, so the many pages that only need this don't load the home page's motion code. */
export function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div data-reveal="0" className={cn("mb-5 flex items-center gap-3 text-xs font-bold tracking-[.18em] uppercase", light ? "text-red" : "text-coral")}>
      <span className="h-0.5 w-7 bg-red" />
      {children}
    </div>
  );
}

/** Layered navy backdrop shared by every inner-page header: fine grid, brand glows, fade at the bottom. */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_70%_at_70%_20%,#000_20%,transparent_75%)] bg-[size:56px_56px]" />
      <div className="absolute -top-40 right-[-10%] size-[640px] rounded-full bg-[radial-gradient(circle,rgba(0,102,204,.42),transparent_62%)] blur-[30px]" />
      <div className="absolute top-[30%] left-[-12%] size-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,1,0,.16),transparent_65%)] blur-[40px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-navy pt-[clamp(140px,16vw,184px)] pb-[clamp(56px,7vw,96px)]">
      <HeroBackdrop />
      <div className={cn(wrap, "relative")}>
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-[13px] font-medium text-white/50">
          <Link href="/" className="-my-2 py-2 transition hover:text-white">Home</Link>
          <span className="size-1 rounded-full bg-white/25" />
          <span className="text-white/80">{eyebrow}</span>
        </nav>
        <div className="grid items-end gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 data-reveal="0.1" className="font-display text-[clamp(40px,5.4vw,76px)] leading-[1.02] font-bold tracking-[-.04em] text-balance">
              {title}
            </h1>
          </div>
          {intro && (
            <p data-reveal="0.2" className="border-l border-white/15 pl-6 text-[17px] leading-relaxed text-pretty text-white/72 lg:mb-2">
              {intro}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
