import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { HandOff, LIVE } from "@/components/student-pages";

export const metadata: Metadata = { title: "Results Online", description: "Check your G-TEC evaluation results online with your 7 digit roll number." };

export default function ResultsOnlinePage() {
  return (
    <>
      <PageHero eyebrow="Results online" title="Your success is just a click away." intro="Now you can check your G-TEC evaluation results online." />
      <HandOff
        title="How to check your result"
        steps={[
          "Keep your 7 digit roll number ready.",
          "Open the results page and enter your roll number.",
          "Submit to see your result: register number, exam date, name, course, semester, centre name and grade.",
        ]}
        href={`${LIVE}/resultsonline`}
        cta="Check your result"
        note="Results are served from the secure G-TEC results portal."
      />
    </>
  );
}
