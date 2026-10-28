import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Band, pageImages } from "@/components/about-pages";

export const metadata: Metadata = { title: "Leadership", description: "Mr. Mehroof I Manalody, Founder, Chairman and Managing Director of G-TEC Education." };

export default function LeadershipPage() {
  const [portrait, cmd] = pageImages("/leadership");
  return (
    <>
      <PageHero eyebrow="Leadership" title="Strong leadership that built a global education network." />

      <Band>
        <div className="grid items-start gap-12 lg:grid-cols-[400px_1fr]">
          <figure className="overflow-hidden rounded-[28px] bg-white ring-1 ring-ink/6 lg:sticky lg:top-28">
            {portrait && <img src={portrait} alt="Mr. Mehroof I Manalody" className="aspect-[4/5] w-full object-cover object-top" />}
            <figcaption className="p-6">
              <p className="font-display text-xl font-bold tracking-tight">Mr. Mehroof I Manalody</p>
              <p className="mt-1 text-sm font-semibold text-red">Founder, Chairman &amp; Managing Director</p>
            </figcaption>
          </figure>
          <div className="grid gap-5 text-[17px] leading-relaxed text-ink-2">
            <p><strong className="text-ink">Mr. Mehroof I Manalody</strong>, the founder and Chairman and Managing Director of G-TEC EDUCATION, is a Graduate in Economics from Madras University and holds a Postgraduate Diploma in Computers. He has a very affirmative attitude and a forward-thinking mindset, and he possesses an exceptional ability to manage and grow educational and training institutions.</p>
            <p>He began his journey in the world of education by setting up computer institutes across the Malabar region. With passion and persistence, he expanded operations to other districts in Kerala, then to different states across India, and eventually took G-TEC to the global stage.</p>
            <div className="my-3 grid gap-3 sm:grid-cols-3">
              {[["2001", "G-TEC founded"], ["800+", "learning centres worldwide"], ["1,50,000", "students trained every year"]].map(([n, l]) => (
                <div key={l} className="rounded-[22px] bg-white p-5 ring-1 ring-ink/6">
                  <p className="font-display text-3xl font-extrabold tracking-tight text-blue">{n}</p>
                  <p className="mt-1 text-sm font-semibold">{l}</p>
                </div>
              ))}
            </div>
            <p>In 2001, his dream of delivering quality education to everyone came to life as G-TEC. Since then, millions of students have gained employability skills through 800+ quality learning centres across the globe. G-TEC trains around 1,50,000 students every year, and this number continues to grow because of our quality service and expanding reach.</p>
            <p>G-TEC EDUCATION has taken the initiative to integrate IT and soft skill programs with university courses, aiming to bring the &ldquo;finishing school&rdquo; concept to life by developing innovative programs that prepare youth for successful careers.</p>
            <p>Under the leadership of Mr. Mehroof Manalody, G-TEC has proudly earned numerous IT excellence awards from both State and Central Governments, along with repeated international recognition from IAB (UK) through the UK Parliament for being the Best Centre.</p>
            <p>His initiatives and innovations attracted national publicity through many national projects of Governments and gained him numerous awards like Brand Icon 2016, among the Top 10 entrepreneurs by Times of India and Economic Times.</p>
          </div>
        </div>
      </Band>

      <Band dark eyebrow="CMD's message">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <Quote className="size-10 text-red" />
            <blockquote className="font-display mt-5 text-[clamp(24px,3vw,36px)] leading-[1.25] font-bold tracking-[-.02em] text-balance">
              Education is the only path for self-fulfillment and self-realization. It is the only path to freedom and equality. We envision a world with peace and prosperity through educated minds with passion for enhancement of self and society.
            </blockquote>
            <div className="mt-10 grid gap-5 text-[16px] leading-relaxed text-white/70">
              <p>Our vision to deliver quality education across the globe gave birth to G-TEC in 2001. Since then, our mission has been clear: providing Quality Education for All, regardless of social, economic, or cultural background.</p>
              <p>From the beginning, we focused on helping people grow by offering training that connects education with real jobs. We provided access to International Certifications from top companies, all at an affordable cost.</p>
              <p>With G-TEC Professional Studies, we now offer approved university courses along with a wide variety of IT and skill-based programs. Many of these include International Certifications that strengthen our students&apos; career paths.</p>
              <p>We aim for &ldquo;Making Professionals Globally&rdquo;, reflecting our focus on providing relevant, up-to-date training that aligns with industry needs. We also work closely with government bodies, universities, and international institutions to offer certified programs for those who need it most.</p>
              <p>We believe in giving quality education and staying updated with industry trends, and our courses are prepared through proper research so that our students get the best education. We also make sure our training is flexible and gives space for students to grow, while also fulfilling our responsibilities to society.</p>
            </div>
          </div>
          <figure className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[.04]">
            {cmd && <img src={cmd} alt="Mr. Mehroof, Chairman & Managing Director" loading="lazy" className="aspect-[4/5] w-full object-cover object-top" />}
            <figcaption className="p-6">
              <p className="font-display text-lg font-bold">Mr. Mehroof</p>
              <p className="mt-1 text-sm text-white/60">Chairman &amp; Managing Director</p>
            </figcaption>
          </figure>
        </div>
      </Band>
    </>
  );
}
