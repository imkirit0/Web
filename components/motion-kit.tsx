"use client";

import { createContext, Fragment, useContext, useEffect, useRef, useSyncExternalStore } from "react";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, type MotionValue, type Variants } from "framer-motion";

/**
 * Shared motion primitives for the landing page. Anything that starts hidden carries `data-mo`:
 * globals.css forces it visible when `html.motion` is absent (no JS, or reduced motion).
 */

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Parent/child pair for staggered lists. */
export const stagger: Variants = { show: { transition: { staggerChildren: 0.06 } }, exit: { opacity: 0, transition: { duration: 0.14 } } };
export const rise: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };

function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => matchMedia(query).matches,
    () => false, // server and first client render agree, so no hydration mismatch
  );
}

export const useReduced = () => useMedia("(prefers-reduced-motion: reduce)");
export const useFinePointer = () => useMedia("(hover: hover) and (pointer: fine)");
/** Scroll choreography runs at laptop width and up; phones keep plain, fast scrolling. */
export const useRich = () => {
  const reduced = useReduced();
  const wide = useMedia("(min-width: 1024px)");
  return wide && !reduced;
};

/** Thin reading-progress bar at the very top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[61] h-[3px] origin-left bg-red motion-reduce:hidden" />;
}

/** Drifts toward the cursor and springs back. Mouse only: touch and reduced motion get a plain button. */
export function Magnetic({ children, strength = 0.28, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const fine = useFinePointer();
  const reduced = useReduced();
  const on = fine && !reduced;
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 220, damping: 18, mass: 0.4 };
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);
  return (
    <motion.span
      style={{ x, y }}
      className={className ?? "inline-block"}
      onPointerMove={(e) => {
        if (!on) return;
        const r = e.currentTarget.getBoundingClientRect();
        rawX.set((e.clientX - r.left - r.width / 2) * strength);
        rawY.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Moves at its own speed while crossing the viewport. Off on small screens and reduced motion. */
export function Parallax({ y = [36, -36], className, children }: { y?: [number, number]; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useRich();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const value = useTransform(scrollYProgress, [0, 1], y);
  return <motion.div ref={ref} style={on ? { y: value } : undefined} className={className}>{children}</motion.div>;
}

/* ── Hero depth: each collage layer follows the cursor and the scroll at its own rate ── */

const DepthContext = createContext<{ x: MotionValue<number>; y: MotionValue<number>; ix: MotionValue<number>; iy: MotionValue<number>; scroll: MotionValue<number>; rich: React.RefObject<boolean> } | null>(null);
/** `ix`/`iy` slide a photo against its frame, the way a view shifts through a window. */
export const useDepth = () => useContext(DepthContext)!;

export function HeroDepth({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useRich();
  const fine = useFinePointer();
  const reduced = useReduced();
  const rich = useRef(false);
  rich.current = on;
  const lastMove = useRef(-Infinity);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 50, damping: 18 });
  const y = useSpring(rawY, { stiffness: 50, damping: 18 });
  const ix = useTransform(x, (v) => v * -46);
  const iy = useTransform(y, (v) => v * -34);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  useEffect(() => {
    if (!on || !fine) return;
    const move = (e: PointerEvent) => {
      if (scrollY > innerHeight) return;
      lastMove.current = performance.now();
      rawX.set(e.clientX / innerWidth - 0.5);
      rawY.set(e.clientY / innerHeight - 0.5);
    };
    addEventListener("pointermove", move, { passive: true });
    return () => removeEventListener("pointermove", move);
  }, [on, fine, rawX, rawY]);

  // Left alone (always, on touch), the collage keeps drifting slowly, as if on a breeze.
  useAnimationFrame((t) => {
    if (reduced || scrollY > innerHeight || t - lastMove.current < 2500) return;
    rawX.set(Math.sin(t / 3400) * 0.35);
    rawY.set(Math.cos(t / 4300) * 0.3);
  });

  return (
    <div ref={ref} className={className}>
      <DepthContext.Provider value={{ x, y, ix, iy, scroll: scrollYProgress, rich }}>{children}</DepthContext.Provider>
    </div>
  );
}

/** `depth` is px of travel across the screen (negative moves against the cursor), `scroll` is px over the hero's height, `tilt` is degrees of 3D lean. Phones get a third of the travel and no scroll offset. */
export function DepthLayer({ depth, scroll, tilt = 0, children }: { depth: number; scroll: number; tilt?: number; children: React.ReactNode }) {
  const c = useContext(DepthContext)!;
  const k = () => (c.rich.current ? 1 : 0.35);
  const x = useTransform(c.x, (v) => v * depth * k());
  const y = useTransform([c.y, c.scroll], ([py, s]: number[]) => py * depth * k() + (c.rich.current ? s * scroll : 0));
  const rotateY = useTransform(c.x, (v) => v * tilt);
  const rotateX = useTransform(c.y, (v) => -v * tilt);
  return <motion.div style={{ x, y, rotateX, rotateY, transformPerspective: 1100 }} className="pointer-events-none absolute inset-0">{children}</motion.div>;
}

/* ── Text reveals ── */

/** Headline whose words rise out of a mask when it enters the viewport. */
export function RiseWords({ text, className }: { text: string; className?: string }) {
  return (
    <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }} transition={{ staggerChildren: 0.07 }} className={className}>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          <span className="-mb-[.12em] inline-block overflow-hidden pb-[.12em] align-top">
            <motion.span data-mo variants={{ hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.9, ease: EASE } } }} className="inline-block">{w}</motion.span>
          </span>{" "}
        </Fragment>
      ))}
    </motion.h2>
  );
}

export type WordPart = { text: string; className?: string } | { node: React.ReactNode };

function ScrollWord({ part, i, total, progress }: { part: WordPart; i: number; total: number; progress: MotionValue<number> }) {
  const range = [i / total, Math.min(1, (i + 2) / total)];
  const opacity = useTransform(progress, range, [0.14, 1]);
  const scale = useTransform(progress, range, [0.5, 1]);
  if ("node" in part) return <motion.span data-mo style={{ opacity, scale }} className="inline-block align-middle">{part.node}</motion.span>;
  return <motion.span data-mo style={{ opacity }} className={part.className}>{part.text} </motion.span>;
}

/** Statement headline that inks in word by word as it scrolls up the page; inline photos grow into place. */
export function ScrollWords({ parts, className }: { parts: WordPart[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "center 52%"] });
  return (
    <h2 ref={ref} className={className}>
      {parts.map((part, i) => <ScrollWord key={i} part={part} i={i} total={parts.length} progress={scrollYProgress} />)}
    </h2>
  );
}

/** Sky brush stroke that draws itself on when scrolled into view: the hero's mark, repeated. */
export function BrushStroke({ d, viewBox, className }: { d: string; viewBox: string; className?: string }) {
  return (
    <svg aria-hidden viewBox={viewBox} className={className}>
      <motion.path
        d={d}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="fill-none stroke-sky"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
