import { Eyebrow } from "@/components/sections";
import { wrap } from "@/components/courses";
import { PAGES } from "@/lib/content";
import { cn } from "@/lib/utils";

export { wrap };

/** Scraped image paths can be relative ("../../../storage/...", "assets/..."); resolve them against the live site. */
export const abs = (u: string) => new URL(u, "https://www.gteceducation.com/a/b/c/").href;

/** Images of a scraped page, minus the first one (the live hero banner, which PageHero replaces). */
export const pageImages = (path: string) => (PAGES[path]?.images ?? []).slice(1).map(abs);

export const card = "rounded-[28px] bg-white ring-1 ring-ink/6";

/** Content section with an optional heading. `dark` switches from the light mist band to navy. */
export function Band({ dark, eyebrow, title, intro, children, className }: { dark?: boolean; eyebrow?: string; title?: string; intro?: React.ReactNode; children?: React.ReactNode; className?: string }) {
  return (
    <section className={cn("py-[clamp(72px,8vw,120px)]", dark ? "bg-navy text-white" : "bg-mist text-ink", className)}>
      <div className={wrap}>
        {(eyebrow || title) && (
          <div className="mb-12 max-w-[760px]">
            {eyebrow && <Eyebrow light={!dark}>{eyebrow}</Eyebrow>}
            {title && <h2 data-reveal="0.1" className="font-display text-[clamp(30px,4vw,50px)] leading-[1.08] font-bold tracking-[-.025em] text-balance">{title}</h2>}
            {intro && <div data-reveal="0.2" className={cn("mt-5 grid gap-4 text-[17px] leading-relaxed text-pretty", dark ? "text-white/70" : "text-ink-2")}>{intro}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** White tiles for partner / certification logos. */
export function LogoGrid({ logos, wide }: { wide?: boolean; logos: { src: string; name: string; text?: string; url?: string }[] }) {
  return (
    <div className={cn("grid gap-4", wide ? "grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))]" : "grid-cols-[repeat(auto-fill,minmax(min(100%,150px),1fr))]")}>
      {logos.map((l) => {
        const inner = (
          <>
            <span className="flex h-24 items-center justify-center p-4">
              <img src={l.src} alt={l.name} loading="lazy" className="max-h-full max-w-full object-contain" />
            </span>
            {l.text && <span className="border-t border-ink/6 px-5 py-4 text-[14px] leading-relaxed text-ink-2">{l.text}</span>}
          </>
        );
        const cls = cn(card, "flex flex-col overflow-hidden transition duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,66,130,.14)]");
        return l.url ? (
          <a key={l.src} href={l.url} target="_blank" rel="noopener noreferrer" title={l.name} className={cls}>{inner}</a>
        ) : (
          <div key={l.src} className={cls}>{inner}</div>
        );
      })}
    </div>
  );
}
