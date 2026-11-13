"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, MotionConfig, useMotionTemplate, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { EASE, useDepth, useFinePointer, useReduced, useRich } from "@/components/motion-kit";
import { COURSES } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * The hero's moving parts share one small state: which field is showing (-1 is the opening photo),
 * whether the visitor has paused the automatic motion, and a way to throw caps.
 */

type Img = { src: string; alt: string };
type Particle = { id: number; cap: boolean; left: number; top: number; y: number; fall: number; x: number; spin: number; size: number; dur: number; delay: number; color: string };

const CYCLE_MS = 3200;
const IDLE_TOSS_MS = 9000;
// Picker labels, in COURSES order. Each is contained in the full course title, so the accessible name still matches.
const SHORT = ["Robotics", "Software", "Multimedia", "Networking", "Finance", "CAD", "Non-IT"];
// What the picker offers: SAP first (G-TEC runs it as its own certification track under Finance), then every programme.
const PICKS: { label: string; title: string; note: string; href: string }[] = [
  {
    label: "SAP",
    title: "SAP Global Certification",
    note: "10 certificate courses",
    href: "/courses/finance-and-business-management/sap-global-certification",
  },
  ...COURSES.map((c, i) => ({ label: SHORT[i], title: c.title, note: c.note, href: `/courses/${c.slug}` })),
];
const CONFETTI = ["#8ec5ff", "#e60000", "#004282", "#ffffff"];

const Ctx = createContext<{
  active: number;
  chosen: number;
  images: Img[];
  paused: boolean;
  setPaused: (p: boolean) => void;
  select: (i: number) => void;
  hold: (h: boolean) => void;
  toss: (count: number) => void;
  particles: Particle[];
} | null>(null);
const useHero = () => useContext(Ctx)!;

/** The first-visit loader covers the hero: nothing plays behind it, and nothing plays off-screen or in a hidden tab. */
const canPlay = () => !document.querySelector('#site-loader[aria-busy="true"]') && !document.hidden && scrollY < innerHeight * 0.8;

let nextId = 0;
function makeBurst(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const cap = i % 2 === 0;
    return {
      id: nextId++,
      cap,
      // Out of the top of the graduates photo, in the collage's lower left.
      left: 8 + Math.random() * 44,
      top: 58 + Math.random() * 10,
      y: 240 + Math.random() * 340,
      fall: 60 + Math.random() * 120,
      x: (Math.random() - 0.5) * 240,
      spin: (Math.random() - 0.5) * 900,
      size: cap ? 26 + Math.random() * 18 : 6 + Math.random() * 6,
      dur: 1.7 + Math.random() * 0.9,
      delay: Math.random() * 0.18,
      color: CONFETTI[i % CONFETTI.length],
    };
  });
}

export function HeroProvider({ images, children }: { images: Img[]; children: React.ReactNode }) {
  const [active, setActive] = useState(-1);
  const [chosen, setChosen] = useState(0);
  const [paused, setPaused] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const held = useRef(false);
  const reduced = useReduced();

  const toss = useCallback((count: number) => {
    const burst = makeBurst(count);
    setParticles((p) => [...p, ...burst]);
    const ids = new Set(burst.map((b) => b.id));
    setTimeout(() => setParticles((p) => p.filter((x) => !ids.has(x.id))), 3200);
  }, []);

  // The automatic motion: stops for reduced motion, for the pause button, and while someone is choosing.
  useEffect(() => {
    if (reduced || paused) return;
    const cycle = setInterval(() => {
      if (!held.current && canPlay()) setActive((a) => (a >= PICKS.length - 1 ? -1 : a + 1));
    }, CYCLE_MS);
    const caps = setInterval(() => {
      if (canPlay()) toss(6);
    }, IDLE_TOSS_MS);
    return () => {
      clearInterval(cycle);
      clearInterval(caps);
    };
  }, [reduced, paused, toss]);

  // One big throw as the hero first settles.
  useEffect(() => {
    if (reduced) return;
    const wait = setInterval(() => {
      if (!canPlay()) return;
      clearInterval(wait);
      setTimeout(() => toss(14), 1500);
    }, 200);
    return () => clearInterval(wait);
  }, [reduced, toss]);

  return (
    <Ctx.Provider value={{ active, chosen, images, paused, setPaused, select: (i) => { setActive(i); setChosen((c) => c + 1); }, hold: (h) => void (held.current = h), toss, particles }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </Ctx.Provider>
  );
}

/** Choose a field: previewing it swaps the big photo; following the link opens the course. */
export function CoursePicker({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const { active, select, hold, paused, setPaused } = useHero();
  const reduced = useReduced();
  return (
    <div className={className} style={style}>
      <div className="mb-2 flex items-center gap-1.5">
        <p className="text-sm font-semibold text-white/90">What do you want to learn?</p>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused(!paused)}
            aria-label={paused ? "Play the hero's automatic motion" : "Pause the hero's automatic motion"}
            className="flex size-7 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white hover:text-blue"
          >
            {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1" onPointerEnter={() => hold(true)} onPointerLeave={() => hold(false)} onFocus={() => hold(true)} onBlur={() => hold(false)}>
        {PICKS.map((c, i) => {
          const on = i === active;
          return (
            <Link
              key={c.label}
              href={c.href}
              aria-label={c.title}
              style={{ "--d": `${0.85 + i * 0.05}s` } as React.CSSProperties}
              onPointerEnter={(e) => e.pointerType === "mouse" && select(i)}
              onFocus={() => select(i)}
              className={cn("hero-fade relative rounded-full border px-2 py-1.5 text-[12.5px] font-semibold transition-colors duration-300 active:scale-[.96]", on ? "border-white text-blue" : "border-white/35 text-white hover:border-white hover:bg-white/10")}
            >
              {on && <motion.span layoutId="hero-pick" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute -inset-px rounded-full bg-white" />}
              <span className="relative">{c.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/** Prints lean toward the cursor, a light slides across the paper, and the photo eases in. Mouse only. */
function useTilt(max: number) {
  const fine = useFinePointer();
  const reduced = useReduced();
  const on = fine && !reduced;
  const spring = { stiffness: 170, damping: 18, mass: 0.5 };
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const zoom = useSpring(1, { stiffness: 120, damping: 20 });
  const lit = useSpring(0, { stiffness: 120, damping: 22 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(380px circle at ${gx}% ${gy}%, rgba(255,255,255,.42), transparent 62%)`;
  return {
    style: { rotateX, rotateY, transformPerspective: 900 },
    zoom,
    glare,
    lit,
    handlers: {
      onPointerMove: (e: React.PointerEvent<HTMLElement>) => {
        if (!on || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        const [px, py] = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
        rotateY.set((px - 0.5) * max * 2);
        rotateX.set((0.5 - py) * max * 2);
        gx.set(px * 100);
        gy.set(py * 100);
        zoom.set(1.09);
        lit.set(1);
      },
      onPointerLeave: () => {
        rotateX.set(0);
        rotateY.set(0);
        zoom.set(1);
        lit.set(0);
      },
    },
  };
}

/** The photo sits a little oversized in its frame, so it can drift (CSS) and slide against the cursor without showing an edge. */
function LivePhoto({ src, alt, focus, zoom, live, priority, onEnded }: { src: string; alt: string; focus?: string; zoom: MotionValue<number>; live: boolean; priority?: boolean; onEnded?: () => void }) {
  const depth = useDepth();
  const video = useRef<HTMLVideoElement>(null);
  const isVideo = src.endsWith(".mp4");
  // A film only plays on the top print, and never for reduced motion: its poster (same name, .jpg) stands in.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (!live) return v.pause();
    v.currentTime = 0;
    v.play().catch(() => {});
  }, [live]);
  return (
    <motion.div style={{ x: depth.ix, y: depth.iy, scale: zoom }} className="absolute -inset-[7%]">
      {isVideo ? (
        <video ref={video} src={src} poster={src.replace(".mp4", ".jpg")} aria-label={alt || undefined} muted loop={!onEnded} onEnded={onEnded} onError={onEnded} playsInline preload="metadata" disablePictureInPicture className="size-full object-cover select-none" style={{ objectPosition: focus }} />
      ) : (
      <img src={src} alt={alt} draggable={false} fetchPriority={priority ? "high" : undefined} className={cn("size-full object-cover select-none", live && "hero-drift")} style={{ objectPosition: focus }} />
      )}
    </motion.div>
  );
}

// How the prints lie in the pile: the top one, then the ones peeking out from under it through the tear.
const PILE = [
  { x: "0%", y: "0%", rotate: 0, scale: 1 },
  { x: "2.6%", y: "2.4%", rotate: 3.4, scale: 0.975 },
  { x: "-2.6%", y: "3.4%", rotate: -3.8, scale: 0.95 },
  { x: "0%", y: "4%", rotate: 0, scale: 0.92 },
];
const DROP_MS = 420;

/**
 * The big photo is a pile of prints, each with its own film. The top one plays; when it ends it
 * drops away and tucks in at the bottom of the pile, and the next one plays.
 */
export function PhotoDeck({ sheets, clip, backing }: { sheets: { src: string; alt: string; focus?: string }[]; clip: string; backing: string }) {
  const reduced = useReduced();
  const tilt = useTilt(9);
  const N = sheets.length;
  // dropping: the print that has just left the top and is still falling clear of the pile.
  const [{ top, dropping }, setDeck] = useState({ top: 0, dropping: -1 });
  useEffect(() => {
    if (dropping < 0) return;
    const t = setTimeout(() => setDeck((d) => ({ ...d, dropping: -1 })), DROP_MS);
    return () => clearTimeout(t);
  }, [dropping]);

  return (
    <motion.div style={tilt.style} className="pointer-events-auto absolute inset-0" {...tilt.handlers}>
      {sheets.map((sheet, i) => {
        const rel = (i - top + N) % N;
        const isTop = rel === 0;
        const isDropping = i === dropping;
        return (
          <motion.div
            key={sheet.src}
            initial={false}
            animate={isDropping ? { x: "-6%", y: "62%", rotate: -9, scale: 0.96 } : PILE[Math.min(rel, PILE.length - 1)]}
            transition={{ duration: isDropping ? DROP_MS / 1000 : 0.7, ease: isDropping ? "easeIn" : EASE }}
            style={{ zIndex: isDropping ? N + 1 : N - rel }}
            className="absolute inset-0"
          >
            <div aria-hidden className="absolute -inset-1.5 translate-y-1.5 bg-[rgba(0,31,66,.16)]" style={{ clipPath: backing }} />
            <div aria-hidden className="absolute -inset-1.5 bg-white" style={{ clipPath: backing }} />
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: clip }}>
              <LivePhoto src={sheet.src} alt={isTop ? sheet.alt : ""} focus={sheet.focus} zoom={tilt.zoom} live={isTop && !reduced} priority={i === 0} onEnded={() => isTop && setDeck({ top: (top + 1) % N, dropping: i })} />
              <motion.div aria-hidden style={{ background: tilt.glare, opacity: tilt.lit }} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// Fixed values, so server and client render the same pieces.
const FALLING = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 37 + 6) % 96,
  delay: -((i * 1.37) % 7),
  dur: 5 + ((i * 3) % 5),
  size: i % 5 === 0 ? 0 : 5 + (i % 4) * 2,
  capSize: 18 + (i % 3) * 5,
  color: CONFETTI[i % CONFETTI.length],
  spin: i % 2 ? 1 : -1,
}));

/** The graduates: a loose print with confetti and caps still coming down inside the picture. Pull it and it springs back; press it to throw the caps. */
export function LoosePhoto({ src, alt, clip, backing, focus, className, delay, tilt: lean }: { src: string; alt: string; clip: string; backing: string; focus: string; className: string; delay: string; tilt: string }) {
  const { toss } = useHero();
  const reduced = useReduced();
  const tilt = useTilt(11);
  const dragged = useRef(false);
  const last = useRef(0);
  return (
    <div className={cn("hero-tear pointer-events-auto absolute", className)} style={{ "--d": delay, "--r": lean } as React.CSSProperties}>
      <motion.div
        drag={!reduced}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.5}
        dragTransition={{ bounceStiffness: 260, bounceDamping: 14 }}
        whileDrag={{ scale: 1.05, rotate: -3 }}
        onDragStart={() => void (dragged.current = true)}
        onDragEnd={() => void setTimeout(() => (dragged.current = false), 60)}
        style={tilt.style}
        {...tilt.handlers}
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse" || reduced || performance.now() - last.current < 1600) return;
          last.current = performance.now();
          toss(5);
        }}
        className="absolute inset-0 touch-pan-y cursor-grab active:cursor-grabbing"
      >
        <div aria-hidden className="absolute -inset-1.5 translate-y-1.5 bg-[rgba(0,31,66,.16)]" style={{ clipPath: backing }} />
        <div aria-hidden className="absolute -inset-1.5 bg-white" style={{ clipPath: backing }} />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: clip }}>
          <LivePhoto src={src} alt={alt} focus={focus} zoom={tilt.zoom} live={!reduced} />
          {!reduced && (
            <div aria-hidden className="absolute inset-0">
              {FALLING.map((f, i) => (
                <span key={i} className="hero-fall" style={{ left: `${f.x}%`, animationDelay: `${f.delay}s`, animationDuration: `${f.dur}s`, "--spin": `${f.spin * 540}deg` } as React.CSSProperties}>
                  {f.size ? <span className="block rounded-[1px]" style={{ width: f.size, height: f.size * 0.6, background: f.color }} /> : <Cap size={f.capSize} />}
                </span>
              ))}
            </div>
          )}
          <motion.div aria-hidden style={{ background: tilt.glare, opacity: tilt.lit }} className="pointer-events-none absolute inset-0 mix-blend-soft-light" />
        </div>
        {!reduced && (
          <button
            type="button"
            onClick={() => {
              if (!dragged.current) toss(16);
            }}
            className="absolute bottom-[9%] left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1.5 text-[12px] font-bold whitespace-nowrap text-blue shadow-[0_8px_20px_rgba(0,31,66,.3)] transition-transform duration-300 ease-out-expo hover:scale-105 active:scale-95"
          >
            Toss the caps
          </button>
        )}
      </motion.div>
    </div>
  );
}

function Cap({ size }: { size: number }) {
  return (
    <svg aria-hidden viewBox="0 0 40 28" width={size} height={size * 0.7}>
      <path d="M11 13v8c0 2 4 5 9 5s9-3 9-5v-8z" fill="#10131c" />
      <path d="M20 1 39 10 20 19 1 10z" fill="#1a1f2c" />
      <path d="M20 10 34 12.500V21" fill="none" stroke="#8ec5ff" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="34" cy="22.500" r="1.800" fill="#8ec5ff" />
    </svg>
  );
}

/** The thrown caps and confetti. Transforms only, removed as soon as they land. */
export function CapLayer() {
  const { particles } = useHero();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0, y: 0, x: 0, rotate: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], y: [0, -p.y, -p.y + p.fall], x: [0, p.x * 0.7, p.x], rotate: [0, p.spin * 0.7, p.spin], scale: [0.5, 1, 1] }}
          transition={{ duration: p.dur, delay: p.delay, ease: "easeOut", opacity: { duration: p.dur, delay: p.delay, times: [0, 0.1, 0.72, 1] } }}
          className="absolute block will-change-transform"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
        >
          {p.cap ? <Cap size={p.size} /> : <span className="block rounded-[1px]" style={{ width: p.size, height: p.size * 0.6, background: p.color }} />}
        </motion.span>
      ))}
    </div>
  );
}

/** The brush stroke redraws itself when a visitor chooses a field, on larger screens. */
export function HeroBrush() {
  const { chosen } = useHero();
  const rich = useRich();
  return (
    <svg data-wave aria-hidden viewBox="0 0 400 420" className="absolute right-[3%] bottom-[5%] h-[32%] w-auto overflow-visible">
      <filter id="hero-brush" x="-10%" y="-10%" width="120%" height="120%">
        {/* Line boil: the edge redraws a few times a second, like hand-drawn animation. Motion.tsx pauses it off-screen. */}
        <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="4">
          <animate attributeName="seed" values="4;9;2;7" dur=".72s" calcMode="discrete" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" scale="7" />
      </filter>
      <g filter="url(#hero-brush)">
        <path key={rich ? chosen : 0} pathLength={1} d="M20 215 300 25 95 345 345 215 372 400" className={cn("hero-brush fill-none stroke-sky", chosen > 0 && "hero-brush-again")} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
