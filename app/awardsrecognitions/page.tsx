import type { Metadata } from "next";
import { Award } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Band, pageImages } from "@/components/about-pages";

export const metadata: Metadata = { title: "Awards & Recognition", description: "Awards and recognition earned by G-TEC Education and its Chairman & Managing Director." };

// Captions in the same order as the photos on the live page.
const HIGHLIGHTS = [
  "Best IAB Centre in the World 2014 - 2020 by IAB (UK)",
  "Prestigious Brand 2019 - 2020, Economic Times India - UAE",
  "IT Excellence Award 2018-2019, Future Kerala Education Conclave 2018",
  "“Brand Icon 2016” by Times of India and Economic Times",
  "Guinness World Record 2018-2019",
  "IAB Fellowship Award 2018-19 UK",
  "Top 10 Big Kerala Award 2011 at Dubai, Dec 2011",
  "Future Kerala Award in 2018, presented by Kerala Governor Justice P. Sadashivan",
];

const ACHIEVEMENTS = [
  "G-TEC was awarded the Best IAB International Centre many times and the Award of Excellence in IT for the International Contribution to IT Education. Mr. Mehroof I. Manalody, the Chairman & Managing Director of G-TEC EDUCATION, was honoured at the awards ceremonies held in the House of Commons in the UK Parliament in London.",
  "The Chairman and Managing Director of G-TEC was selected as one of the 10 prominent figures of Kerala and received the Big Kerala Award 2011 at Dubai on 8th Dec 2011, from the field of Education.",
  "Gandhi Award of 2006-07 for Excellence in the field of IT Education, and IT Award 2008 by Rajiv Youth Foundation.",
  "Freedom fighter E. Moidumoulavi Memorial award for the best educational institution on 6th March 2011, awarded by AKSHARAM.",
  "Franchise India awards 2010: G-TEC won the Franchise India magazine award 2010 for the business and is listed among a hundred entrepreneurs of India.",
  "Pravasi Bharathi Udyog Pathru Award 2012 on 11-01-2012, at the 10th Annual Celebrations in Kerala.",
  "Rotary Smart City Award 2011-12 by Rotary Club of Calicut Smart City.",
  "Honoured by ROSHI, managed by Humanity Charitable Trust, Calicut.",
  "Travancore Award for Excellent Achievement in IT by Mr. K.M. Mani, Minister for Finance, Kerala state, on 22-08-12.",
  "Keralavyapari Ekopana Samithi Award 2012.",
  "IT Entrepreneur of the Year 2013, presented by Health Minister Mr. Sivakumar.",
  "Selected as “Brand Icon 2016” among the Top 10 Entrepreneurs by Times of India and Economic Times.",
  "Best International Centre 2016 by IAB (UK).",
];

export default function AwardsPage() {
  const photos = pageImages("/awardsrecognitions");
  return (
    <>
      <PageHero eyebrow="Awards & recognition" title="Celebrating milestones of excellence." />

      <Band>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,270px),1fr))] gap-4">
          {HIGHLIGHTS.map((h, i) => (
            <figure key={h} className="group overflow-hidden rounded-[28px] bg-white ring-1 ring-ink/6">
              <div className="aspect-[4/3] overflow-hidden bg-ice">
                {photos[i] && <img src={photos[i]} alt={h} loading={i < 4 ? undefined : "lazy"} className="size-full object-cover transition duration-700 ease-out-expo group-hover:scale-105" />}
              </div>
              <figcaption className="font-display p-5 text-[15px] leading-snug font-bold">{h}</figcaption>
            </figure>
          ))}
        </div>
      </Band>

      <Band dark eyebrow="Awards and achievements" title="A long record of recognition.">
        <ol className="grid gap-3 md:grid-cols-2">
          {ACHIEVEMENTS.map((a) => (
            <li key={a} className="flex gap-4 rounded-[22px] border border-white/10 bg-white/[.04] p-5">
              <Award className="mt-0.5 size-5 flex-none text-coral" />
              <p className="text-[15px] leading-relaxed text-white/75">{a}</p>
            </li>
          ))}
        </ol>
      </Band>
    </>
  );
}
