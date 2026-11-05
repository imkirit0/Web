"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, MotionConfig, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, Magnetic, rise, stagger, useReduced } from "@/components/motion-kit";
import { COURSES, type Course } from "@/lib/data";
import { cn } from "@/lib/utils";

type Img = { src: string; alt: string };

const N = COURSES.length;
const ROW = 60; // px per programme row; the sliding highlight moves in whole rows

function Tags({ tags }: { tags: string[] }) {
  return (
    <motion.ul variants={stagger} className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <motion.li key={t} variants={rise} className="rounded-full border border-white/14 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/85">{t}</motion.li>
      ))}
    </motion.ul>
  );
}

function ViewCourse({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.slug}`} className="group inline-flex flex-none items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-navy transition-colors hover:bg-coral hover:text-white active:scale-[.97]">
      View {course.title} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
    </Link>
  );
}

/**
 * Laptop and up: the stage pins while the page scrolls one programme at a time, and the tabs jump
 * to any of them. With reduced motion it doesn't pin (CSS `motion-safe`), and the tabs simply switch.
 */
function Pinned({ images }: { images: Img[] }) {
  const track = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reduce = useReduced();
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  const pinned = () => (track.current?.offsetHeight ?? 0) > innerHeight * 1.5;
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (pinned()) setActive(Math.min(N - 1, Math.floor(p * N)));
  });

  const go = (i: number) => {
    const el = track.current;
    if (!el || !pinned()) return setActive(i);
    const top = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + ((i + 0.5) / N) * (el.offsetHeight - innerHeight), behavior: reduce ? "auto" : "smooth" });
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (active + step + N) % N;
    tabs.current[next]?.focus({ preventScroll: true });
    go(next);
  };

  const course = COURSES[active];

  return (
    <div ref={track} className="hidden lg:block lg:motion-safe:h-[calc(100svh+210vh)]">
      <div className="top-0 h-svh min-h-[600px] motion-reduce:h-[760px] lg:motion-safe:sticky">
        <div className="mx-auto grid h-full w-[min(1240px,100%)] grid-cols-[minmax(250px,.5fr)_minmax(0,1fr)] gap-[clamp(32px,4vw,64px)] px-6 pt-22 pb-7">
          <div className="flex flex-col justify-center">
            <p className="mb-5 text-sm font-semibold text-white/60">
              Programme <span className="text-white tabular-nums">{active + 1}</span> of {N}
            </p>
            <div role="tablist" aria-label="Programmes" aria-orientation="vertical" onKeyDown={onKey} className="relative pl-4">
              <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-white/14" />
              <motion.span aria-hidden style={{ scaleY: scrollYProgress }} className="absolute inset-y-0 left-0 w-px origin-top bg-red motion-reduce:hidden" />
              <motion.span
                aria-hidden
                initial={false}
                animate={{ y: active * ROW }}
                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                className="absolute inset-x-4 top-0 rounded-xl bg-white/8 ring-1 ring-white/10 right-0"
                style={{ height: ROW }}
              />
              {COURSES.map((c, i) => {
                const Icon = c.icon;
                const on = i === active;
                return (
                  <button
                    key={c.slug}
                    ref={(el) => void (tabs.current[i] = el)}
                    type="button"
                    role="tab"
                    id={`course-tab-${i}`}
                    aria-selected={on}
                    aria-controls="course-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => go(i)}
                    style={{ height: ROW }}
                    className={cn("group relative flex w-full items-center gap-3 rounded-xl px-3.5 text-left transition-colors", on ? "text-white" : "text-white/55 hover:text-white")}
                  >
                    <Icon className={cn("size-5 flex-none transition-[color,transform] duration-300 group-hover:scale-110", on ? "text-coral" : "text-sky/70")} strokeWidth={1.8} />
                    <span className="font-display truncate text-[17px] font-semibold tracking-tight">{c.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div id="course-panel" role="tabpanel" aria-labelledby={`course-tab-${active}`} className="flex min-h-0 flex-col">
            <div className="relative min-h-0 flex-1">
              {/* Every photo stays mounted, so switching never waits on the network. */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl bg-deep">
                {images.slice(0, N).map((img, i) => (
                  <motion.img
                    key={img.src}
                    src={img.src}
                    alt={i === active ? img.alt : ""}
                    loading="lazy"
                    initial={false}
                    animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 1.08 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="absolute inset-0 size-full object-cover"
                  />
                ))}
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(200deg,transparent_45%,rgba(5,12,31,.55)_100%)]" />
              </div>
            </div>

            <div className="min-h-[238px] pt-6">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={course.slug} variants={stagger} initial="hidden" animate="show" exit="exit">
                  <motion.h3 variants={rise} className="font-display text-[clamp(32px,3.4vw,48px)] leading-none font-bold tracking-[-.03em]">{course.title}</motion.h3>
                  <motion.p variants={rise} className="mt-3 mb-4 max-w-[60ch] text-[16px] leading-relaxed text-pretty text-white/72">{course.summary}</motion.p>
                  <Tags tags={course.tags} />
                  <motion.div variants={rise} className="mt-5 flex items-center justify-between gap-4">
                    <span className="text-[13px] font-semibold text-white/60">{course.note} · {course.tags.length} modules</span>
                    <Magnetic><ViewCourse course={course} /></Magnetic>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Touch and small screens: a swipeable row where every programme is fully readable, no hover needed. */
function Carousel({ images }: { images: Img[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: scroller });
  return (
    <div className="lg:hidden">
      <div
        ref={scroller}
        role="group"
        tabIndex={0}
        aria-label="Programmes, scroll sideways for more"
        className="flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {COURSES.map((c, i) => {
          const Icon = c.icon;
          return (
            <article key={c.slug} className="flex w-[min(84vw,380px)] flex-none snap-start flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/4">
              <div className="relative aspect-[16/10]">
                <img src={images[i]?.src} alt={images[i]?.alt ?? ""} loading="lazy" className="absolute inset-0 size-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display flex items-center gap-2.5 text-2xl font-bold tracking-tight">
                  <Icon className="size-5 flex-none text-coral" strokeWidth={1.8} />
                  {c.title}
                </h3>
                <p className="mt-2.5 mb-4 text-[15px] leading-relaxed text-white/72">{c.summary}</p>
                <ul className="mb-5 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => <li key={t} className="rounded-full border border-white/14 bg-white/6 px-3 py-1.5 text-xs font-semibold text-white/85">{t}</li>)}
                </ul>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <span className="text-[13px] font-semibold text-white/60">{c.note}</span>
                  <ViewCourse course={c} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div aria-hidden className="mx-6 h-0.5 overflow-hidden rounded-full bg-white/12">
        <motion.div style={{ scaleX: scrollXProgress }} className="h-full origin-left bg-red" />
      </div>
    </div>
  );
}

export function CourseExplorer({ images }: { images: Img[] }) {
  return (
    <MotionConfig reducedMotion="user">
      <Pinned images={images} />
      <Carousel images={images} />
    </MotionConfig>
  );
}
