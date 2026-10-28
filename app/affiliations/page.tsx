import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { Band, LogoGrid } from "@/components/about-pages";
import { AFFILIATIONS } from "@/lib/data";

export const metadata: Metadata = { title: "Affiliations", description: "G-TEC Education is proudly partnered with industry leaders and certification bodies worldwide." };

const logo = (name: string) => AFFILIATIONS.find((a) => a.name === name);

// Copy from the live page; logos come from the shared AFFILIATIONS list.
const PARTNERS: [string, string, string?][] = [
  ["Tally", "G-TEC holds the prestigious Golden Partner status with Tally, helping students with advanced expertise in business accounting and financial management."],
  ["SAP", "G-TEC Education is an official partner of SAP, a world leader in ERP software, to help students learn valuable skills that are needed across the globe."],
  ["Zoho", "We are proud to partner with Zoho, a leading global provider of cloud-based business applications."],
  ["EC-Council", "As an official training partner of EC-Council, we offer internationally valued certifications."],
  ["IAB", "By partnering with IAB, a UK-based awarding body recognized by Ofqual, we offer internationally respected certifications in bookkeeping and finance."],
  ["ABMA", "We offer ABMA certifications from the UK, ensuring international standards in business and management education."],
  ["Cisco", "Our partnership with Cisco provides students with the opportunity to achieve globally recognized IT and networking certifications."],
  ["IT Specialist", "We provide certifications from the Information Technology Specialist program, building strong technical foundations for future professionals."],
  ["IAAP UK", "We provide IAAP certifications that help our students strengthen their administrative and professional skills."],
  ["Adobe", "We partner with Adobe to offer certifications in design, creativity, and digital media tools."],
  ["Meta", "Our partnership with Meta helps learners gain globally recognized digital marketing certifications."],
  ["Autodesk", "We provide Autodesk certifications that help learners master advanced design and engineering software."],
  ["Certiport", "Certiport enables access to a wide range of internationally recognized certifications across multiple domains."],
  ["QuickBooks", "QuickBooks certification programs train students in accounting and financial management software."],
  ["Microsoft", "We are affiliated with MOS, enabling learners to validate their expertise in Microsoft Office applications.", "MOS"],
  ["IC3", "IC3 certifications from G-TEC set a global benchmark for digital literacy and computer skills."],
  ["Certiport ESB", "ESB certifications help students learn the skills needed to start and run small businesses successfully.", "ESB"],
];

export default function AffiliationsPage() {
  const withLogo = PARTNERS.flatMap(([key, text, label]) => {
    const a = logo(key);
    return a ? [{ src: a.img, name: label ?? a.name, text, url: a.url }] : [];
  });
  return (
    <>
      <PageHero
        eyebrow="Affiliations"
        title="Proudly partnered with industry leaders."
        intro="G-TEC has strategic alliances and affiliations/accreditations with international and national organizations, including central and state Governments."
      />

      <Band>
        <div className="mb-12 grid max-w-[860px] gap-5 text-[17px] leading-relaxed text-ink-2">
          <p>Since its beginning, G-TEC has been helping students build careers in IT and related fields through quality training and development. Our centres are well-equipped, and many of our students have achieved successful placements. These affiliations help students gain international and renewed qualifications recognized by industry worldwide.</p>
          <p>G-TEC connects education with real industry needs. Instead of just theory, we focus on practical skills that make students job-ready. We aim to give quality education, build confidence, and create professionals who can succeed in careers across the world.</p>
        </div>
        <LogoGrid wide logos={withLogo} />
      </Band>
    </>
  );
}
