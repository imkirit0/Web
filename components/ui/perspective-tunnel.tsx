"use client";

import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
  MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Perspective gathering: each student's card travels out of the distance as the page scrolls through
 * a pinned stage, then stays, so the section ends with the people arranged around the heading. Driven
 * by page scroll (never a captured wheel), so it works on touch. The pointer pans the camera.
 */

export type TunnelItem = { key: string; node: React.ReactNode; label: string };

// Where each card comes to rest, as shares of the stage, clear of the heading in the centre.
const REST_WIDE: [number, number, number][] = [
  [-0.25, -0.3, -3],
  [0.25, 0.3, 3],
  [0.4, -0.02, 4],
  [-0.4, 0.02, -4],
  [0.25, -0.3, 2],
  [-0.25, 0.3, -2],
];
// Phones: a row above the heading and a row below it.
const REST_NARROW: [number, number, number][] = [
  [-0.31, -0.32, -3],
  [0.31, 0.32, 3],
  [0, -0.34, 2],
  [0, 0.34, -2],
  [0.31, -0.32, 3],
  [-0.31, 0.32, -3],
];

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };
// Cards are drawn at this size and scaled, so their contents never reflow.
const BASE_W = 240;
// The stage never gets shorter than this, so the rows always clear the heading.
const MIN_STAGE_H = 660;

type StageDimensions = { width: number; height: number; isMobile: boolean };

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_CONFIG);
  const y = useSpring(rawY, SPRING_CONFIG);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

function TunnelCard({
  item,
  index,
  progress,
  pointer,
  total,
  stage,
  onSelect,
}: {
  item: TunnelItem;
  index: number;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: StageDimensions;
  onSelect?: () => void;
}) {
  const start = (index / total) * 0.5;
  const local = useTransform(progress, [start, start + 0.45], [0, 1]);
  const z = useTransform(local, [0, 1], [stage.isMobile ? -500 : -700, 0]);
  const opacity = useTransform(local, [0, 0.45], [0, 1]);
  // Cards still fading in must not catch clicks.
  const pointerEvents = useTransform(opacity, (o) => (o > 0.3 ? "auto" : "none"));

  const [rx, ry, rotationZ] = (stage.isMobile ? REST_NARROW : REST_WIDE)[index % 6];
  const cardWidth = stage.isMobile ? stage.width * 0.29 : Math.max(150, Math.min(230, stage.width * 0.15));
  const baseX = rx * stage.width;
  const baseY = ry * Math.max(stage.height, MIN_STAGE_H);
  const panStrength = stage.isMobile ? 6 : 22;

  const transform = useTransform([z, pointer.x, pointer.y], ([currZ, px, py]: number[]) => {
    const offsetX = baseX - px * panStrength;
    const offsetY = baseY - py * panStrength;
    return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${rotationZ}deg)`;
  });

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      style={{ width: cardWidth, transform, opacity, pointerEvents, zIndex: index + 1 }}
      className="group absolute top-1/2 left-1/2 aspect-[4/5] cursor-pointer select-none will-change-transform"
    >
      <span className="sr-only">{item.label}: </span>
      <div className="relative size-full overflow-hidden rounded-[26px] shadow-2xl shadow-ink/20 ring-1 ring-ink/10 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-blue/30 group-hover:ring-red/60">
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: BASE_W, height: BASE_W * 1.25, transform: `scale(${cardWidth / BASE_W})` }}
        >
          {item.node}
        </div>
      </div>
    </motion.button>
  );
}

export function PerspectiveTunnel({
  items,
  onSelect,
  children,
  className,
}: {
  items: TunnelItem[];
  onSelect?: (index: number) => void;
  /** Heading in the centre; the cards gather around it. */
  children?: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const [stage, setStage] = useState<StageDimensions>({ width: 1440, height: 900, isMobile: false });

  useEffect(() => {
    const updateDimensions = () =>
      setStage({ width: window.innerWidth, height: window.innerHeight, isMobile: window.innerWidth < 768 });
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.0001 });

  const pointer = useCameraParallax(!reduce);

  const titleScale = useTransform(smoothProgress, [0, 1], [0.94, 1]);
  const promptOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);

  return (
    <div ref={containerRef} className={cn("relative h-[240vh]", className)}>
      <div
        className="sticky top-0 flex h-svh min-h-[660px] w-full items-center justify-center overflow-hidden select-none"
        style={{ perspective: stage.isMobile ? "900px" : "1200px", transformStyle: "preserve-3d" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] [background-size:28px_28px] opacity-70" />

        <motion.div style={{ scale: titleScale }} className="relative z-20 flex max-w-[34rem] flex-col items-center px-6 text-center">
          {children}
        </motion.div>

        <motion.div
          style={{ opacity: promptOpacity }}
          className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2 text-sm font-semibold text-ink-2"
        >
          <span>Keep scrolling</span>
          <div className="h-6 w-px bg-linear-to-b from-red to-transparent" />
        </motion.div>

        <div className="pointer-events-none absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {items.map((item, i) => (
            <TunnelCard
              key={item.key}
              item={item}
              index={i}
              progress={smoothProgress}
              pointer={pointer}
              total={items.length}
              stage={stage}
              onSelect={onSelect && (() => onSelect(i))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PerspectiveTunnel;
