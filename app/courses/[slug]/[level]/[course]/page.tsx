import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Clock } from "lucide-react";
import { CourseHero, CourseTile, wrap } from "@/components/courses";
import { CATEGORIES, getCategory, getCourse, getLevel, titleCase } from "@/lib/content";

type Props = { params: Promise<{ slug: string; level: string; course: string }> };

export const dynamicParams = false;
export const generateStaticParams = () =>
  CATEGORIES.flatMap((c) => c.levels.flatMap((l) => l.courses.map((x) => ({ slug: c.slug, level: l.slug, course: x.slug }))));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, level, course } = await params;
  const c = getCourse(slug, level, course);
  return c ? { title: c.title, description: `${c.title}${c.duration ? ` (${c.duration})` : ""} at G-TEC Education.` } : {};
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug, level, course } = await params;
  const cat = getCategory(slug);
  const lvl = getLevel(slug, level);
  const c = getCourse(slug, level, course);
  if (!cat || !lvl || !c) notFound();
  const levelHref = `/courses/${slug}/${level}`;
  const related = lvl.courses.filter((x) => x.slug !== course).slice(0, 4);

  return (
    <>
      <CourseHero
        crumbs={[{ label: "Courses", href: "/courses" }, { label: titleCase(cat.title), href: `/courses/${slug}` }, { label: titleCase(lvl.title), href: levelHref }, { label: c.title }]}
        title={c.title}
      >
        <div data-reveal="0.2" className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2"><BookOpen className="size-4 text-coral" /> {titleCase(c.category || lvl.title)}</span>
          {c.duration && <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2"><Clock className="size-4 text-coral" /> {c.duration}</span>}
        </div>
      </CourseHero>

      <section className="bg-mist py-16 text-ink">
        <div className={`${wrap} grid items-start gap-10 lg:grid-cols-[1fr_360px]`}>
          <article className="rounded-[28px] bg-white p-[clamp(24px,4vw,48px)] ring-1 ring-ink/6">
            {c.body ? <div className="prose-gtec" dangerouslySetInnerHTML={{ __html: c.body }} /> : <p className="text-ink-2">Full course details are available from your nearest centre.</p>}
          </article>

          <aside className="grid gap-4 lg:sticky lg:top-28">
            {c.image && <img src={c.image} alt={c.title} className="aspect-[16/10] w-full rounded-[28px] object-cover" />}
            <div className="rounded-[28px] bg-navy p-7 text-white">
              <p className="font-display text-xl font-bold tracking-tight">Interested in this course?</p>
              <p className="mt-2 mb-6 text-sm leading-relaxed text-white/65">Tell us a little about yourself and a counsellor from your nearest centre will call you back.</p>
              <a href="#enquire" className="flex items-center justify-center gap-2 rounded-full bg-red px-6 py-3.5 text-[15px] font-bold transition hover:bg-red-dark">
                Enquire now <ArrowRight className="size-4" />
              </a>
              <Link href="/centres" className="mt-3 flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-[15px] font-semibold transition hover:bg-white/8">
                Find a centre
              </Link>
            </div>
            <Link href={levelHref} className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-blue">
              <ArrowLeft className="size-4" /> All {titleCase(lvl.title).toLowerCase()} in {titleCase(cat.title)}
            </Link>
          </aside>
        </div>

        {related.length > 0 && (
          <div className={`${wrap} mt-20`}>
            <h2 className="font-display mb-6 text-2xl font-bold tracking-tight">You might also like</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4">
              {related.map((x) => <CourseTile key={x.slug} href={`${levelHref}/${x.slug}`} course={x} />)}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
