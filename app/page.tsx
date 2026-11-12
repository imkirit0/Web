import { Loader } from "@/components/Loader";
import { JourneyLine } from "@/components/JourneyLine";
import { ScrollProgress } from "@/components/motion-kit";
import { About, Affiliations, ClosingCta, CoursesSection, Curtain, Global, Hero, News, Subsidiaries, Testimonials, WaveDivider } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Loader />
      <ScrollProgress />
      <Hero />
      <Curtain>
        <News />
        <Affiliations />
        <About />
        <WaveDivider />
        <CoursesSection />
        <WaveDivider fill="fill-navy" begin="-6s" />
        <JourneyLine />
        <WaveDivider fill="fill-white" begin="-9s" />
        <Global />
        <Testimonials />
        <Subsidiaries />
        <ClosingCta />
      </Curtain>
    </>
  );
}
