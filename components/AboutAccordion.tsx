"use client";

import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EASE } from "@/components/motion-kit";
import { cn } from "@/lib/utils";

/**
 * One panel open at a time. Every panel stays in the DOM, so all the text is there for search
 * engines, and a <noscript> rule in the root layout opens them all when JavaScript is off.
 */
export function AboutAccordion({ items }: { items: { head: React.ReactNode; body: React.ReactNode }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-3">
        {items.map((item, i) => {
          const on = i === open;
          return (
            <div key={i} className={cn("rounded-[20px] border bg-white transition-colors duration-300", on ? "border-blue shadow-card" : "border-ink/15 hover:border-ink/35")}>
              <h3>
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`about-panel-${i}`}
                  onClick={() => setOpen(on ? -1 : i)}
                  className="font-display flex w-full items-center justify-between gap-4 rounded-[20px] p-6 text-left text-lg font-bold"
                >
                  {item.head}
                  <motion.span initial={false} animate={{ rotate: on ? 180 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="flex-none">
                    <ChevronDown className="size-5 text-ink-2" />
                  </motion.span>
                </button>
              </h3>
              <motion.div
                id={`about-panel-${i}`}
                data-accordion-panel
                inert={!on}
                initial={false}
                animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                transition={{ duration: 0.42, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 text-[15px] leading-[1.7] text-pretty text-ink-2">{item.body}</div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </MotionConfig>
  );
}
