import Link from "next/link";
import { ArrowRight, Award, Briefcase, Check, ChevronDown, FlaskConical, Globe2, Landmark, Mail, MessageCircle, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Stories } from "@/components/Stories";
import { GlobeNetwork } from "@/components/GlobeNetwork";
import { TiltedGridHero } from "@/components/ui/tilted-grid-hero";
import GlassFolder, { type ArtPreset } from "@/components/ui/glass-folder-cards";
import {
  AFFILIATIONS,
  CONTACT,
  COURSES,
  FLASH,
  NEWS,
  STATS,
  SUBSIDIARIES,
  type Course,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const SITE = "https://www.gteceducation.com";
const wrap = "mx-auto w-[min(1240px,100%)] px-6";
const h2 = "font-display text-[clamp(32px,4.2vw,54px)] font-bold leading-[1.06] tracking-[-.025em] text-balance";
const section = "py-[clamp(80px,9vw,136px)]";
const blob = "animate-float pointer-events-none absolute rounded-full";

export function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div data-reveal="0" className={cn("mb-5 flex items-center gap-3 text-xs font-bold tracking-[.18em] uppercase", light ? "text-red" : "text-coral")}>
      <span className="h-0.5 w-7 bg-red" />
      {children}
    </div>
  );
}

function Arrow({ className }: { className?: string }) {
  return <ArrowRight className={cn("size-4", className)} strokeWidth={2.4} />;
}

/* ── Hero (home) ───────────────────────────────────────────── */

/** Rough paper edge: a CSS polygon that wobbles along the outline through `corners` (percentages). Seeded, so server and client always match. */
function tornEdge(corners: [number, number][], seed: number, rough = 0.5) {
  let n = seed;
  let step = 0;
  // Slow drift plus fine grain, so the edge wanders like torn paper instead of a regular zigzag.
  const wobble = () => Math.sin(++step * 0.37 + seed) * rough * 1.6 + ((n = (n * 16807) % 2147483647) / 2147483647 - 0.5) * rough;
  const points = corners.flatMap(([x, y], i) => {
    const [nx, ny] = corners[(i + 1) % corners.length];
    const steps = Math.max(2, Math.round(Math.hypot(nx - x, ny - y) / 1.6));
    return Array.from({ length: steps }, (_, s) => `${(x + ((nx - x) * s) / steps + wobble()).toFixed(1)}% ${(y + ((ny - y) * s) / steps + wobble()).toFixed(1)}%`);
  });
  return `polygon(${points.join(",")})`;
}

const HERO_TOP_TEAR: [number, number][] = [[1, 3], [99, 1], [100, 98], [80, 98], [66, 84], [42, 78], [18, 72], [3, 42]];
const HERO_LOW_TEAR: [number, number][] = [[4, 5], [97, 1], [100, 91], [7, 99], [1, 58]];

function TornPhoto({ src, alt, tear, seed, focus, className }: { src: string; alt: string; tear: [number, number][]; seed: number; focus: string; className: string }) {
  return (
    <div className={cn("absolute drop-shadow-[0_6px_10px_rgba(0,31,66,.16)]", className)}>
      <div aria-hidden className="absolute -inset-1.5 bg-white" style={{ clipPath: tornEdge(tear, seed + 7, 0.8) }} />
      <img src={src} alt={alt} fetchPriority="high" className="relative size-full object-cover" style={{ clipPath: tornEdge(tear, seed), objectPosition: focus }} />
    </div>
  );
}

function HeroChip({ icon: Icon, className, children }: { icon: typeof Award; className: string; children: React.ReactNode }) {
  return (
    <div className={cn("absolute flex items-center gap-2 rounded-md bg-white px-3 py-2 text-[13px] font-semibold whitespace-nowrap text-ink shadow-[0_8px_24px_rgba(0,31,66,.2)] sm:text-sm", className)}>
      <Icon className="size-4 flex-none text-blue" />
      {children}
    </div>
  );
}

export function Hero() {
  return (
    <section data-hero className="relative overflow-hidden bg-white pt-18 text-blue">
      <div aria-hidden className="absolute inset-x-0 bottom-0 isolate h-[clamp(96px,14vh,140px)] bg-blue">
        <WaveDivider fill="fill-white" begin="-11s" height="h-[clamp(36px,4.5vw,70px)]" />
      </div>

      <div className={cn(wrap, "relative grid gap-8 lg:min-h-[max(620px,calc(100svh-4.5rem))] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]")}>
        <div data-hero-copy className="flex flex-col justify-center pt-[clamp(36px,6vh,64px)] lg:pb-[calc(clamp(96px,14vh,140px)+32px)]">
          <h1 className="font-display mb-6 text-[clamp(42px,5.2vw,76px)] leading-[1.02] font-bold tracking-[-.035em]">
            {["Making", "Professionals", "Globally."].map((w, i) => (
              <span key={w} className="-mb-[.1em] block overflow-hidden pb-[.1em]">
                <span className="hero-word" style={{ "--i": i } as React.CSSProperties}>{w}</span>
              </span>
            ))}
          </h1>
          <p className="hero-fade mb-7 max-w-[520px] text-[clamp(16px,1.3vw,18px)] leading-relaxed text-pretty text-ink-2" style={{ "--d": ".55s" } as React.CSSProperties}>
            For 25 years we&apos;ve helped students learn IT, pick up real skills and land jobs they&apos;re proud of. Today
            that&apos;s 800+ centres in 23 countries, and employers know our name.
          </p>
          <div className="hero-fade flex flex-wrap items-center gap-3" style={{ "--d": ".7s" } as React.CSSProperties}>
            <a href="#enquire" className="inline-flex items-center rounded-lg bg-blue px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-blue-dark">
              Enquire Now
            </a>
            <Link href="/courses" className="inline-flex items-center rounded-lg border border-blue/30 bg-white px-6 py-3.5 text-[15px] font-semibold text-blue transition-colors hover:border-blue hover:bg-ice">
              Explore Courses
            </Link>
          </div>
          <dl className="hero-fade mt-9 flex flex-wrap gap-x-9 gap-y-4 border-t border-blue/15 pt-6" style={{ "--d": ".85s" } as React.CSSProperties}>
            {STATS.slice(1, 4).map((s) => (
              <div key={s.label}>
                <dd className="font-display text-[clamp(26px,2.4vw,34px)] leading-none font-bold tracking-tight">{s.value}{s.suffix}</dd>
                <dt className="mt-1.5 text-[13px] font-semibold text-ink-2">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative h-[clamp(440px,100vw,600px)] lg:h-auto">
          <div aria-hidden className="absolute top-[1%] right-0 h-[5%] w-[52%] bg-sky" style={{ clipPath: tornEdge([[0, 45], [100, 0], [100, 100], [0, 100]], 11, 8) }} />
          <TornPhoto src={unsplash("1522202176988-66273c2fd55f")} alt="Students laughing together around their laptops" tear={HERO_TOP_TEAR} seed={23} focus="62% 40%" className="top-[3%] -right-[6%] h-[60%] w-full" />
          <TornPhoto src="/hero/graduates.jpg" alt="Graduates in gowns cheering as their caps fly into the air" tear={HERO_LOW_TEAR} seed={41} focus="50% 80%" className="bottom-[5%] left-0 h-[44%] w-[58%]" />

          <HeroChip icon={Award} className="top-[9%] right-[2%]">ISO-certified</HeroChip>
          <HeroChip icon={Landmark} className="top-[7%] left-[10%]">Government partner</HeroChip>

          <svg aria-hidden viewBox="0 0 400 420" className="absolute right-[3%] bottom-[5%] h-[32%] w-auto overflow-visible">
            <filter id="hero-brush" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="4" />
              <feDisplacementMap in="SourceGraphic" scale="7" />
            </filter>
            <path d="M20 215 300 25 95 345 345 215 372 400" filter="url(#hero-brush)" className="fill-none stroke-sky" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <div data-stagger className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-px overflow-hidden rounded-[22px] border border-white/12 bg-white/12 backdrop-blur-lg">
      {STATS.map((s) => (
        <div key={s.label} className="bg-navy/60 px-6.5 py-5.5">
          <div className="font-display text-[34px] leading-none font-bold tracking-tight">
            <span data-count={s.value}>{s.value.toLocaleString("en-US")}</span>
            <span className="text-coral">{s.suffix}</span>
          </div>
          <div className="mt-2 text-[13px] font-medium text-white/60">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Page hero (inner pages) ───────────────────────────────── */

/** Layered navy backdrop shared by every inner-page header: fine grid, brand glows, fade at the bottom. */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_70%_at_70%_20%,#000_20%,transparent_75%)] bg-[size:56px_56px]" />
      <div className="absolute -top-40 right-[-10%] size-[640px] rounded-full bg-[radial-gradient(circle,rgba(0,102,204,.42),transparent_62%)] blur-[30px]" />
      <div className="absolute top-[30%] left-[-12%] size-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,1,0,.16),transparent_65%)] blur-[40px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-navy pt-[clamp(140px,16vw,184px)] pb-[clamp(56px,7vw,96px)]">
      <HeroBackdrop />
      <div className={cn(wrap, "relative")}>
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-[13px] font-medium text-white/50">
          <Link href="/" className="-my-2 py-2 transition hover:text-white">Home</Link>
          <span className="size-1 rounded-full bg-white/25" />
          <span className="text-white/80">{eyebrow}</span>
        </nav>
        <div className="grid items-end gap-x-16 gap-y-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 data-reveal="0.1" className="font-display text-[clamp(40px,5.4vw,76px)] leading-[1.02] font-bold tracking-[-.04em] text-balance">
              {title}
            </h1>
          </div>
          {intro && (
            <p data-reveal="0.2" className="border-l border-white/15 pl-6 text-[17px] leading-relaxed text-pretty text-white/72 lg:mb-2">
              {intro}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ── Flash news ticker ─────────────────────────────────────── */

export function Ticker() {
  const row = (hidden?: boolean) => (
    <div aria-hidden={hidden} className="flex gap-18 pr-18 text-sm font-semibold whitespace-nowrap">
      {FLASH.map((f) => (
        <a key={f.text} href={f.url} tabIndex={hidden ? -1 : undefined} className="hover:underline">{f.text}</a>
      ))}
    </div>
  );
  return (
    <div className="flex items-stretch overflow-hidden bg-red">
      <div className="font-display flex flex-none items-center gap-2.5 bg-[#C40000] px-5.5 py-3.5 text-xs font-bold tracking-[.16em] uppercase">
        <span className="size-[7px] rounded-full bg-white" />
        Flash News
      </div>
      <div className="flex flex-1 items-center overflow-hidden">
        <div className="marquee flex w-max" style={{ "--dur": "36s" } as React.CSSProperties}>
          {row()}
          {row(true)}
        </div>
      </div>
    </div>
  );
}

/* ── Affiliations marquee ──────────────────────────────────── */

export function Affiliations() {
  return (
    <section aria-label="Affiliations" className="-mb-10 bg-white pt-8 pb-14">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee flex w-max" style={{ "--dur": "48s" } as React.CSSProperties}>
          {[...AFFILIATIONS, ...AFFILIATIONS].map((a, i) => (
            <a
              key={i}
              href={a.url}
              title={a.name}
              aria-hidden={i >= AFFILIATIONS.length}
              tabIndex={i >= AFFILIATIONS.length ? -1 : undefined}
              className="flex h-20 flex-none items-center px-8 transition duration-300 ease-out-expo hover:-translate-y-1"
            >
              <img src={a.logo} alt={a.name} className="block max-h-14 max-w-40 object-contain" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── About ─────────────────────────────────────────────────── */

const PILLARS = [
  { icon: Award, title: "ISO-certified", text: "Every centre is held to the same audited standard, so you get the same quality wherever you study." },
  { icon: Globe2, title: "Accepted worldwide", text: "Move abroad or switch jobs and your G-TEC certificate still counts, in 23 countries and growing." },
  { icon: Landmark, title: "Government partner", text: "Governments trust us to run their skilling projects. That says a lot about how we teach." },
];

const accordionItem = "group rounded-[20px] border border-ink/15 bg-white transition-colors open:border-blue";
const accordionHead = "font-display flex cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] p-6 text-lg font-bold [&::-webkit-details-marker]:hidden";
const accordionChevron = "size-5 flex-none text-ink-2 transition-transform group-open:rotate-180";
/** Where each floating number sits around the About photo, in `STATS` order. */
const STAT_SPOTS = ["sm:bottom-3 sm:left-0", "sm:top-2 sm:left-[34%]", "sm:right-0 sm:bottom-[14%]", "sm:top-[16%] sm:right-0"];

function InlinePhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="mx-[.12em] inline-block h-[.82em] w-[1.9em] -translate-y-[.06em] rounded-full object-cover align-middle shadow-[0_8px_24px_rgba(0,66,130,.25)]"
    />
  );
}

export function About({ cta = true }: { cta?: boolean }) {
  return (
    <section id="about" className={cn(section, "rounded-t-[40px] bg-white pt-[clamp(32px,3.5vw,48px)] text-ink")}>
      <div className={wrap}>
        {/* Statement headline with inline photos */}
        <div className="mx-auto mb-[clamp(56px,7vw,104px)] max-w-[1080px] text-center">
          <div className="flex justify-center">
            <Eyebrow light>About G-TEC</Eyebrow>
          </div>
          <h2 data-reveal="0.1" className="font-display text-[clamp(36px,5.6vw,80px)] leading-[1.08] font-bold tracking-[-.03em] text-balance">
            Where people
            <InlinePhoto src={unsplash("1523240795612-9a054b0db644")} alt="Students studying together" />
            come to <span className="text-blue">learn,</span>
            <InlinePhoto src={unsplash("1581092160562-40aa08e78837")} alt="Engineer working in a lab" />
            grow and <span className="text-red">get hired.</span>
          </h2>
        </div>

        {/* Accordion · photo with floating numbers */}
        <div className="grid items-center gap-[clamp(40px,6vw,88px)] lg:grid-cols-[minmax(0,.85fr)_minmax(0,1fr)]">
          {/* Sharing a `name` makes the browser keep one item open at a time. */}
          <div data-reveal="0.1" className="grid gap-3">
            <details name="about-g-tec" open className={accordionItem}>
              <summary className={accordionHead}>
                Our story
                <ChevronDown className={accordionChevron} />
              </summary>
              <div className="px-6 pb-6 text-[15px] leading-[1.7] text-pretty text-ink-2">
                <p className="mb-3 font-semibold text-ink">We started with one small centre and one simple idea: teach skills people can actually use.</p>
                <p className="mb-3">
                  Twenty-five years later, that idea has grown into 800+ centres across 23 countries. We teach IT, design, finance
                  and trades, and we work with governments to bring training to people who need it most.
                </p>
                <p>
                  But the numbers aren&apos;t really the point. What matters is the student who walks in unsure and walks out with
                  a job, and the teachers who make that happen every day.
                </p>
                {cta && (
                  <div className="mt-6 flex flex-wrap items-center gap-5">
                    <Link href="/about" className="inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-[15px] font-bold text-white transition duration-300 ease-out-expo hover:-translate-y-0.5 hover:bg-blue">
                      Read our story <Arrow />
                    </Link>
                    <a href="/leadership" className="group inline-flex items-center gap-2 text-[15px] font-semibold text-blue">
                      Meet the leadership <Arrow className="transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                )}
              </div>
            </details>
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <details key={title} name="about-g-tec" className={accordionItem}>
                <summary className={accordionHead}>
                  <span className="flex items-center gap-3">
                    <Icon className="size-5 flex-none text-red" strokeWidth={1.8} />
                    {title}
                  </span>
                  <ChevronDown className={accordionChevron} />
                </summary>
                <p className="px-6 pb-6 text-[15px] leading-[1.7] text-pretty text-ink-2">{text}</p>
              </details>
            ))}
          </div>

          <figure data-reveal="0.2" className="relative sm:px-12 sm:py-16">
            <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
              <div className="absolute inset-[4%_0_0_8%] [mask-image:radial-gradient(closest-side,#000_60%,transparent)] bg-[radial-gradient(rgba(0,66,130,.28)_1px,transparent_1.5px)] bg-[size:10px_10px]" />
              <div className="absolute inset-[2%_3%_2%_6%] rounded-[58%_42%_46%_54%/44%_56%_44%_56%] bg-sky/35" />
              <div className="absolute inset-[-1%_0_0_3%] rotate-6 rounded-[58%_42%_46%_54%/44%_56%_44%_56%] border border-ink/12" />
            </div>
            <img src={`${SITE}/assets/img/home/intro-tmb-lg.webp`} alt="G-TEC students" className="relative aspect-[4/3] w-full rounded-[24px] object-cover shadow-[0_24px_60px_rgba(11,26,51,.2)]" />
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:contents">
              {STATS.slice(0, 4).map((s, i) => (
                <div key={s.label} className={cn("rounded-2xl bg-white px-5 py-4 shadow-[0_14px_36px_rgba(11,26,51,.14)] ring-1 ring-ink/[.05] sm:absolute", STAT_SPOTS[i])}>
                  <dd className="font-display text-[clamp(26px,2.4vw,34px)] leading-none font-extrabold tracking-tight">
                    {s.value}
                    <span className="text-red">{s.suffix}</span>
                  </dd>
                  <dt className="mt-1.5 text-[13px] font-semibold text-ink-2">{s.label}</dt>
                </div>
              ))}
            </dl>
          </figure>
        </div>
      </div>
    </section>
  );
}

/** Height of the wave at `x` (0-1) and loop time `t` (0-1). Two curves travelling in opposite directions roll and swell without ever going flat. */
const waveY = (x: number, t: number) => 135 + 42 * Math.sin(2 * Math.PI * (x * 1.3 + t)) + 20 * Math.sin(2 * Math.PI * (x * 2.2 - 2 * t));

/** One frame of the wave: smooth curves through 9 points, filled up past the top of the viewBox. Every frame has the same commands so the browser can morph between them. */
function wavePath(t: number) {
  const STEPS = 8;
  const slope = (x: number) => (waveY(x + 0.001, t) - waveY(x - 0.001, t)) / 0.002 / STEPS / 3;
  let d = `M0 ${waveY(0, t).toFixed(1)}`;
  for (let i = 0; i < STEPS; i++) {
    const [a, b] = [i / STEPS, (i + 1) / STEPS];
    const [xa, xb] = [a * 1900, b * 1900];
    const third = (xb - xa) / 3;
    d += `C${(xa + third).toFixed(1)} ${(waveY(a, t) + slope(a)).toFixed(1)} ${(xb - third).toFixed(1)} ${(waveY(b, t) - slope(b)).toFixed(1)} ${xb.toFixed(1)} ${waveY(b, t).toFixed(1)}`;
  }
  return `${d}V59H0Z`;
}

const WAVE_FRAMES = Array.from({ length: 9 }, (_, i) => wavePath(i / 8));

/** Slowly rolling edge between two sections. Sits over the top of the lower section, so its glow carries on underneath; `fill` is the upper section's colour. */
export function WaveDivider({ fill = "fill-white", begin = "0s", height = "h-[clamp(52px,8vw,128px)]" }: { fill?: string; begin?: string; height?: string }) {
  return (
    <div aria-hidden className="pointer-events-none relative z-10 h-0">
      <svg data-wave viewBox="0 60 1900 155" preserveAspectRatio="none" className={cn("absolute top-0 block w-full overflow-visible", height)}>
        <path className={fill} d={WAVE_FRAMES[0]}>
          <animate attributeName="d" values={WAVE_FRAMES.join(";")} dur="18s" begin={begin} repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
}

/* ── Courses ───────────────────────────────────────────────── */

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1000&q=75`;
// One shot per programme area, in course order, then campus life.
const COURSE_IMAGES = [
  { src: unsplash("1485827404703-89b55fcc595e"), alt: "Humanoid robot" },
  { src: unsplash("1461749280684-dccba630e2f6"), alt: "Code on a screen" },
  { src: unsplash("1531482615713-2afd69097998"), alt: "Team designing at computers" },
  { src: unsplash("1558494949-ef010cbdcc31"), alt: "Network server rack" },
  { src: unsplash("1554224155-6726b3ff858f"), alt: "Accounting with a calculator" },
  { src: unsplash("1503387762-592deb58ef4e"), alt: "Architectural drawings" },
  { src: unsplash("1522202176988-66273c2fd55f"), alt: "Students working on laptops" },
  { src: unsplash("1518770660439-4636190af475"), alt: "Circuit board" },
  { src: unsplash("1555066931-4365d14bab8c"), alt: "Laptop with code editor" },
  { src: unsplash("1581092160562-40aa08e78837"), alt: "Engineer working in a lab" },
  { src: unsplash("1523240795612-9a054b0db644"), alt: "Students studying together" },
  { src: unsplash("1517694712202-14dd9538aa97"), alt: "Developer at a laptop" },
];

const FOLDER_ART: ArtPreset[] = ["ember", "aurora", "dusk", "verdant", "glacier"];

export function CoursesSection({ heading = true }: { heading?: boolean }) {
  return (
    <section id="courses" className={cn(section, "relative overflow-hidden bg-navy", !heading && "pt-0")}>
      {heading && <div className="pointer-events-none absolute top-[-200px] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,66,130,.45),transparent_65%)] blur-[40px]" />}
      {heading && (
        // Full-bleed so the curved band runs edge to edge; the heading sits above the band's axis.
        <TiltedGridHero
          images={COURSE_IMAGES}
          speed={4.5}
          tileHeight={26}
          axis={72}
          curve={72}
          fade={14}
          className="mb-12 h-[860px] w-full md:h-[clamp(640px,78vh,760px)]"
        >
          <div className={cn(wrap, "relative z-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-end gap-x-16 gap-y-6")}>
            <div>
              <Eyebrow>Courses</Eyebrow>
              <h2 data-reveal="0.1" className={h2}>Learn the skills that get you hired.</h2>
            </div>
            <div data-reveal="0.2">
              <p className="mb-5 text-[17px] leading-[1.7] text-pretty text-white/70">
                Pick a field you&apos;re curious about. You&apos;ll spend most of your time doing, not just listening, and leave
                with a certificate employers recognise.
              </p>
              <Link href="/courses" className="inline-flex items-center gap-2 text-[15px] font-bold hover:text-coral">
                Browse all courses <Arrow />
              </Link>
            </div>
          </div>
        </TiltedGridHero>
      )}
      {/* backdrop for the folders: a dotted desk with soft brand glows, so the glass has something to frost */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[min(100%,2200px)]">
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_30%,transparent_80%)] bg-[radial-gradient(rgba(255,255,255,.13)_1.1px,transparent_1.4px)] [background-size:24px_24px]" />
        <div className={cn(blob, "top-[8%] -left-[8%] size-[42vw] bg-[radial-gradient(circle,rgba(0,102,204,.32),transparent_65%)] blur-[50px] [animation:float-a_16s_ease-in-out_infinite]")} />
        <div className={cn(blob, "top-[38%] -right-[10%] size-[38vw] bg-[radial-gradient(circle,rgba(255,1,0,.18),transparent_65%)] blur-[60px] [animation:float-b_20s_ease-in-out_infinite]")} />
        <div className={cn(blob, "bottom-[4%] left-[25%] size-[34vw] bg-[radial-gradient(circle,rgba(0,102,204,.25),transparent_65%)] blur-[60px] [animation:float-a_22s_ease-in-out_infinite]")} />
      </div>
      <div className={cn(wrap, "relative")}>
        <p className="mb-10 flex items-center justify-center gap-2 text-center text-sm font-semibold text-white/60">
          <span className="size-1.5 animate-pulse rounded-full bg-coral" />
          Hover over a folder to take a peek. Click it to open the course.
        </p>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-16">
          {COURSES.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={c.slug} className="flex w-[340px] max-w-full flex-col">
                <GlassFolder
                  label={c.title}
                  meta={`${c.tags.length} modules inside`}
                  tone="light"
                  art={FOLDER_ART[i % FOLDER_ART.length]}
                  seed={i + 3}
                  action="none"
                  href={`/courses/${c.slug}`}
                  appearDelay={(i % 3) * 140}
                  width={340}
                  className="max-w-full"
                  files={c.tags.map((t, j) => ({
                    name: t,
                    meta: `Module ${j + 1}`,
                    href: `/courses/${c.slug}`,
                    art: j % 2 ? undefined : FOLDER_ART[(i + j + 1) % FOLDER_ART.length],
                  }))}
                />
                <div className="mt-6 flex flex-1 flex-col px-1">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 flex-none items-center justify-center rounded-xl border border-white/12 bg-linear-135 from-[rgba(0,120,255,.4)] to-blue/12 text-sky">
                      <Icon className="size-5" strokeWidth={1.8} />
                    </span>
                    <h3 className="font-display text-[22px] font-bold tracking-tight">{c.title}</h3>
                    <span className="font-display ml-auto text-[13px] font-bold tracking-[.1em] text-coral">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-3 mb-4 text-[15px] leading-relaxed text-white/68">{c.summary}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <span className="text-[13px] font-semibold text-white/55">{c.note}</span>
                    <Link href={`/courses/${c.slug}`} className="inline-flex flex-none items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-navy transition hover:bg-coral hover:text-white">
                      View course <Arrow className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const card = "relative overflow-hidden border text-white transition duration-450 ease-out-expo hover:-translate-y-1";

export function CourseCard({ course, n }: { course: Course; n: number }) {
  const Icon = course.icon;
  return (
    <Link
      href={`/courses/${course.slug}`}
      data-spot
      className={cn(card, "flex min-h-80 flex-col rounded-3xl border-white/10 bg-white/4 p-6.5 hover:border-white/30 hover:bg-white/6")}
    >
      <div className="relative flex items-start justify-between gap-3">
        <span className="flex size-13.5 flex-none items-center justify-center rounded-2xl border border-white/12 bg-linear-135 from-[rgba(0,120,255,.4)] to-blue/12 text-sky">
          <Icon className="size-6" strokeWidth={1.8} />
        </span>
        <span className="font-display text-[13px] font-bold tracking-[.1em] text-coral">{String(n).padStart(2, "0")}</span>
      </div>
      <h3 className="font-display relative mt-6 mb-2 text-[26px] font-bold tracking-tight">{course.title}</h3>
      <p className="relative mb-4.5 text-[15px] leading-relaxed text-white/68">{course.summary}</p>
      <Tags tags={course.tags} />
      <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-white/8 pt-4.5">
        <span className="text-[13px] font-semibold text-white/55">{course.note}</span>
        <span className="inline-flex items-center gap-2 text-sm font-bold">
          View details
          <span className="flex size-8.5 items-center justify-center rounded-full border border-white/14 bg-white/8"><Arrow /></span>
        </span>
      </div>
    </Link>
  );
}

function Tags({ tags, big }: { tags: string[]; big?: boolean }) {
  return (
    <div className={cn("relative flex flex-wrap", big ? "gap-2" : "mb-5.5 gap-1.5")}>
      {tags.map((t) => (
        <span key={t} className={cn("rounded-full border text-xs font-semibold", big ? "border-white/12 bg-white/8 px-3 py-[7px]" : "border-white/10 bg-white/6 px-[11px] py-1.5 text-white/78")}>
          {t}
        </span>
      ))}
    </div>
  );
}

export function Perks() {
  const perks = [
    { icon: FlaskConical, title: "Hands-on labs", text: "Learn by building, in equipped labs at every centre." },
    { icon: Award, title: "Globally accepted certificates", text: "Credentials recognised across 23 countries." },
    { icon: Briefcase, title: "Placement support", text: "Job fairs, live vacancies and employer tie-ups." },
  ];
  return (
    <div data-stagger className="mt-4.5 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
      {perks.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex items-center gap-4 rounded-[20px] border border-white/10 bg-white/4 px-5.5 py-5">
          <span className="flex size-11.5 flex-none items-center justify-center rounded-[14px] bg-red/16 text-[#FF6B5E]">
            <Icon className="size-5.5" strokeWidth={1.9} />
          </span>
          <span>
            <span className="font-display block font-bold tracking-tight">{title}</span>
            <span className="mt-0.5 block text-[13px] leading-normal text-white/60">{text}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Global presence ───────────────────────────────────────── */

export function Global({ cta = true }: { cta?: boolean }) {
  return (
    <section id="global" className={cn(section, "relative overflow-hidden bg-deep")}>
      <div className="pointer-events-none absolute top-1/2 -right-[18%] size-[min(900px,90vw)] -translate-y-1/2 rounded-full bg-[repeating-radial-gradient(circle_at_center,rgba(255,255,255,.07)_0_1px,transparent_1px_64px)]" />
      <div className={cn(wrap, "relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-[clamp(40px,6vw,80px)]")}>
        <GlobeNetwork
          intro={
            <>
              <Eyebrow>Our presence around the world</Eyebrow>
              <h2 data-reveal="0.1" className={cn(h2, "mb-5")}>Proud to deliver excellence worldwide.</h2>
              <p className="mb-8 max-w-[480px] text-[17px] leading-[1.7] text-pretty text-white/70">
                World-class training that gives learners modern skills and opportunities to build careers anywhere in the world. Hover a
                country to find it on the globe.
              </p>
            </>
          }
          footer={
            <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
              <div>
                <div className="font-display text-[clamp(44px,5vw,64px)] leading-[.9] font-extrabold tracking-[-.04em]">23</div>
                <div className="mt-2 text-sm font-semibold text-white/60">Countries</div>
              </div>
              <div>
                <div className="font-display text-[clamp(44px,5vw,64px)] leading-[.9] font-extrabold tracking-[-.04em]">800<span className="text-coral">+</span></div>
                <div className="mt-2 text-sm font-semibold text-white/60">Centres across the globe</div>
              </div>
              {cta && (
                <Link href="/centres" className="inline-flex items-center gap-2.5 rounded-full border border-white/22 bg-white/6 px-6.5 py-4 text-[15px] font-semibold backdrop-blur-md transition hover:border-white/45 hover:bg-white/14">
                  Locate a centre <Arrow />
                </Link>
              )}
            </div>
          }
        />
      </div>
    </section>
  );
}

/* ── Testimonials ──────────────────────────────────────────── */

export function Testimonials({ heading = true, grid }: { heading?: boolean; grid?: boolean }) {
  if (!grid)
    return (
      // overflow-clip, not hidden: hidden would make this a scroll container and unpin the sticky stage.
      <section id="testimonials" className="overflow-clip rounded-t-[40px] bg-mist text-ink">
        <Stories>
          {heading && (
            <>
              <Eyebrow light>Testimonials</Eyebrow>
              <h2 className={h2}>Here&apos;s what our students have to say.</h2>
              <p className="mt-4 text-[15px] text-ink-2">Tap a card to watch their story.</p>
              <Link href="/students" className="mt-5 inline-flex items-center gap-2 text-[15px] font-bold text-blue hover:text-red">
                View all stories <Arrow />
              </Link>
            </>
          )}
        </Stories>
      </section>
    );
  return (
    <section id="testimonials" className="overflow-hidden rounded-t-[40px] bg-mist py-[clamp(80px,9vw,136px)] text-ink">
      {heading && (
        <div className={cn(wrap, "mb-11 grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-end gap-x-16 gap-y-6")}>
          <div>
            <Eyebrow light>Testimonials</Eyebrow>
            <h2 data-reveal="0.1" className={h2}>Here&apos;s what our students have to say.</h2>
          </div>
          <div data-reveal="0.2">
            <Link href="/students" className="inline-flex items-center gap-2 text-[15px] font-bold text-blue hover:text-red">
              View all stories <Arrow />
            </Link>
          </div>
        </div>
      )}
      <Stories grid />
    </section>
  );
}

/* ── News ──────────────────────────────────────────────────── */

export function News({ heading = true }: { heading?: boolean }) {
  return (
    <section id="news" className={cn(section, "bg-white text-ink")}>
      <div className={wrap}>
        {heading && (
          <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow light>News &amp; events</Eyebrow>
              <h2 data-reveal="0.1" className={cn(h2, "max-w-[14ch]")}>Latest happenings at G-TEC.</h2>
            </div>
            <Link data-reveal="0.2" href="/news" className="inline-flex items-center gap-2 text-[15px] font-bold text-blue hover:text-red">
              All news &amp; events <Arrow />
            </Link>
          </div>
        )}
        <div data-stagger className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-5">
          {NEWS.map((n) => (
            <a key={n.url} href={n.url} className="grid grid-cols-[minmax(120px,38%)_1fr] overflow-hidden rounded-3xl border border-ink/6 bg-mist transition duration-450 ease-out-expo hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(11,26,51,.12)]">
              <img src={`${SITE}/assets/img/news-events/news-tmb.webp`} alt="" loading="lazy" className="block size-full min-h-50 object-cover" />
              <div className="flex flex-col px-7 py-6.5">
                <span className="self-start rounded-full border border-ink/8 bg-white px-3 py-1.5 text-xs font-bold text-blue">{n.date}</span>
                <h3 className="font-display mt-4 mb-2.5 text-xl leading-[1.3] font-bold tracking-tight">{n.title}</h3>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-red">Read more <Arrow className="size-3.5" /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Subsidiaries ──────────────────────────────────────────── */

export function Subsidiaries() {
  return (
    <section className="bg-white py-16 text-ink">
      <div className={cn(wrap, "flex flex-wrap items-center gap-8")}>
        <div data-reveal="0" className="flex-none">
          <div className="mb-2 text-xs font-bold tracking-[.18em] text-ink-2 uppercase">Group of institutions</div>
          <div className="font-display text-[22px] font-bold tracking-tight">Our subsidiaries</div>
        </div>
        <div data-stagger className="flex flex-1 flex-wrap justify-end gap-3">
          {SUBSIDIARIES.map((s) => (
            <a key={s.name} href={s.url} className="flex h-18 w-37.5 items-center justify-center p-3 transition duration-300 ease-out-expo hover:-translate-y-1">
              <img src={s.logo} alt={s.name} loading="lazy" className="max-h-full max-w-full object-contain" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Enquiry (rendered by the root layout on every page) ───── */

export function Enquire() {
  const channels = [
    { icon: Phone, label: "Call us", value: CONTACT.phone.label, href: CONTACT.phone.href, tint: "bg-[rgba(0,102,204,.25)] text-sky" },
    { icon: MessageCircle, label: "WhatsApp", value: CONTACT.whatsapp.label, href: CONTACT.whatsapp.href, tint: "bg-[rgba(37,211,102,.2)] text-[#7EE2A3]" },
    { icon: Mail, label: "Email", value: CONTACT.email.label, href: CONTACT.email.href, tint: "bg-red/20 text-[#FF8A80]" },
  ];
  return (
    // Rendered inside EnquireDialog, so no reveal animations: they'd wait on an observer that never sees a closed dialog.
    <section className="relative overflow-hidden p-[clamp(24px,4vw,56px)]">
      <div className={cn(blob, "top-0 left-[10%] size-[40vw] bg-[radial-gradient(circle,rgba(0,102,204,.35),transparent_65%)] blur-[50px] [animation:float-a_16s_ease-in-out_infinite]")} />
      <div className={cn(blob, "right-[5%] bottom-0 size-[32vw] bg-[radial-gradient(circle,rgba(255,1,0,.22),transparent_65%)] blur-[50px] [animation:float-b_20s_ease-in-out_infinite]")} />
      <div className="relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-[clamp(28px,4vw,56px)]">
        <div>
          <div className="mb-5 flex items-center gap-3 text-xs font-bold tracking-[.18em] text-coral uppercase">
            <span className="h-0.5 w-7 bg-red" />
            Admissions open
          </div>
          <h2 className="font-display mb-5 text-[clamp(32px,4vw,52px)] leading-[1.02] font-extrabold tracking-[-.03em] text-balance">
            Start your journey with G-TEC.
          </h2>
          <p data-reveal="0.2" className="mb-9 max-w-[480px] text-[17px] leading-[1.7] text-pretty text-white/70">
            Tell us what you want to learn and our counsellors will call you back with course options, fees and the nearest centre.
          </p>
          <div className="grid max-w-[420px] gap-3.5">
            {channels.map(({ icon: Icon, label, value, href, tint }) => (
              <a key={label} href={href} className="flex items-center gap-4 rounded-[18px] border border-white/10 bg-white/5 px-4.5 py-4 transition hover:border-white/30 hover:bg-white/8">
                <span className={cn("flex size-10.5 flex-none items-center justify-center rounded-xl", tint)}>
                  <Icon className="size-4.5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold text-white/55">{label}</span>
                  <span className="block font-bold">{value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-white/12 bg-white/5 p-[clamp(24px,3vw,36px)] shadow-[0_40px_100px_rgba(0,0,0,.35)] backdrop-blur-2xl">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
