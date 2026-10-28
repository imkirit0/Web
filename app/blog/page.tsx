import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { MistSection, PostGrid } from "@/components/media-pages";
import { POSTS } from "@/lib/pages-data";

export const metadata: Metadata = { title: "Blog", description: "Articles from G-TEC Education on skills, certifications and careers." };

export default function BlogPage() {
  return (
    <>
      <PageHero eyebrow="Blog" title="G-TEC Education blog" intro="Thoughts on skills, certifications and careers from the G-TEC team." />
      <MistSection><PostGrid posts={POSTS} /></MistSection>
    </>
  );
}
