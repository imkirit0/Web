"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Scroll reveals, count-up stats, hero parallax and card spotlight for whatever page is mounted. */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // SVG animations ignore the CSS reduced-motion rule, so hold them still here.
    if (reduce) document.querySelectorAll<SVGSVGElement>("[data-wave]").forEach((svg) => svg.pauseAnimations());

    const prepare = () => {
      // [data-stagger] children become reveals with stepped delays.
      document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((g) => {
        const kids = Array.from(g.children) as HTMLElement[];
        const step = Math.min(0.08, 1.2 / kids.length);
        kids.forEach((c, i) => c.setAttribute("data-reveal", String(i * step)));
      });
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        el.style.setProperty("--d", `${parseFloat(el.dataset.reveal || "0")}s`);
      });
    };
    prepare();

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const el = e.target as HTMLElement;
          if (el.dataset.count) countUp(el, reduce);
          else el.classList.add("in");
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    const watch = () => document.querySelectorAll("[data-reveal]:not(.in), [data-count]").forEach((el) => io.observe(el));
    watch();
    // Nodes that arrive later (streamed sections, a hot reload) would otherwise stay hidden for good.
    const added = new MutationObserver((records) => {
      if (!records.some((r) => r.addedNodes.length)) return;
      prepare();
      watch();
    });
    added.observe(document.body, { childList: true, subtree: true });

    // Hero parallax.
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const media = hero?.querySelector<HTMLElement>("[data-hero-media]");
    const copy = hero?.querySelector<HTMLElement>("[data-hero-copy]");
    let raf = 0;
    const onScroll = () => {
      if (raf || !hero) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = hero.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
        if (media) {
          media.style.transform = `scale(${1 + 0.15 * p})`;
          media.style.opacity = String(1 - 0.8 * p);
        }
        if (copy) {
          copy.style.transform = `translateY(${-90 * p}px)`;
          copy.style.opacity = String(Math.max(0, 1 - 1.4 * p));
        }
      });
    };
    if (!reduce && hero) addEventListener("scroll", onScroll, { passive: true });

    // Waves and marquees run forever; don't spend frames on them while they're out of sight.
    const idle = new IntersectionObserver((entries) =>
      entries.forEach(({ target, isIntersecting }) => {
        if (target instanceof SVGSVGElement) {
          if (!reduce) isIntersecting ? target.unpauseAnimations() : target.pauseAnimations();
        } else target.classList.toggle("offscreen", !isIntersecting);
      }),
    );
    document.querySelectorAll("[data-wave], [data-pause-offscreen]").forEach((el) => idle.observe(el));

    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element).closest?.<HTMLElement>("[data-spot]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io.disconnect();
      added.disconnect();
      idle.disconnect();
      removeEventListener("scroll", onScroll);
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}

function countUp(el: HTMLElement, reduce: boolean) {
  const target = parseFloat(el.dataset.count!);
  const dec = (el.dataset.count!.split(".")[1] || "").length;
  const fmt = (v: number) => (dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-US"));
  if (reduce) return void (el.textContent = fmt(target));
  const t0 = performance.now() + 300;
  const frame = (now: number) => {
    const p = Math.min(1, Math.max(0, (now - t0) / 2200));
    el.textContent = fmt(target * Math.sqrt(1 - (p - 1) ** 2)); // circOut
    if (p < 1) requestAnimationFrame(frame);
  };
  el.textContent = fmt(0);
  requestAnimationFrame(frame);
}
