import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { MistSection, NewsGrid } from "@/components/media-pages";
import { NEWS_ITEMS } from "@/lib/pages-data";

export const metadata: Metadata = { title: "News & events", description: "Latest happenings and events at G-TEC Education." };

export default function NewsAndEventsPage() {
  return (
    <>
      <PageHero eyebrow="News and events" title="Latest happenings at G-TEC" intro="Job fairs, events and announcements from G-TEC centres." />
      <MistSection><NewsGrid items={NEWS_ITEMS} /></MistSection>
    </>
  );
}
