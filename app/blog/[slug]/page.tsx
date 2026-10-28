import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { CourseHero } from "@/components/courses";
import { ArticleLayout, MistSection } from "@/components/media-pages";
import { POSTS, getPost } from "@/lib/pages-data";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => POSTS.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPost((await params).slug);
  return p ? { title: p.title, description: p.excerpt } : {};
}

export default async function PostPage({ params }: Props) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const others = POSTS.filter((x) => x.slug !== p.slug);

  return (
    <>
      <CourseHero crumbs={[{ label: "Blog", href: "/blog" }, { label: p.title }]} title={p.title}>
        <p data-reveal="0.2" className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm font-semibold"><CalendarDays className="size-4 text-coral" /> {p.date}</p>
      </CourseHero>
      <MistSection>
        <ArticleLayout
          html={p.body}
          image={p.image}
          alt={p.title}
          aside={
            <>
              <div className="rounded-[28px] bg-white p-7 ring-1 ring-ink/6">
                <p className="font-display mb-4 text-lg font-bold tracking-tight">More posts</p>
                <ul className="grid gap-3">
                  {others.map((x) => <li key={x.slug}><Link href={`/blog/${x.slug}`} className="text-[15px] font-semibold text-ink-2 hover:text-blue">{x.title}</Link></li>)}
                </ul>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 px-2 text-sm font-semibold text-blue"><ArrowLeft className="size-4" /> All posts</Link>
            </>
          }
        />
      </MistSection>
    </>
  );
}
