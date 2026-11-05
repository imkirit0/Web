import Link from "next/link";
import { ArrowRight, Award, Briefcase, FlaskConical, Globe2, Landmark, Mail, MessageCircle, Phone } from "lucide-react";
import { AboutAccordion } from "@/components/AboutAccordion";
import { CourseExplorer } from "@/components/CourseExplorer";
import { NewsRows } from "@/components/NewsRows";
import { CapLayer, CoursePicker, FactChip, HeroBrush, HeroProvider, LoosePhoto, PhotoDeck } from "@/components/hero/HeroInteractive";
import { BrushStroke, DepthLayer, HeroDepth, Magnetic, Parallax, RiseWords, ScrollWords } from "@/components/motion-kit";
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
import { cn, tornEdge } from "@/lib/utils";

const SITE = "https://www.gteceducation.com";
const wrap = "mx-auto w-[min(1240px,100%)] px-6";
const h2 = "font-display text-[clamp(32px,4.2vw,54px)] font-bold leading-[1.06] tracking-[-.025em] text-balance";
const section = "py-[clamp(80px,9vw,136px)]";
const blob = "animate-float pointer-events-none absolute rounded-full";

function Arrow({ className }: { className?: string }) {
  return <ArrowRight className={cn("size-4", className)} strokeWidth={2.4} />;
}

/* ── Hero (home) ───────────────────────────────────────────── */

const HERO_TOP_TEAR: [number, number][] = [[1, 3], [99, 1], [100, 98], [80, 98], [66, 84], [42, 78], [18, 72], [3, 42]];
const HERO_LOW_TEAR: [number, number][] = [[4, 5], [97, 1], [100, 91], [7, 99], [1, 58]];

export function Hero() {
  return (
    <section data-hero data-pause-offscreen className="relative overflow-hidden bg-blue pt-18 text-white">
      {/* White wave rolling along the foot of the blue hero. `fill` is the colour above the wave's edge. */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 isolate h-[clamp(96px,14vh,140px)] bg-white">
        <WaveDivider fill="fill-blue" begin="-11s" height="h-[clamp(36px,4.5vw,70px)]" />
      </div>

      <div className={cn(wrap, "relative grid gap-8 lg:min-h-[max(620px,calc(100svh-4.5rem))] lg:grid-cols-[minmax(0,1.06fr)_minmax(0,1.1fr)]")}>
        <HeroProvider images={COURSE_IMAGES}>
        <div data-hero-copy className="flex flex-col justify-center pt-[clamp(36px,6vh,64px)] lg:pb-[calc(clamp(96px,14vh,140px)+32px)]">
          <h1 className="font-display mb-5 text-[clamp(42px,min(5.2vw,8.8svh),76px)] leading-[1.02] font-bold tracking-[-.035em]">
            {["Making", "Professionals", "Globally."].map((w, i) => (
              <span key={w} className="-mt-[.12em] -mb-[.1em] block overflow-hidden pt-[.12em] pb-[.1em]">
                <span className="hero-word" style={{ "--i": i } as React.CSSProperties}>
                  <span className="sr-only">{w}</span>
                  {/* Letters lift under the cursor; screen readers get the whole word above. */}
                  <span aria-hidden>
                    {w.replace(".", "").split("").map((l, j) => <span key={j} className="hero-letter">{l}</span>)}
                    {w.endsWith(".") && <span className="hero-dot text-red">.</span>}
                  </span>
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-fade mb-6 max-w-[520px] text-[clamp(16px,1.3vw,18px)] leading-relaxed text-pretty text-white/90" style={{ "--d": ".55s" } as React.CSSProperties}>
            For 25 years we&apos;ve helped students learn IT, pick up real skills and land jobs they&apos;re proud of. Today
            that&apos;s 800+ centres in 23 countries, and employers know our name.
          </p>
          <div className="hero-fade flex flex-wrap items-center gap-3" style={{ "--d": ".7s" } as React.CSSProperties}>
            <Magnetic>
              <a href="#enquire" className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-bold text-blue transition-colors hover:bg-sky active:scale-[.97]">
                Enquire now <Arrow className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic strength={0.18}>
              <Link href="/courses" className="inline-flex items-center rounded-full border border-white/55 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-white hover:bg-white hover:text-blue active:scale-[.97]">
                Explore Courses
              </Link>
            </Magnetic>
          </div>
          <CoursePicker className="hero-fade mt-7" style={{ "--d": ".8s" } as React.CSSProperties} />
          <dl className="hero-fade mt-5 flex w-fit max-w-full flex-wrap gap-x-9 gap-y-3 rounded-2xl border border-white/30 px-6 py-4" style={{ "--d": ".95s" } as React.CSSProperties}>
            {STATS.slice(1, 4).map((s) => (
              <div key={s.label} className="transition-transform duration-300 ease-out-expo hover:-translate-y-1">
                <dd className="font-display text-[clamp(26px,2.4vw,34px)] leading-none font-bold tracking-tight tabular-nums"><span data-count={s.value}>{s.value}</span>{s.suffix}</dd>
                <dt className="mt-1.5 text-[13px] font-semibold text-white/90">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Paper collage: each layer enters on its own beat (CSS), then drifts with the cursor and scroll at its own depth. */}
        <HeroDepth className="relative h-[clamp(440px,100vw,600px)] lg:h-auto">
          <DepthLayer depth={38} scroll={-70} tilt={5}>
            <div className="hero-tear absolute top-[3%] -right-[6%] h-[60%] w-full" style={{ "--d": ".2s", "--r": "4deg" } as React.CSSProperties}>
              <PhotoDeck src={unsplash("1522202176988-66273c2fd55f")} alt="Students laughing together around their laptops" clip={tornEdge(HERO_TOP_TEAR, 23)} backing={tornEdge(HERO_TOP_TEAR, 30, 0.8)} focus="62% 40%" />
            </div>
          </DepthLayer>
          <DepthLayer depth={-56} scroll={-130} tilt={-7}>
            <LoosePhoto src="/hero/graduates.jpg" alt="Graduates in gowns cheering as their caps fly into the air" clip={tornEdge(HERO_LOW_TEAR, 41)} backing={tornEdge(HERO_LOW_TEAR, 48, 0.8)} focus="50% 80%" className="bottom-[5%] left-0 h-[44%] w-[58%]" delay=".42s" tilt="-5deg" />
          </DepthLayer>
          <DepthLayer depth={-90} scroll={-190} tilt={4}>
            <HeroBrush />
          </DepthLayer>
          <DepthLayer depth={70} scroll={-100} tilt={3}>
            <FactChip label="ISO-certified" fact="Every centre is held to the same audited standard, so you get the same quality wherever you study." icon={<Award className="size-4 flex-none text-blue" />} className="top-[20%] right-[2%] sm:top-[9%]" delay=".95s" />
            <FactChip label="Government partner" fact="Governments trust us to run their skilling projects. That says a lot about how we teach." icon={<Landmark className="size-4 flex-none text-blue" />} className="top-[7%] left-0 sm:left-[10%]" delay="1.1s" />
          </DepthLayer>
          <CapLayer />
        </HeroDepth>
        </HeroProvider>
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
    <div data-pause-offscreen className="flex items-stretch overflow-hidden bg-red-dark">
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
    <section data-pause-offscreen aria-label="Affiliations" className="-mb-10 bg-white pt-8 pb-14">
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

/** Where each floating number sits around the About photo, in `STATS` order. */
const STAT_SPOTS = ["sm:bottom-3 sm:left-0", "sm:top-2 sm:left-[34%]", "sm:right-0 sm:bottom-[14%]", "sm:top-[16%] sm:right-0"];
/** Each number drifts at its own speed, so they read as floating in front of the photo. */
const STAT_DRIFT: [number, number][] = [[70, -70], [40, -50], [90, -60], [50, -90]];
const words = (text: string) => text.split(" ").map((t) => ({ text: t }));

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
    <section id="about" className={cn(section, "overflow-x-clip rounded-t-[40px] bg-white pt-[clamp(32px,3.5vw,48px)] text-ink")}>
      <div className={wrap}>
        {/* Statement headline with inline photos */}
        <div className="mx-auto mb-[clamp(56px,7vw,104px)] max-w-[1080px] text-center">
          <ScrollWords
            className="font-display text-[clamp(36px,5.6vw,80px)] leading-[1.08] font-bold tracking-[-.03em] text-balance"
            parts={[
              ...words("Where people"),
              { node: <InlinePhoto src={unsplash("1523240795612-9a054b0db644")} alt="Students studying together" /> },
              ...words("come to"),
              { text: "learn,", className: "text-blue" },
              { node: <InlinePhoto src={unsplash("1581092160562-40aa08e78837")} alt="Engineer working in a lab" /> },
              ...words("grow and"),
              { text: "get", className: "text-red" },
              { text: "hired.", className: "text-red" },
            ]}
          />
        </div>

        {/* Accordion · photo with floating numbers */}
        <div className="grid items-center gap-[clamp(40px,6vw,88px)] lg:grid-cols-[minmax(0,.85fr)_minmax(0,1fr)]">
          <div data-reveal="0.1">
            <AboutAccordion
              items={[
                {
                  head: "Our story",
                  body: (
                    <>
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
                          <Link href="/about" className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-[15px] font-bold text-white transition duration-300 ease-out-expo hover:bg-blue active:scale-[.97]">
                            Read our story <Arrow className="transition-transform group-hover:translate-x-1" />
                          </Link>
                          <a href="/leadership" className="group inline-flex items-center gap-2 text-[15px] font-semibold text-blue">
                            Meet the leadership <Arrow className="transition-transform group-hover:translate-x-1" />
                          </a>
                        </div>
                      )}
                    </>
                  ),
                },
                ...PILLARS.map(({ icon: Icon, title, text }) => ({
                  head: (
                    <span className="flex items-center gap-3">
                      <Icon className="size-5 flex-none text-red" strokeWidth={1.8} />
                      {title}
                    </span>
                  ),
                  body: <p>{text}</p>,
                })),
              ]}
            />
          </div>

          <figure data-reveal="0.2" className="relative sm:px-12 sm:py-16">
            <Parallax y={[24, -24]} className="relative">
              <img src={`${SITE}/assets/img/home/intro-tmb-lg.webp`} alt="G-TEC students" loading="lazy" className="aspect-[4/3] w-full object-cover" style={{ clipPath: tornEdge([[1, 2], [99, 0.6], [99.4, 98], [0.6, 99.4]], 67, 0.5) }} />
            </Parallax>
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:contents">
              {STATS.slice(0, 4).map((s, i) => (
                <Parallax key={s.label} y={STAT_DRIFT[i]} className={cn("rounded-2xl bg-white px-5 py-4 shadow-[0_14px_36px_rgba(11,26,51,.14)] ring-1 ring-ink/[.05] sm:absolute", STAT_SPOTS[i])}>
                  <dd className="font-display text-[clamp(26px,2.4vw,34px)] leading-none font-extrabold tracking-tight tabular-nums">
                    <span data-count={s.value}>{s.value}</span>
                    <span className="text-red">{s.suffix}</span>
                  </dd>
                  <dt className="mt-1.5 text-[13px] font-semibold text-ink-2">{s.label}</dt>
                </Parallax>
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
  { src: unsplash("1523240795612-9a054b0db644"), alt: "Students studying together" },
  { src: unsplash("1518770660439-4636190af475"), alt: "Circuit board" },
  { src: unsplash("1555066931-4365d14bab8c"), alt: "Laptop with code editor" },
  { src: unsplash("1581092160562-40aa08e78837"), alt: "Engineer working in a lab" },
  { src: unsplash("1517694712202-14dd9538aa97"), alt: "Developer at a laptop" },
];

const FOLDER_ART: ArtPreset[] = ["ember", "aurora", "dusk", "verdant", "glacier"];

export function CoursesSection({ heading = true }: { heading?: boolean }) {
  return (
    // overflow-clip, not hidden: hidden would make this a scroll container and unpin the explorer's sticky stage.
    <section id="courses" className={cn(section, "relative overflow-clip bg-navy", heading ? "lg:pb-0" : "pt-0")}>
      {heading && <div className="pointer-events-none absolute top-[-200px] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(0,66,130,.45),transparent_65%)] blur-[40px]" />}
      {heading && (
        // Full-bleed so the curved band runs edge to edge; the heading sits above the band's axis.
        <div data-pause-offscreen>
        <TiltedGridHero
          images={[...COURSE_IMAGES].reverse()}
          speed={4.5}
          tileHeight={26}
          axis={72}
          curve={72}
          fade={14}
          className="mb-12 h-[800px] w-full md:h-[clamp(540px,66vh,640px)] lg:mb-0"
        >
          <div className={cn(wrap, "relative z-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-end gap-x-16 gap-y-6")}>
            <div>
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
        </div>
      )}
      {heading && <CourseExplorer images={COURSE_IMAGES} />}
      {!heading && <>
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
      </>}
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
              <h2 data-reveal="0.1" className={cn(h2, "mb-5")}>One certificate, recognised in 23 countries.</h2>
              <p className="mb-8 max-w-[480px] text-[17px] leading-[1.7] text-pretty text-white/70">
                World-class training that gives learners modern skills and opportunities to build careers anywhere in the world.
                <span className="[@media(hover:none)]:hidden"> Hover a country to find it on the globe.</span>
              </p>
            </>
          }
          footer={
            <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
              <div>
                <div className="font-display text-[clamp(44px,5vw,64px)] leading-[.9] font-extrabold tracking-[-.04em] tabular-nums"><span data-count="23">23</span></div>
                <div className="mt-2 text-sm font-semibold text-white/60">Countries</div>
              </div>
              <div>
                <div className="font-display text-[clamp(44px,5vw,64px)] leading-[.9] font-extrabold tracking-[-.04em] tabular-nums"><span data-count="800">800</span><span className="text-coral">+</span></div>
                <div className="mt-2 text-sm font-semibold text-white/60">Centres across the globe</div>
              </div>
              {cta && (
                <Magnetic>
                  <Link href="/centres" className="group inline-flex items-center gap-2.5 rounded-full border border-white/22 bg-white/6 px-6.5 py-4 text-[15px] font-semibold transition-colors hover:border-white/45 hover:bg-white/14 active:scale-[.97]">
                    Locate a centre <Arrow className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </Magnetic>
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
    <section id="news" className={cn(section, "relative z-10 bg-white text-ink", heading && "-mt-10 rounded-t-[40px]")}>
      <div className={wrap}>
        {heading && (
          <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 data-reveal="0.1" className={cn(h2, "max-w-[14ch]")}>Latest happenings at G-TEC.</h2>
            </div>
            <Link data-reveal="0.2" href="/news" className="inline-flex items-center gap-2 text-[15px] font-bold text-blue hover:text-red">
              All news &amp; events <Arrow />
            </Link>
          </div>
        )}
        <NewsRows items={NEWS} />
      </div>
    </section>
  );
}

/* ── Subsidiaries ──────────────────────────────────────────── */

export function Subsidiaries() {
  return (
    <section className="bg-white pb-[clamp(72px,8vw,120px)] text-ink">
      <div className={wrap}>
        <div data-reveal="0" className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <div className="font-display text-[22px] font-bold tracking-tight">Our subsidiaries</div>
          <div className="text-sm font-semibold text-ink-2">Group of institutions</div>
        </div>
        <div data-reveal="0.1" className="flex flex-wrap gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10">
          {SUBSIDIARIES.map((s) => (
            <a key={s.name} href={s.url} aria-label={s.name} className="group flex h-28 grow basis-[45%] items-center justify-center bg-white p-6 transition-colors duration-300 hover:bg-mist sm:basis-[30%] lg:h-32 lg:basis-[18%]">
              <img src={s.logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out-expo group-hover:scale-110" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Closing call to action (home) ─────────────────────────── */

export function ClosingCta() {
  const channels = [
    { icon: Phone, label: "Call us", value: CONTACT.phone.label, href: CONTACT.phone.href },
    { icon: MessageCircle, label: "WhatsApp", value: CONTACT.whatsapp.label, href: CONTACT.whatsapp.href },
    { icon: Mail, label: "Email", value: CONTACT.email.label, href: CONTACT.email.href },
  ];
  return (
    <>
      <WaveDivider fill="fill-white" begin="-3s" />
      <section className="relative overflow-hidden bg-blue pt-[clamp(120px,14vw,200px)] pb-[clamp(72px,8vw,120px)] text-white">
        <BrushStroke d="M20 215 300 25 95 345 345 215 372 400" viewBox="0 0 400 420" className="pointer-events-none absolute top-[8%] right-[4%] h-[38%] w-auto overflow-visible opacity-30 max-lg:hidden" />
        <div className={cn(wrap, "relative grid items-end gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,.8fr)]")}>
          <div>
            <RiseWords text="Start your journey with G-TEC." className="font-display mb-6 text-[clamp(40px,6.4vw,92px)] leading-[1.02] font-bold tracking-[-.035em]" />
            <p data-reveal="0.2" className="mb-9 max-w-[520px] text-[17px] leading-[1.7] text-pretty text-white/85">
              Admissions are open. Tell us what you want to learn and our counsellors will call you back with course options, fees and the nearest centre.
            </p>
            <div data-reveal="0.3" className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href="#enquire" className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4.5 text-base font-bold text-blue transition-colors hover:bg-sky active:scale-[.97]">
                  Enquire now <Arrow className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                </a>
              </Magnetic>
              <Link href="/courses" className="rounded-full border border-white/40 px-7 py-4.5 text-base font-semibold transition-colors hover:border-white hover:bg-white/10 active:scale-[.97]">
                Explore Courses
              </Link>
            </div>
          </div>
          <div data-stagger className="relative grid border-t border-white/25">
            {channels.map(({ icon: Icon, label, value, href }) => (
              <a key={label} href={href} className="group flex items-center gap-4 border-b border-white/25 py-4.5 transition-[padding] duration-300 ease-out-expo hover:pl-2">
                <Icon className="size-5 flex-none text-sky" />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-white/75">{label}</span>
                  <span className="block font-bold break-words">{value}</span>
                </span>
                <Arrow className="ml-auto flex-none opacity-60 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

