import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Band, card, pageImages } from "@/components/about-pages";

export const metadata: Metadata = { title: "Profile", description: "G-TEC Education: an ISO-certified global institution with 800+ training centres across 23+ countries." };

const DIVISIONS = [
  ["G-TEC Computer Education", "A leading institute in India that trains students in software, accounting, hardware, multimedia, CAD, mobile technology, and language skills. With advanced facilities and experienced trainers, our centres are committed to preparing students for real-world careers."],
  ["G-TEC College of Advanced Studies", "Degree programs plus practical training and industry-recognized certificates. We partner with reputed institutions such as Calicut University, MG University, Madras University, and international universities from the UK and the US."],
  ["G-TEC Global Campus", "Opportunities and assistance to study abroad in 50 plus countries, with associations with 900+ universities and 1,00,000 course options to choose from. From choosing the perfect program to helping you adjust abroad, G-TEC offers complete support for your overseas education."],
  ["G-TEC GOBS Bank", "The CSR initiative of G-TEC. GOBS Bank connects job seekers with a global network of 1000+ employers and 750+ placement officers. Through job fairs, one-to-one support, and online platforms, it has placed thousands of students globally in partnership with NGOs, government bodies, and corporations."],
  ["G-TEC Online Learning", "Affordable, quality education through live, recorded, and hybrid classes. Courses include IT, Life Skills, Languages, Management, and more. It helps reach young learners across India who want to grow but need flexible and low-cost options."],
  ["G-TEC Gensmart Academy", "Designed for schools and corporate clients. It provides skill enhancement programs for professionals and engaging, activity-based learning for school students to boost their academic and practical skills."],
  ["G-TEC Centre of Excellence", "Industry-driven courses with expert trainers, modern infrastructure, internships, and global certifications. With strong employer ties, GCE ensures students are job-ready from day one."],
];

const STRENGTHS = [
  ["Run by experienced and dedicated professionals", "G-TEC is managed by skilled people who are serious about giving quality education."],
  ["A technical team for teacher support", "We have a team of experts who train our teachers and help them stay updated."],
  ["R&D team watches industry changes", "Our R&D team keeps an eye on the latest industry trends and updates our courses to match."],
  ["Quality Monitoring Cell (QMC) at every centre", "A special team checks the quality of training at all G-TEC centres to make sure everything meets our standards."],
  ["Online and centralised exams", "All exams are conducted online and are the same across all centres, making them fair and easy to manage."],
  ["Syllabus updated regularly", "We change and improve our syllabus often to match what companies and industries need."],
  ["Partnerships with MNCs", "G-TEC works with big international companies to bring in the latest technology and knowledge."],
  ["Everything runs on GEMS", "GEMS (G-TEC Electronic Management System) helps us manage everything smoothly, from admissions to quality control."],
  ["Automated, verifiable certificates", "Certificates are issued automatically after course completion and can be verified online for authenticity."],
];

export default function ProfilePage() {
  const [photo1, photo2, photo3] = pageImages("/profile");
  return (
    <>
      <PageHero
        eyebrow="Profile"
        title="Welcome to G-TEC."
        intro="An ISO-certified global institution and a trusted leader in IT education, skill development and vocational training, with 25 years of excellence in upskilling."
      />

      <Band>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div className="grid gap-5 text-[17px] leading-relaxed text-ink-2">
            <h2 className="font-display text-[clamp(30px,4vw,50px)] leading-[1.08] font-bold tracking-[-.025em] text-balance text-ink">G-TEC Education</h2>
            <p>With 25 years of excellence in upskilling, G-TEC has built a strong network of over 800+ training institutions across more than 23 countries. G-TEC actively supports government-approved projects and is known around the world for its trusted name, quality training, and excellent education standards.</p>
            <p>We proudly serve as an authorized training and certification partner for leading global organizations, including SAP (Germany), Tally, ZOHO, ABMA (UK), EC Council, IAB (UK), BCS (UK), Interlinguae (Italy), as well as leading government bodies like NIELIT, Keltron, and international tech leaders such as Microsoft and Adobe.</p>
            <p>G-TEC focuses on providing high-quality training, offering useful courses, and issuing international certificates, all while helping students build strong careers.</p>
          </div>
          {photo1 && <img src={photo1} alt="G-TEC Education" className="aspect-[4/3] w-full rounded-[28px] object-cover" />}
        </div>
      </Band>

      <Band dark eyebrow="Our divisions" title="Different branches for different learning needs.">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-4">
          {DIVISIONS.map(([name, text]) => (
            <article key={name} className="rounded-[28px] border border-white/10 bg-white/[.04] p-7">
              <h3 className="font-display text-xl font-bold tracking-tight">{name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/65">{text}</p>
            </article>
          ))}
        </div>
      </Band>

      <Band>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          {photo2 && <img src={photo2} alt="G-TEC students and centre" loading="lazy" className="aspect-[4/3] w-full rounded-[28px] object-cover" />}
          <div className="grid gap-5 text-[17px] leading-relaxed text-ink-2">
            <h2 className="font-display text-[clamp(30px,4vw,50px)] leading-[1.08] font-bold tracking-[-.025em] text-balance text-ink">Our mission is to become the No.1 Education Provider Worldwide.</h2>
            <p>G-TEC keeps up with global industry and future technology trends while also adjusting its training to fit the needs of each country and region, always giving the best quality and care.</p>
            <p>All these factors help us work towards &ldquo;100% meaningful skilling and employability training&rdquo;, which is our ultimate goal.</p>
          </div>
        </div>
      </Band>

      <Band dark eyebrow="Our strength" title="A team that's truly committed." intro={<p>From visionary directors to dedicated staff and trainers, every member of Team G-TEC plays a key role in shaping futures and driving our mission of Global Prosperity through Education.</p>}>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_380px]">
          <ul className="grid gap-3 sm:grid-cols-2">
            {STRENGTHS.map(([t, d]) => (
              <li key={t} className={`${card} flex gap-4 p-6 text-ink`}>
                <span className="mt-0.5 flex size-8 flex-none items-center justify-center rounded-full bg-ice text-blue"><Check className="size-4" strokeWidth={2.6} /></span>
                <span>
                  <strong className="font-display block text-[16px] font-bold">{t}</strong>
                  <span className="mt-1 block text-[14px] leading-relaxed text-ink-2">{d}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="grid gap-5">
            {photo3 && <img src={photo3} alt="Team G-TEC" loading="lazy" className="w-full rounded-[28px] object-cover" />}
            <p className="text-[15px] leading-relaxed text-white/65">
              G-TEC trains students with the advanced skills needed to work anywhere in the world, using a practical teaching method that prepares them for real jobs. Our huge network is managed through our domestic ERP system, GEMS, an absolute solution for the maintenance and monitoring of centre operations and the Quality Management System.
            </p>
          </div>
        </div>
      </Band>
    </>
  );
}
