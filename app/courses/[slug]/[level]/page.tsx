import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseHero, CourseTile, wrap } from "@/components/courses";
import { CATEGORIES, getCategory, getLevel, titleCase } from "@/lib/content";

type Props = { params: Promise<{ slug: string; level: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => CATEGORIES.flatMap((c) => c.levels.map((l) => ({ slug: c.slug, level: l.slug })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, level } = await params;
  const c = getCategory(slug);
  const l = getLevel(slug, level);
  return c && l ? { title: `${titleCase(l.title)} in ${titleCase(c.title)}` } : {};
}

export default async function LevelPage({ params }: Props) {
  const { slug, level } = await params;
  const cat = getCategory(slug);
  const lvl = getLevel(slug, level);
  if (!cat || !lvl) notFound();
  const catTitle = titleCase(cat.title);

  return (
    <>
      <CourseHero
        crumbs={[{ label: "Courses", href: "/courses" }, { label: catTitle, href: `/courses/${slug}` }, { label: titleCase(lvl.title) }]}
        title={`${titleCase(lvl.title)} in ${catTitle}`}
        intro={`${lvl.courses.length} ${lvl.courses.length === 1 ? "course" : "courses"} to choose from. Open any course to see what you'll learn and how long it takes.`}
      >
        <div data-reveal="0.3" className="mt-8 flex flex-wrap gap-2">
          {cat.levels.map((l) => (
            <a
              key={l.slug}
              href={`/courses/${slug}/${l.slug}`}
              aria-current={l.slug === level ? "page" : undefined}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white aria-[current=page]:border-red aria-[current=page]:bg-red aria-[current=page]:text-white"
            >
              {titleCase(l.title)}
            </a>
          ))}
        </div>
      </CourseHero>
      <section className="bg-mist py-16 text-ink">
        <div className={`${wrap} grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4`}>
          {lvl.courses.map((c) => <CourseTile key={c.slug} href={`/courses/${slug}/${level}/${c.slug}`} course={c} />)}
        </div>
      </section>
    </>
  );
}
