import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections";
import { MistSection, PhotoGrid } from "@/components/media-pages";
import { PHOTOS } from "@/lib/pages-data";

export const metadata: Metadata = { title: "Photo gallery", description: "Photos from G-TEC Education events and celebrations." };

export default function PhotoGalleryPage() {
  return (
    <>
      <PageHero eyebrow="Gallery" title="Photo gallery" intro="Capturing memories, one smile at a time. Explore our photo gallery.">
        <Link data-reveal="0.3" href="/videogallery" className="mt-9 inline-flex rounded-full border border-white/22 bg-white/6 px-7 py-4 text-[15px] font-semibold transition hover:border-white/45 hover:bg-white/14">Video gallery</Link>
      </PageHero>
      <MistSection><PhotoGrid photos={PHOTOS} alt="G-TEC gallery" /></MistSection>
    </>
  );
}
