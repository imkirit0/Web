import { PAGES, getCourse, titleCase } from "@/lib/content";

// Parsers for scraped live-site pages (centres, blog, news, galleries). Patterns match the live markup as scraped.

const ENT: Record<string, string> = { amp: "&", "#038": "&", larr: "←", hellip: "…", nbsp: " ", quot: '"', "#8217": "’", "#039": "'" };
export const decode = (s: string) => s.replace(/&(#?\w+);/g, (m, e: string) => ENT[e] ?? m).replace(/\s+/g, " ").trim();
const strip = (s: string) => decode(s.replace(/<[^>]+>/g, " "));
const pick = (s: string, re: RegExp) => s.match(re)?.[1] ?? "";
// Live image URLs contain raw spaces/brackets; encode once so <img> works.
const img = (u?: string) => (u ? encodeURI(decodeURI(u)) : undefined);

/* ── Centres ── */

export const CENTRE_SLUGS = ["gceperinthalmanna", "gtecperavoor", "gtecmullakkal", "gteckuthuparamba", "gteckunnumpuram", "gtecernakulamsouth", "gtecnedumudy", "gtecmannancherry"];

export function getCentre(slug: string) {
  const p = CENTRE_SLUGS.includes(slug) ? PAGES[`/centres/${slug}`] : undefined;
  if (!p?.html) return undefined;
  const h = p.html;
  const courses = [...h.matchAll(/(?:<a href="([^"]*)">\s*)?<h4>([\s\S]*?)<\/h4>/g)].map(([, href = "", t]) => {
    const [cat, level, course] = href.replace(`/centres/${slug}/`, "").split("/");
    return { title: decode(t), href: cat && level && course && getCourse(cat, level, course) ? `/courses/${cat}/${level}/${course}` : undefined };
  });
  return {
    slug,
    name: titleCase(decode(pick(h, /&larr; Back<\/a>([^<]+)</))).replace(/G-Tec/g, "G-TEC").replace(/Gce/g, "GCE"),
    phones: pick(h, /Phone\s*<p>([^<]*)<\/p>/).split(",").map((x) => x.trim()).filter(Boolean),
    email: pick(h, /Email\s*<p>([^<]*)<\/p>/).trim(),
    about: strip(pick(h, /Gallery\s*<\/li>\s*<\/ul>\s*<p>([\s\S]*?)<\/p>/)),
    address: decode(pick(h, /<\/a>\s*([^<>]+?)\s*<\/p>\s*<h2>Are You Interested/)),
    courses,
    banner: img(p.images.find((u) => u.includes("/public/location/"))),
    photos: p.images.filter((u) => u.includes("/locationimage/")).map((u) => img(u)!),
  };
}
export type Centre = NonNullable<ReturnType<typeof getCentre>>;
export const CENTRES = CENTRE_SLUGS.map(getCentre).filter((c): c is Centre => !!c);

/* ── Blog ── */

const BLOG_KEYS = Object.keys(PAGES).filter((k) => /^\/blog\/[^/]+$/.test(k) && !k.startsWith("/blog/author") && PAGES[k].html);

export function getPost(slug: string) {
  const p = PAGES[`/blog/${slug}`];
  if (!p?.html || !BLOG_KEYS.includes(`/blog/${slug}`)) return undefined;
  // Body sits between the post <h2> (after the WP nav menu) and the "By author" byline; everything after is comments/sidebar.
  const m = p.html.match(/<\/ul>\s*<\/li>\s*<\/ul>\s*<h2>([\s\S]*?)<\/h2>([\s\S]*?)\s*By <a href="\/blog\/author/);
  const body = m?.[2].trim() ?? "";
  return {
    slug,
    title: decode(m?.[1] ?? p.title.replace(/ - G-TEC Education$/, "")),
    date: pick(p.html, /\/">(\w+ \d{1,2}, \d{4})<\/a>/),
    body: body.replace(/href="\/blog\/([^"#]+?)\/"/g, 'href="/blog/$1"'),
    excerpt: strip(pick(body, /<p>([\s\S]*?)<\/p>/)),
    image: img(p.images.find((u) => !u.includes("logo"))),
  };
}
export type Post = NonNullable<ReturnType<typeof getPost>>;
export const POSTS = BLOG_KEYS.map((k) => getPost(k.slice(6))).filter((x): x is Post => !!x);

/* ── News & events ── */

const NEWS_IDS = Object.keys(PAGES).map((k) => k.match(/^\/newsandevent\/(\d+)$/)?.[1]).filter((id): id is string => !!id && !!PAGES[`/newsandevent/${id}`].text);

export function getNewsItem(id: string) {
  const p = NEWS_IDS.includes(id) ? PAGES[`/newsandevent/${id}`] : undefined;
  if (!p) return undefined;
  const m = p.html.match(/Back\s*<\/a>\s*([\s\S]*?)\s+(\d{2}-\d{2}-\d{4})\s*([\s\S]*?)\s*<h2>Recent News/);
  if (!m) return undefined;
  return { id, title: decode(m[1]), date: m[2], body: m[3].replace(/^<p>([\s\S]*)<\/p>$/, "$1"), image: img(p.images.find((u) => u.includes("/public/news/"))) };
}
export type NewsItem = NonNullable<ReturnType<typeof getNewsItem>>;
// Newest first (dates are DD-MM-YYYY).
const sortKey = (d: string) => d.split("-").reverse().join("");
export const NEWS_ITEMS = NEWS_IDS.map(getNewsItem).filter((x): x is NewsItem => !!x).sort((a, b) => sortKey(b.date).localeCompare(sortKey(a.date)));

/* ── Galleries ── */

export const PHOTOS = (PAGES["/photogallery"]?.images ?? []).filter((u) => u.includes("/public/photo/")).map((u) => img(u)!);

export function getVideos() {
  const p = PAGES["/videogallery"];
  if (!p) return [];
  const ids = p.images.map((u) => pick(u, /img\.youtube\.com\/vi\/([\w-]+)\//)).filter(Boolean);
  // Titles are the last N "</a>"-terminated chunks; the first also carries the category filter labels (ending "GZOOM").
  const titles = p.html.split("</a>").map((s) => decode(s.replace(/<[^>]+>/g, " "))).slice(-ids.length - 1, -1).map((t) => t.replace(/^All Videos .*?GZOOM\s+/, ""));
  return ids.map((id, i) => ({ id, title: titles[i] || "G-TEC video" }));
}
