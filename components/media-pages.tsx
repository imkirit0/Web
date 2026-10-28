import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Play } from "lucide-react";
import { wrap } from "@/components/courses";
import type { Centre, NewsItem, Post } from "@/lib/pages-data";

const card = "group flex flex-col overflow-hidden rounded-[28px] bg-white ring-1 ring-ink/6 transition duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,66,130,.14)]";
const grid = "grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-5";

/** Light section wrapper used by every page in this group. */
export function MistSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className="bg-mist py-16 text-ink">
      <div className={`${wrap} ${className}`}>{children}</div>
    </section>
  );
}

function Cover({ src, alt = "" }: { src?: string; alt?: string }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-ice">
      {src && <img src={src} alt={alt} loading="lazy" className="size-full object-cover transition duration-700 ease-out-expo group-hover:scale-105" />}
    </div>
  );
}

export function CentreGrid({ centres }: { centres: Centre[] }) {
  return (
    <div className={grid}>
      {centres.map((c) => (
        <Link key={c.slug} href={`/centres/${c.slug}`} className={card}>
          <Cover src={c.banner} />
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-display text-lg font-bold tracking-tight">{c.name}</h3>
            <p className="mt-2 flex gap-2 text-sm leading-relaxed text-ink-2"><MapPin className="mt-0.5 size-4 flex-none text-red" /> {c.address}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-blue">View centre <ArrowUpRight className="size-4" /></span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className={grid}>
      {posts.map((p) => (
        <Link key={p.slug} href={`/blog/${p.slug}`} className={card}>
          <Cover src={p.image} />
          <div className="flex flex-1 flex-col p-6">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-2"><CalendarDays className="size-3.5 text-red" /> {p.date}</span>
            <h3 className="font-display mt-2 text-lg leading-snug font-bold tracking-tight">{p.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-2">{p.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function NewsGrid({ items }: { items: NewsItem[] }) {
  return (
    <div className={grid}>
      {items.map((n) => (
        <Link key={n.id} href={`/newsandevent/${n.id}`} className={card}>
          <Cover src={n.image} />
          <div className="flex flex-1 flex-col p-6">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink-2"><CalendarDays className="size-3.5 text-red" /> {n.date}</span>
            <h3 className="font-display mt-2 text-lg leading-snug font-bold tracking-tight">{n.title}</h3>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-bold text-blue">Read more <ArrowUpRight className="size-4" /></span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/** Photo grid; each photo opens full size in a new tab. ponytail: no lightbox, add a <dialog> one if asked. */
export function PhotoGrid({ photos, alt }: { photos: string[]; alt: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((src, i) => (
        <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="group block aspect-square overflow-hidden rounded-[20px] bg-ice ring-1 ring-ink/6">
          <img src={src} alt={`${alt} photo ${i + 1}`} loading="lazy" className="size-full object-cover transition duration-700 ease-out-expo group-hover:scale-105" />
        </a>
      ))}
    </div>
  );
}

export function VideoGrid({ videos }: { videos: { id: string; title: string }[] }) {
  return (
    <div className={grid}>
      {videos.map((v) => (
        <a key={v.id} href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className={card}>
          <div className="relative aspect-video overflow-hidden bg-navy">
            <img src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" className="size-full object-cover transition duration-700 ease-out-expo group-hover:scale-105" />
            <span className="absolute inset-0 m-auto flex size-14 items-center justify-center rounded-full bg-red text-white shadow-[0_12px_32px_rgba(255,1,0,.38)]"><Play className="ml-0.5 size-6 fill-current" /></span>
          </div>
          <h3 className="font-display p-6 text-lg leading-snug font-bold tracking-tight">{v.title}</h3>
        </a>
      ))}
    </div>
  );
}

/** White article card for scraped HTML bodies, with an optional image and side column. */
export function ArticleLayout({ html, image, alt, aside }: { html: string; image?: string; alt: string; aside?: React.ReactNode }) {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px]">
      <article className="rounded-[28px] bg-white p-[clamp(24px,4vw,48px)] ring-1 ring-ink/6">
        {image && <img src={image} alt={alt} className="mb-8 w-full rounded-[20px] object-cover" />}
        <div className="prose-gtec" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      {aside && <aside className="grid gap-4 lg:sticky lg:top-28">{aside}</aside>}
    </div>
  );
}
