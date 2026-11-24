import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { AlumniConnect } from "@/components/sections";

export const metadata: Metadata = { title: "Alumni Connect", description: "Join the G-TEC alumni network: careers, job fairs, placements and hiring." };

export default function AlumniPage() {
  return (
    <>
      <PageHero eyebrow="Alumni" title="G-TEC Alumni Connect." intro="Stay part of the G-TEC family long after you graduate." />
      <AlumniConnect />
    </>
  );
}
