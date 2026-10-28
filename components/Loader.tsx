'use client';

import { useEffect, useState } from 'react';

const KEY = 'gtec-loaded';
const MIN_MS = 1200; // never flash by too fast to read
const MAX_MS = 12000; // never trap the visitor on a slow or broken asset

// Survives client-side navigation (e.g. pressing Back to the home page).
let shownThisVisit = false;

// Runs before hydration: hides the server-rendered loader on a reload / bfcache return within the same session.
const HIDE_IF_SEEN = `try{if(sessionStorage.getItem('${KEY}')){var s=document.createElement('style');s.textContent='#site-loader{display:none!important}';document.head.appendChild(s)}}catch(e){}`;

function waitFor(el: HTMLImageElement | HTMLVideoElement) {
  if (el instanceof HTMLImageElement ? el.complete : el.readyState >= 3) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const done = () => resolve();
    el.addEventListener(el instanceof HTMLImageElement ? 'load' : 'canplay', done, { once: true });
    el.addEventListener('error', done, { once: true });
  });
}

export function Loader() {
  const [isDone, setIsDone] = useState(() => shownThisVisit);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isDone) return;
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(KEY);
    } catch {}
    if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      shownThisVisit = true;
      setIsDone(true);
      return;
    }

    document.body.style.overflow = 'hidden';
    let cancelled = false;

    // Everything the first screen needs: fonts, eager images and page videos. Lazy images load on scroll, so skip them.
    const media = [
      ...Array.from(document.images).filter((img) => img.loading !== 'lazy'),
      ...Array.from(document.querySelectorAll<HTMLVideoElement>('video')).filter((v) => !v.closest('#site-loader')),
    ];
    const tasks: Promise<unknown>[] = [
      document.fonts.ready,
      document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => addEventListener('load', r, { once: true })),
      ...media.map(waitFor),
    ];
    let finished = 0;
    tasks.forEach((t) =>
      t.then(() => {
        if (!cancelled) setProgress(Math.round((++finished / tasks.length) * 100));
      }),
    );

    const finish = () => {
      if (cancelled) return;
      setProgress(100);
      setIsLeaving(true);
      setTimeout(() => !cancelled && setIsDone(true), 600);
    };
    const minDelay = new Promise((r) => setTimeout(r, MIN_MS));
    const maxDelay = new Promise((r) => setTimeout(r, MAX_MS));
    Promise.race([Promise.all([Promise.all(tasks), minDelay]), maxDelay]).then(finish);

    return () => {
      cancelled = true;
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
      <aside
        id="site-loader"
        aria-label="Loading G-TEC Education"
        aria-busy={!isLeaving}
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-600 ease-out select-none ${
          isLeaving ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        {/* Repeating Graph Paper Grid Canvas */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.045)_1px,transparent_1px)] bg-[size:48px_48px]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center px-4">
          <video
            src="/video/loading.mp4"
            autoPlay
            muted
            playsInline
            loop
            className="h-72 w-auto max-w-full object-contain mix-blend-multiply brightness-[1.08] contrast-[1.05] sm:h-96 md:h-[460px]"
          />

          {/* Real progress: fonts, images and videos actually loaded */}
          <div className="mt-4 w-56">
            <div className="h-0.5 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full bg-red transition-[width] duration-300 ease-out" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[11px] tracking-[0.22em] text-ink-2/80 uppercase">
              <span>Getting things ready</span>
              <span className="tabular-nums">{progress}%</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsLeaving(true);
            setTimeout(() => setIsDone(true), 300);
          }}
          className="absolute right-6 bottom-6 p-2 font-mono text-[11px] tracking-widest text-ink-2/60 uppercase transition-colors hover:text-ink"
          aria-label="Skip intro loader"
        >
          Skip &rarr;
        </button>
      </aside>
    </>
  );
}
