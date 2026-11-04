import { Loader } from "@/components/Loader";
import { About, Affiliations, CoursesSection, Global, Hero, News, Subsidiaries, Testimonials, Ticker, WaveDivider } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Loader />
      <Hero />
      <Ticker />
      <Affiliations />
      <About />
      <WaveDivider />
      <CoursesSection />
      <WaveDivider fill="fill-navy" begin="-6s" />
      <Global />
      <Testimonials />
      <News />
      <Subsidiaries />
    </>
  );
}
