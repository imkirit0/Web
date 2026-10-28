import type { Metadata } from "next";
import { BookOpen, ClipboardList, FlaskConical, Monitor, NotebookPen, Wrench } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Band, LogoGrid, card, pageImages } from "@/components/about-pages";

export const metadata: Metadata = { title: "Training & Certifications", description: "Quality training and internationally recognised certifications at G-TEC Education." };

const SUPPORT = [
  [BookOpen, "Trainer guides"],
  [FlaskConical, "Lab manuals"],
  [NotebookPen, "Student workbooks"],
  [ClipboardList, "Course materials"],
  [Monitor, "Computer-based training"],
  [Wrench, "Equipment kits"],
] as const;

const CERTS = ["Microsoft Office Specialist", "Information Technology Specialist", "Adobe Certified Professional", "Autodesk", "Meta", "CISCO", "IC3 Digital Literacy", "ESB (Entrepreneurship and Small Business)", "Tally", "QuickBooks", "Taxation Academy", "G-TEC Nergy Vidya", "CSCU v13", "Building a Culture of Security"];

export default function TrainingPage() {
  const logos = pageImages("/trainingandcertifications").map((src) => ({ src, name: "Certification partner" }));
  return (
    <>
      <PageHero
        eyebrow="Training & certifications"
        title="Delivering excellence through quality training."
        intro="High-quality training that helps our students get noticed in the job market, backed by a system built to ensure quality at every step."
      />

      <Band eyebrow="Centre support" title="Everything our centres and trainers need." intro={<p>We give full support to our centres and trainers with helpful tools at every stage of a course.</p>}>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {SUPPORT.map(([Icon, t]) => (
            <li key={t} className={`${card} flex items-center gap-4 p-5`}>
              <span className="flex size-11 flex-none items-center justify-center rounded-full bg-ice text-blue"><Icon className="size-5" /></span>
              <span className="font-display text-[15px] font-bold">{t}</span>
            </li>
          ))}
        </ul>
      </Band>

      <Band
        dark
        eyebrow="Certifications"
        title="Global recognition, real-world skills."
        intro={<p>G-TEC students get international certificates from famous organizations like ABMA, IAB, SAP, ZOHO Books and EC-Council. These certificates help them find better jobs. Our programs also cover:</p>}
      >
        <ul className="flex flex-wrap gap-2.5">
          {CERTS.map((c) => (
            <li key={c} className="rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm font-semibold">{c}</li>
          ))}
        </ul>
        <p className="mt-8 max-w-[640px] text-[17px] leading-relaxed text-white/70">These certifications make our students job-ready with real-world skills and global recognition. With G-TEC, you don&apos;t just learn, you build a strong future.</p>
      </Band>

      {logos.length > 0 && (
        <Band eyebrow="Our certification partners">
          <LogoGrid logos={logos} />
        </Band>
      )}
    </>
  );
}
