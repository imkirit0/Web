import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections";
import { MistSection, VideoGrid } from "@/components/media-pages";
import { SOCIAL } from "@/lib/data";
import { getVideos } from "@/lib/pages-data";

export const metadata: Metadata = { title: "Video gallery", description: "Videos from G-TEC Education events, celebrations and performances." };

const youtube = SOCIAL.find((s) => s.label === "YouTube")!.url;

export default function VideoGalleryPage() {
  return (
    <>
      <PageHero eyebrow="Gallery" title="Video gallery" intro="Explore our vibrant life through moments captured in our video gallery.">
        <div data-reveal="0.3" className="mt-9 flex flex-wrap gap-3">
          <a href={youtube} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-red px-7 py-4 text-[15px] font-bold shadow-[0_12px_32px_rgba(255,1,0,.38)] transition hover:-translate-y-0.5 hover:bg-red-dark">Our YouTube channel</a>
          <Link href="/photogallery" className="inline-flex rounded-full border border-white/22 bg-white/6 px-7 py-4 text-[15px] font-semibold transition hover:border-white/45 hover:bg-white/14">Photo gallery</Link>
        </div>
      </PageHero>
      <MistSection><VideoGrid videos={getVideos()} /></MistSection>
    </>
  );
}
