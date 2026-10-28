import courses from "@/content/courses.json";
import pages from "@/content/pages.json";

// Content scraped from the live site by scripts/scrape.py.
export type CourseItem = { slug: string; title: string; image: string | null; category?: string; duration?: string; body?: string };
export type Level = { slug: string; title: string; courses: CourseItem[] };
export type Category = { slug: string; title: string; intro: string; banner: string | null; levels: Level[] };
export type ScrapedPage = { path: string; title: string; breadcrumb: string[]; images: string[]; text: string; html: string; forms: string[] };

export const CATEGORIES = courses as Category[];
export const PAGES = pages as Record<string, ScrapedPage>;

/** Live titles are ALL CAPS ("HARDWARE & NETWORKING"); show them in title case. */
export const titleCase = (s: string) =>
  s.toLowerCase().replace(/\b([a-z])([a-z]*)/g, (_, a: string, b: string) => (["and", "of", "in", "for", "the"].includes(a + b) ? a + b : a.toUpperCase() + b)).replace(/\b(it|sap|cad|ai|ui|ux|iot|ms|pg|hr)\b/gi, (w) => w.toUpperCase());

export const getCategory = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const getLevel = (cat: string, level: string) => getCategory(cat)?.levels.find((l) => l.slug === level);
export const getCourse = (cat: string, level: string, slug: string) => getLevel(cat, level)?.courses.find((c) => c.slug === slug);
export const courseCount = (c: Category) => c.levels.reduce((n, l) => n + l.courses.length, 0);
