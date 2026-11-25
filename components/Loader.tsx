'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionTemplate, useSpring, useTransform } from 'framer-motion';

const KEY = 'gtec-loaded';
const MIN_MS = 1400; // long enough to see the logo assemble
const MAX_MS = 2800; // never trap the visitor on a slow or broken asset
const LIFT_MS = 1000; // the logo rising out plus the blue dissolving

// Survives client-side navigation (e.g. pressing Back to the home page).
let shownThisVisit = false;

// Runs before hydration, with no wait on the JavaScript bundle. Hides the server-rendered loader on a reload /
// bfcache return within the same session, and steps aside if the bundle is so slow that the loader hasn't started
// after BAIL_MS: the page's content has already arrived by then, so nobody should be kept from it.
const BAIL_MS = 4000;
const HIDE_IF_SEEN = `(function(){function h(){var s=document.createElement('style');s.textContent='#site-loader{display:none!important}';document.head.appendChild(s);document.documentElement.classList.add('loader-seen')}try{if(sessionStorage.getItem('${KEY}'))h()}catch(e){}setTimeout(function(){if(!window.__gtecLoaderLive)h()},${BAIL_MS})})()`;

const EASE = [0.22, 1, 0.36, 1] as const;
const LETTERS = ['g', 'dash', 't', 'e', 'c'];
// The layers in public/loader are the real logo, cut apart (they stack back into it exactly).
const part = (name: string) => `/loader/${name}.webp`;

function waitFor(el: HTMLImageElement) {
  if (el.complete) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const done = () => resolve();
    el.addEventListener('load', done, { once: true });
    el.addEventListener('error', done, { once: true });
  });
}

/**
 * The logo builds itself: letters rise, the cap lands, and the red ring sweeps round as the page
 * really loads. When it's ready the logo springs up out of frame and the blue dissolves while the
 * page glides forward from behind. Reduced motion and repeat visits skip it altogether.
 */
export function Loader() {
  const [isDone, setIsDone] = useState(() => shownThisVisit);
  const [isLeaving, setIsLeaving] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const timer = useRef(0);

  const lift = () => {
    // The hero's camera push starts on this, so the page comes forward as the sheet goes up.
    dispatchEvent(new Event('gtec:lift'));
    setIsLeaving(true);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setIsDone(true), LIFT_MS);
  };

  const eased = useSpring(0, { stiffness: 70, damping: 20 });
  const sweep = useTransform(eased, [0, 100], [0, 200]);
  // Centre and start angle come from the ring's position in the logo; it sweeps anticlockwise from the cap.
  const mask = useMotionTemplate`conic-gradient(from 318deg at 28.8% 54.3%, transparent calc(360deg - ${sweep}deg), #000 0)`;

  useEffect(() => void eased.set(progress), [progress, eased]);

  useEffect(() => {
    if (isDone) return;
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(KEY);
    } catch {}
    // The inline script may already have stood the loader down on a very slow connection.
    if (seen || document.documentElement.classList.contains('loader-seen') || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shownThisVisit = true;
      // The server-rendered sheet still says busy until React removes it: stand it down now and send the lift,
      // so the hero's films (which wait on either) start instead of waiting on a loader that never runs.
      document.getElementById('site-loader')?.setAttribute('aria-busy', 'false');
      dispatchEvent(new Event('gtec:lift'));
      setIsDone(true);
      return;
    }

    (window as Window & { __gtecLoaderLive?: boolean }).__gtecLoaderLive = true;
    document.body.style.overflow = 'hidden';
    let cancelled = false;

    // The logo's own parts first, so nothing animates before it can be seen.
    const parts = Array.from(stage.current?.querySelectorAll('img') ?? []);
    Promise.all(parts.map(waitFor)).then(() => !cancelled && setReady(true));

    // Everything the first screen needs: fonts, eager images. Lazy images load on scroll, so skip them.
    const media = Array.from(document.images).filter((img) => img.loading !== 'lazy');
    const tasks: Promise<unknown>[] = [
      document.fonts.ready,
      document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => addEventListener('load', r, { once: true })),
      ...media.map(waitFor),
    ];
    // Real progress, but the ring never outruns the minimum time, so it always reads as a sweep.
    let finished = 0;
    const started = performance.now();
    const tick = setInterval(() => {
      const real = (finished / tasks.length) * 100;
      const paced = ((performance.now() - started) / MIN_MS) * 100;
      setProgress(Math.round(Math.min(real, paced)));
    }, 60);
    tasks.forEach((t) => t.then(() => void finished++));

    const minDelay = new Promise((r) => setTimeout(r, MIN_MS));
    const maxDelay = new Promise((r) => setTimeout(r, MAX_MS));
    let doneTimer = 0;
    Promise.race([Promise.all([Promise.all(tasks), minDelay]), maxDelay]).then(() => {
      if (cancelled) return;
      clearInterval(tick);
      setProgress(100);
      // A beat for the ring to close before the cap goes up.
      doneTimer = window.setTimeout(() => !cancelled && lift(), 260);
    });

    return () => {
      cancelled = true;
      clearInterval(tick);
      clearTimeout(doneTimer);
      clearTimeout(timer.current);
    };
  }, [isDone]);

  useEffect(() => {
    if (!isDone) return;
    shownThisVisit = true;
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {}
    document.body.style.overflow = '';
  }, [isDone]);

  if (isDone) return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: HIDE_IF_SEEN }} />
      <aside id="site-loader" aria-label="Loading G-TEC Education" aria-busy={!isLeaving} className={`fixed inset-0 z-[9999] overflow-hidden select-none ${isLeaving ? 'pointer-events-none' : ''}`}>
        {/* No curtain: the blue simply dissolves once the logo is on its way up, and the hero glides in from behind. */}
        <motion.div initial={false} animate={{ opacity: isLeaving ? 0 : 1 }} transition={{ duration: 0.6, delay: isLeaving ? 0.3 : 0, ease: 'easeOut' }} className="absolute inset-0 bg-blue">
          <div className="absolute inset-0 flex items-center justify-center px-6">
            {/* .loader-logo-out (globals.css): a small dip, then the logo shoots up and out of frame. */}
            <div ref={stage} className={`relative aspect-[2828/1725] w-[min(78vw,640px)] ${isLeaving ? 'loader-logo-out' : ''}`}>
              <motion.img src={part('ring')} alt="" fetchPriority="high" style={{ maskImage: mask, WebkitMaskImage: mask }} className="absolute inset-0 size-full" />
              {LETTERS.map((name, i) => (
                <motion.img
                  key={name}
                  src={part(name)}
                  alt=""
                  fetchPriority="high"
                  initial={{ opacity: 0, y: '9%' }}
                  animate={ready ? { opacity: 1, y: '0%' } : undefined}
                  transition={{ duration: 0.7, delay: 0.08 + i * 0.07, ease: EASE }}
                  className="absolute inset-0 size-full"
                />
              ))}
              <motion.img
                src={part('education')}
                alt=""
                fetchPriority="high"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={ready ? { clipPath: 'inset(0 0% 0 0)' } : undefined}
                transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
                className="absolute inset-0 size-full"
              />
              {/* The cap drops on and settles; it leaves with the rest of the logo. */}
              <motion.img
                src={part('cap')}
                alt=""
                fetchPriority="high"
                initial={{ opacity: 0, y: '-70%', rotate: -16 }}
                animate={ready || isLeaving ? { opacity: 1, y: '0%', rotate: 0 } : undefined}
                transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.3 }}
                style={{ originX: 0.285, originY: 0.19 }}
                className="absolute inset-0 size-full"
              />
            </div>
          </div>

          <div className="absolute inset-x-0 top-0 h-svh">
            <motion.span initial={false} animate={{ opacity: isLeaving ? 0 : 1 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm font-semibold text-white/80 tabular-nums">
              {progress}%
            </motion.span>
          </div>
        </motion.div>

        <button
          type="button"
          onClick={() => {
            setProgress(100);
            lift();
          }}
          aria-label="Skip intro"
          className={`absolute right-6 bottom-5 p-2 text-sm font-semibold text-white/80 transition hover:text-white ${isLeaving ? 'opacity-0' : ''}`}
        >
          Skip
        </button>
      </aside>
    </>
  );
}
