import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronRight, Clock } from "lucide-react";
import { type Category, type CourseItem, titleCase } from "@/lib/content";
import { cn } from "@/lib/utils";

export const wrap = "mx-auto w-[min(1240px,100%)] px-6";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-white/55">
      {[{ label: "Home", href: "/" }, ...items].map((it, i, all) => (
        <span key={it.label + i} className="flex items-center gap-1.5">
          {it.href && i < all.length - 1 ? <Link href={it.href} className="hover:text-white">{it.label}</Link> : <span aria-current="page" className="text-white/85">{it.label}</span>}
          {i < all.length - 1 && <ChevronRight className="size-3.5 text-white/30" />}
        </span>
      ))}
    </nav>
  );
}

/** Dark page header shared by course listing and detail pages. */
export function CourseHero({ crumbs, title, intro, children }: { crumbs: { label: string; href?: string }[]; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-navy pt-36 pb-16">
      <div className="pointer-events-none absolute top-[-200px] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,66,130,.45),transparent_65%)] blur-[40px]" />
      <div className={cn(wrap, "relative")}>
        <Breadcrumbs items={crumbs} />
        <h1 data-reveal="0.1" className="font-display mt-8 max-w-[20ch] text-[clamp(36px,5vw,68px)] leading-[1.04] font-extrabold tracking-[-.03em] text-balance">{title}</h1>
        {intro && <p data-reveal="0.2" className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-pretty text-white/70">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function CourseTile({ href, course }: { href: string; course: CourseItem }) {
  return (
    <Link href={href} className="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink/6 transition duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,66,130,.14)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-ice">
        {course.image && <img src={course.image} alt="" loading="lazy" className="size-full object-cover transition duration-700 ease-out-expo group-hover:scale-105" />}
        <span className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[17px] leading-snug font-bold tracking-tight text-ink">{course.title}</h3>
        {course.duration && (
          <span className="mt-auto flex items-center gap-1.5 pt-3 text-[13px] font-semibold text-ink-2">
            <Clock className="size-3.5 text-red" /> {course.duration}
          </span>
        )}
      </div>
    </Link>
  );
}

/** Every programme level in a category, with a preview of its courses. */
export function LevelSection({ category }: { category: Category }) {
  return (
    <section id="programmes" className="scroll-mt-24 bg-mist py-[clamp(80px,9vw,136px)] text-ink">
      <div className={wrap}>
        <div className="mb-14 max-w-[720px]">
          <p className="mb-4 text-xs font-bold tracking-[.18em] text-red uppercase">Programmes</p>
          <h2 className="font-display text-[clamp(30px,4vw,48px)] leading-[1.08] font-bold tracking-[-.025em]">Choose how deep you want to go.</h2>
          {category.intro && <p className="mt-4 text-[17px] leading-relaxed text-ink-2">{category.intro}</p>}
        </div>
        <div className="grid gap-16">
          {category.levels.map((l) => (
            <div key={l.slug}>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-4">
                <h3 className="font-display text-2xl font-bold tracking-tight">
                  {titleCase(l.title)} <span className="ml-2 text-base font-semibold text-ink-2">{l.courses.length} courses</span>
                </h3>
                <Link href={`/courses/${category.slug}/${l.slug}`} className="group inline-flex items-center gap-2 text-sm font-bold text-blue">
                  View all <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4">
                {l.courses.slice(0, 4).map((c) => <CourseTile key={c.slug} href={`/courses/${category.slug}/${l.slug}/${c.slug}`} course={c} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
