import type { Metadata } from "next";
import { CoursesSection, PageHero } from "@/components/sections";

export const metadata: Metadata = { title: "Courses" };

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Courses"
        title="Find the course that fits you."
        intro="Whether you love code, design, numbers or working with people, there is a course here that turns it into a career."
      />
      <CoursesSection heading={false} />
    </>
  );
}
