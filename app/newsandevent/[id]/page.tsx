import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { CourseHero } from "@/components/courses";
import { ArticleLayout, MistSection } from "@/components/media-pages";
import { NEWS_ITEMS, getNewsItem } from "@/lib/pages-data";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => NEWS_ITEMS.map((n) => ({ id: n.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = getNewsItem((await params).id);
  return n ? { title: n.title } : {};
}

export default async function NewsItemPage({ params }: Props) {
  const n = getNewsItem((await params).id);
  if (!n) notFound();
  const recent = NEWS_ITEMS.filter((x) => x.id !== n.id);

  return (
    <>
      <CourseHero crumbs={[{ label: "News & events", href: "/newsandevent" }, { label: n.title }]} title={n.title}>
        <p data-reveal="0.2" className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm font-semibold"><CalendarDays className="size-4 text-coral" /> {n.date}</p>
      </CourseHero>
      <MistSection>
        <ArticleLayout
          html={n.body}
          alt={n.title}
          aside={
            <>
              {n.image && <img src={n.image} alt={n.title} className="w-full rounded-[28px] object-cover ring-1 ring-ink/6" />}
              {recent.length > 0 && (
                <div className="rounded-[28px] bg-white p-7 ring-1 ring-ink/6">
                  <p className="font-display mb-4 text-lg font-bold tracking-tight">Recent news</p>
                  <ul className="grid gap-3">
                    {recent.map((x) => (
                      <li key={x.id}>
                        <Link href={`/newsandevent/${x.id}`} className="text-[15px] font-semibold text-ink-2 hover:text-blue">{x.title}</Link>
                        <span className="block text-[13px] text-ink-2/70">{x.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link href="/newsandevent" className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-blue"><ArrowLeft className="size-4" /> All news</Link>
            </>
          }
        />
      </MistSection>
    </>
  );
}
