# G-TEC landing page: design notes

Extends the existing identity (white, navy, G-TEC blue and red, Bricolage Grotesque and Manrope, torn-paper collage, rolling waves). Read this before adding to the home page.

## Brief

Prospective students and their parents, usually comparing institutes on a phone, need to choose a field and believe it leads to work. Primary action: Enquire. Biggest objection: "will this actually get me a job?"

## Concept

```
Idea:        One line, from walking in to getting hired.
Metaphor:    A hand-torn paper collage with a brush line drawn across it.
Signature:   JourneyLine: scrolling draws the sky-blue line through four stops, ending on Enquire.
Emotion:     "Someone has already walked this, and I can see where it goes."
Motion verb: Laid down like paper, drawn like a brush.
Screenshot:  The line arriving at the wall of 197 placed students.
Anchor:      The brush stroke in the hero, the "walks in unsure, walks out with a job" line, and the weekly placement posters. None of it transfers to another institute.
```

Rejected: a globe-led story (the globe is impressive but says nothing about getting a job), and an unfolding-certificate scroll (literal, and it hides the people).

## Page argument

| Section | Question it answers | Proof beside it |
| --- | --- | --- |
| Hero | What is this, is it for me? | 800+ centres, 23 countries, 3.2M students |
| About | Who are they? | Their story, ISO certification, government work |
| Course explorer | What can I learn? | Real modules for each programme |
| Journey line | Does it lead to a job? | Placement poster, job fairs, certificates |
| Globe | Does it count elsewhere? | All 23 countries |
| Stories | Do people like me say so? | Named student videos |
| News, subsidiaries | Is this alive and substantial? | Dated job fairs, group institutions |
| Closing | What now? | Three ways to reach a person |

## Rules

- **One signature.** The journey line is the loudest thing on the page. Do not add a second moment that competes with it.
- **Colour:** white paper, navy `#050c1f` stage, blue `#004282` for actions, red `#ff0100` only for small marks (it fails AA as small text on white and with white text), sky `#8ec5ff` only for the brush.
- **Type:** Bricolage for display, tracking -0.025em to -0.035em. Manrope for body. Sentence case. No eyebrow labels on the home page.
- **Numbers:** only where the content is a real sequence (the four stops; position in the course explorer). Only numbers the site can back up.
- **Motion:** paper settles with `--ease-out-expo` and a small rotation. At rest, only the waves and the hero move (collage drift, floating chips, field cycle, occasional caps). All of it stops off-screen and under reduced motion, and the hero has a pause button.
- **Hero:** responds before it performs. The field picker, cap toss and fact chips all answer the visitor; the automatic versions just show that they are there.
- **Pinning:** three scroll-driven scenes at most (explorer, journey line, stories gathering around their heading). Scroll is never captured, only read.
- **Torn paper is reserved** for the hero collage and the journey line. Everything else gets clean edges, so the tear keeps its meaning.
- **Phones get their own composition,** not a shrunk one: course carousel, vertical journey line, no cursor effects.
- **Reduced motion and no JavaScript are designed states.** Anything Framer starts hidden carries `data-mo`, which globals.css forces visible.

## Where things live

- `components/motion-kit.tsx`: shared primitives (`Magnetic`, `Parallax`, `HeroDepth`, `ScrollWords`, `RiseWords`, `ScrollProgress`).
- `components/hero/HeroInteractive.tsx`: the hero's field picker, photo swap, cap toss and fact chips.
- `components/JourneyLine.tsx`, `CourseExplorer.tsx`, `NewsRows.tsx`, `AboutAccordion.tsx`: the interactive sections.
- The header is CSS only, and `Enquire.tsx` and `page-hero.tsx` sit apart from `sections.tsx`, so plain inner pages don't need Framer Motion on load. (Next may still prefetch it at idle through the link to home.)
- `[data-reveal]` and `[data-count]` in `components/Motion.tsx` still handle simple reveals and counters site-wide.
