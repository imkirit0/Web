"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, MotionConfig, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, Magnetic, useReduced, useRich } from "@/components/motion-kit";
import { cn, tornEdge } from "@/lib/utils";

const STORAGE = "https://www.gteceducation.com/storage/app/public";

// Every line here is already on the site: About, Perks, the enquiry section and the placements page.
const STOPS = [
  {
    title: "Walk in",
    text: "Tell a counsellor what you want to learn. You get course options, fees and your nearest centre, out of 800+.",
    link: { href: "/centres", label: "Find a centre" },
    img: { src: `${STORAGE}/filemanager/07-08-25-05-08-New%201.jpg`, alt: "Rows of computer workstations in a bright G-TEC centre" },
    seed: 7,
  },
  {
    title: "Learn by building",
    text: "You spend most of your time doing, not just listening, in equipped labs at every centre.",
    link: { href: "/courses", label: "Browse courses" },
    img: { src: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=75", alt: "Engineer working in a lab" },
    seed: 19,
  },
  {
    title: "Get certified",
    text: "Your certificate is accepted across 23 countries, so it still counts if you move abroad or switch jobs.",
    link: { href: "/trainingandcertifications", label: "See certifications" },
    img: { src: "/hero/graduates.jpg", alt: "Graduates in gowns cheering as their caps fly into the air" },
    seed: 31,
  },
  {
    title: "Get placed",
    text: "Job fairs, live vacancies and employer tie-ups. This wall is one week of it: 197 success stories in the first week of January.",
    link: { href: "/placements", label: "See placements" },
    img: { src: `${STORAGE}/placement/20-01-26-02-46-Jan-1st-Week.jpg`, alt: "G-TEC poster titled 197 success stories, January first week, filled with photos of placed students" },
    seed: 43,
    poster: true,
  },
];

const TEAR: [number, number][] = [[1, 2], [99, 0.5], [99.5, 98], [40, 99.5], [0.5, 97]];

type Line = { w: number; h: number; d: string; at: number[] };

/**
 * A brush line through each node. Between stops it swings through a waypoint in the empty gutter, and
 * a Catmull-Rom spline joins them all, so there are no kinks however the stops land.
 */
function drawLine(nodes: { x: number; y: number }[], w: number, h: number): Line {
  const horizontal = w > h;
  const points: { x: number; y: number }[] = [nodes[0]];
  nodes.slice(1).forEach((b, i) => {
    const a = nodes[i];
    const span = Math.hypot(b.x - a.x, b.y - a.y);
    // The closing spans are already routed by hand, under the copy.
    const swing = (i % 2 ? 1 : -1) * (horizontal ? (i >= 1 && i < 4 ? 0.13 : 0) : 0.022) * span;
    if (swing) points.push(horizontal ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + swing } : { x: (a.x + b.x) / 2 + swing, y: (a.y + b.y) / 2 });
    points.push(b);
  });
  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [p0, p1, p2, p3] = [points[Math.max(0, i - 1)], points[i], points[i + 1], points[Math.min(points.length - 1, i + 2)]];
    d += `C${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)} ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  const size = horizontal ? w : h;
  return { w, h, d, at: nodes.map((n) => (horizontal ? n.x : n.y) / size) };
}

/**
 * The page's signature: one sky-blue brush line, drawn by the reader's own scrolling, from walking in
 * to getting hired. Each stop waits in grey ahead of the brush and settles into colour as the line reaches it, and the line ends on the
 * Enquire button. Laptop and up: a pinned strip pans sideways. Phones: the same line runs down the page.
 * Reduced motion: no pin, line already drawn, everything in place.
 */
export function JourneyLine() {
  const track = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const rich = useRich();
  const reduced = useReduced();
  const [line, setLine] = useState<Line | null>(null);
  const [reached, setReached] = useState(0);
  const [pan, setPan] = useState(0);

  const { scrollYProgress } = useScroll({ target: track, offset: rich ? ["start start", "end end"] : ["start 65%", "end 75%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 30, restDelta: 0.0005 });
  const x = useTransform(progress, [0, 1], [0, -pan]);

  // The line is drawn through the real positions of the stops, so it survives any viewport and any copy length.
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const nodes = Array.from(el.querySelectorAll<HTMLElement>(rich ? "[data-node]" : "[data-rail]")).map((n) => {
        const r = n.getBoundingClientRect();
        return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
      });
      setLine(drawLine(nodes, el.scrollWidth, el.scrollHeight));
      setPan(Math.max(0, el.scrollWidth - innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rich]);

  useMotionValueEvent(progress, "change", (p) => {
    if (!line || reduced) return;
    let n = 0;
    line.at.forEach((at, i) => {
      if (p >= at - 0.07) n = i;
    });
    setReached(n);
  });

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="journey-title" className="relative bg-white text-ink">
        <div ref={track} className="lg:motion-safe:h-[300vh]">
          <div className="overflow-clip lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:h-svh lg:motion-safe:min-h-[600px]">
            <motion.div
              ref={strip}
              style={rich ? { x } : undefined}
              className="relative mx-auto flex w-full max-w-[640px] flex-col gap-16 px-6 pt-[clamp(120px,14vw,180px)] pb-24 lg:motion-safe:mx-0 lg:motion-safe:h-full lg:motion-safe:w-max lg:motion-safe:max-w-none lg:motion-safe:flex-row lg:motion-safe:items-center lg:motion-safe:gap-[clamp(110px,10vw,180px)] lg:motion-safe:py-0 lg:motion-safe:pr-[12vw] lg:motion-safe:pl-[max(24px,calc((100vw-1240px)/2))]"
            >
              {line && (
                <svg aria-hidden width={line.w} height={line.h} viewBox={`0 0 ${line.w} ${line.h}`} className="pointer-events-none absolute top-0 left-0 max-w-none">
                  <motion.path
                    d={line.d}
                    style={{ pathLength: reduced ? 1 : progress }}
                    className="fill-none stroke-sky"
                    strokeWidth={rich ? 20 : 9}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              <div className="relative flex-none lg:motion-safe:w-[min(48vw,720px)]">
                <h2 id="journey-title" className="font-display relative text-[clamp(40px,5vw,76px)] leading-[1.02] font-bold tracking-[-.035em]">
                  <span className="block">Walk in unsure.</span>
                  <span className="block">Walk out with a job.</span>
                </h2>
                {/* Where the line starts: off the end of the headline, like a signature. */}
                <span data-node aria-hidden className="absolute top-1/2 -right-8 size-px" />
                <span data-rail aria-hidden className="absolute -bottom-8 left-2 size-px" />
              </div>

              {STOPS.map((s, i) => (
                <Stop key={s.title} stop={s} n={i + 1} on={reduced || reached >= i + 1} lower={i % 2 === 1} />
              ))}

              <div className="relative flex flex-none flex-col items-start gap-5 pl-9 lg:motion-safe:w-[340px] lg:motion-safe:pl-0">
                <span data-rail aria-hidden className="absolute top-1 left-2 size-px" />
                <p className="font-display relative bg-white pr-3 text-[clamp(28px,2.6vw,38px)] leading-[1.1] font-bold tracking-[-.025em] text-balance">The line stops here. Yours starts with a call back.</p>
                <div className="relative">
                  <span data-node aria-hidden className="absolute top-1/2 left-0 size-px" />
                  <span data-rail aria-hidden className="absolute top-1/2 left-0 size-px" />
                  <Magnetic>
                    <a href="#enquire" className="group relative inline-flex items-center gap-2.5 rounded-full bg-blue px-8 py-4.5 text-base font-bold text-white transition-colors hover:bg-blue-dark active:scale-[.97]">
                      Enquire now <ArrowRight className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" strokeWidth={2.4} />
                    </a>
                  </Magnetic>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

function Stop({ stop, n, on, lower }: { stop: (typeof STOPS)[number]; n: number; on: boolean; lower: boolean }) {
  const poster = "poster" in stop;
  return (
    <article className={cn("relative flex-none pl-9 lg:motion-safe:pl-0", poster ? "lg:motion-safe:flex lg:motion-safe:w-[min(72vw,860px)] lg:motion-safe:items-center lg:motion-safe:gap-10" : "lg:motion-safe:w-[clamp(320px,29vw,430px)]", !poster && lower && "lg:motion-safe:translate-y-[7svh]", !poster && !lower && "lg:motion-safe:-translate-y-[5svh]")}>
      <span data-rail aria-hidden className="absolute top-0 left-2 size-px" />
      <div data-node className={cn("relative", poster ? "aspect-[4/5] w-full flex-none lg:motion-safe:h-[clamp(320px,68svh,600px)] lg:motion-safe:w-auto" : "aspect-[4/3] w-full lg:motion-safe:h-[clamp(170px,36svh,330px)]")}>
        <motion.a
          data-mo
          href={stop.link.href}
          aria-label={stop.link.label}
          initial={false}
          animate={on ? { opacity: 1, y: 0, rotate: 0, scale: 1, filter: "grayscale(0)" } : { opacity: 1, y: 14, rotate: lower ? -3 : 3, scale: 0.96, filter: "grayscale(0.7)" }}
          whileHover={{ rotate: lower ? 1.2 : -1.2, scale: 1.025 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="absolute inset-0 block drop-shadow-[0_8px_14px_rgba(0,31,66,.18)]"
        >
          <span aria-hidden className="absolute -inset-1.5 bg-white" style={{ clipPath: tornEdge(TEAR, stop.seed + 5, 0.7) }} />
          <img src={stop.img.src} alt={stop.img.alt} loading="lazy" className={cn("relative size-full object-cover", poster && "object-top")} style={{ clipPath: tornEdge(TEAR, stop.seed, 0.45) }} />
        </motion.a>
        {poster && <span data-node aria-hidden className="absolute right-[6%] bottom-[8%] size-px" />}
      </div>
      <motion.div
        data-mo
        initial={false}
        animate={{ opacity: on ? 1 : 0.82 }}
        transition={{ duration: 0.5 }}
        className={cn("relative mt-5 rounded-lg lg:motion-safe:bg-white", poster && "lg:motion-safe:mt-0 lg:motion-safe:min-w-0 lg:motion-safe:flex-1")}
      >
        <h3 className="font-display flex items-baseline gap-2.5 text-[clamp(26px,2.5vw,36px)] leading-[1.05] font-bold tracking-[-.025em]">
          <span className="text-red tabular-nums">{n}</span>
          {stop.title}
        </h3>
        <p className="mt-2.5 max-w-[42ch] text-[16px] leading-relaxed text-pretty text-ink-2">{stop.text}</p>
        {poster && <span data-node aria-hidden className="absolute -bottom-16 left-1/2 size-px" />}
        <Link href={stop.link.href} className="group mt-3 inline-flex items-center gap-1.5 py-1 text-[15px] font-bold text-blue transition-colors hover:text-red">
          {stop.link.label} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" strokeWidth={2.4} />
        </Link>
      </motion.div>
    </article>
  );
}
