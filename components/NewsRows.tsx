"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";

type Item = { date: string; title: string; url: string; image: string };

/**
 * Editorial list. With a mouse, the hovered row's photo floats in the space kept free on its right
 * and leans toward the cursor; it never covers the headline. Touch shows the photo inline.
 */
export function NewsRows({ items }: { items: Item[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState(-1);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 22, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 180, damping: 22, mass: 0.5 });

  return (
    <div
      ref={box}
      className="relative border-t border-ink/12"
      onPointerMove={(e) => {
        const r = box.current!.getBoundingClientRect();
        rawX.set(((e.clientX - r.left) / r.width - 0.5) * 48);
        rawY.set(e.clientY - r.top);
      }}
      onPointerLeave={() => setHot(-1)}
    >
      <div data-stagger>
        {items.map((n, i) => (
          <a
            key={n.url}
            href={n.url}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHot(i)}
            className="group relative isolate grid grid-cols-[88px_1fr] items-center gap-x-4 gap-y-2 overflow-hidden border-b border-ink/12 py-5 transition-colors duration-300 hover:text-white focus-visible:text-white md:grid-cols-[150px_1fr_auto] md:gap-x-8 md:py-8 md:pr-6"
          >
            <span aria-hidden className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-blue transition-transform duration-500 ease-out-expo group-hover:scale-y-100 group-focus-visible:scale-y-100" />
            <img src={n.image} alt="" loading="lazy" className="row-span-2 aspect-square size-full rounded-xl object-cover object-top md:hidden" />
            <span className="text-[13px] font-bold tracking-wide text-blue transition-colors group-hover:text-white/80 group-focus-visible:text-white/80 md:pl-6 md:text-sm">{n.date}</span>
            <h3 className="font-display text-[19px] leading-tight font-bold tracking-tight text-balance transition-transform duration-500 ease-out-expo group-hover:translate-x-2 md:text-[clamp(24px,2.6vw,36px)] lg:pr-[300px]">{n.title}</h3>
            <span aria-hidden className="hidden size-12 flex-none items-center justify-center rounded-full border border-current transition-transform duration-500 ease-out-expo group-hover:-rotate-45 md:flex">
              <ArrowRight className="size-5" strokeWidth={2.2} />
            </span>
          </a>
        ))}
      </div>
      <motion.div
        aria-hidden
        style={{ x, y, translateY: "-50%" }}
        animate={{ opacity: hot >= 0 ? 1 : 0, scale: hot >= 0 ? 1 : 0.85, rotate: hot >= 0 ? -3 : 3 }}
        transition={{ duration: 0.3 }}
        initial={false}
        className="pointer-events-none absolute top-0 right-24 z-10 hidden aspect-[4/3] w-60 overflow-hidden rounded-2xl bg-mist shadow-[0_24px_60px_rgba(11,26,51,.35)] [@media(hover:hover)_and_(min-width:1024px)]:block"
      >
        {items.map((n, i) => (
          <img key={n.url} src={n.image} alt="" loading="lazy" className={`absolute inset-0 size-full object-cover object-top transition-opacity duration-300 ${i === hot ? "opacity-100" : "opacity-0"}`} />
        ))}
      </motion.div>
    </div>
  );
}
