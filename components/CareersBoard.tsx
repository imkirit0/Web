"use client";

import { useRef, useState } from "react";
import { BriefcaseBusiness, Clock, ListFilter, MapPin, Plus, Star, X } from "lucide-react";
import { SiteForm } from "@/components/SiteForm";
import { JOBS, type Job } from "@/lib/data";
import { cn } from "@/lib/utils";

const FILTERS: { key: "workspace" | "type" | "nature"; label: string; options: string[] }[] = [
  { key: "workspace", label: "Job Workspace", options: ["Work From Office", "Hybrid", "Remote"] },
  { key: "type", label: "Job Type", options: ["Permanent", "Contract", "Gig"] },
  { key: "nature", label: "Job Nature", options: ["Full Time", "Part Time", "Intern"] },
];
const SKILLS = [...new Set(JOBS.flatMap((j) => j.skills))].sort();

const inputClass = "h-11 w-full rounded-lg border border-ink/15 bg-white px-3.5 text-sm text-ink outline-none placeholder:text-ink-2/60 focus:border-blue focus:ring-2 focus:ring-blue/15";
const primaryBtn = "inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue text-sm font-semibold text-white transition-colors hover:bg-blue-dark";

function Meta({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="size-3.5 flex-none text-blue" />
      <span className="text-ink-2/80">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </span>
  );
}

/** Filterable openings list. `children` are the application form's fields, rendered inside the apply dialog. */
export function CareersBoard({ children }: { children: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [skill, setSkill] = useState("");
  const [details, setDetails] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [applying, setApplying] = useState({ title: "", position: "", attempt: 0 });

  const query = skill.trim().toLowerCase();
  const jobs = JOBS.filter(
    (job) =>
      FILTERS.every((f) => {
        const chosen = f.options.filter((o) => picked.includes(o));
        return !chosen.length || chosen.includes(job[f.key]);
      }) &&
      (!query || job.skills.some((s) => s.toLowerCase().includes(query))),
  );
  const filtering = picked.length > 0 || !!query;
  const reset = () => {
    setPicked([]);
    setSkill("");
  };

  const apply = (job?: Job) => {
    // A new `attempt` remounts the form, so a previous "thank you" doesn't carry over to the next job.
    setApplying((a) => ({
      title: job ? `Apply: ${job.title}` : "Get discovered for future jobs",
      position: job ? `${job.title} (ID ${job.id})` : "Future jobs",
      attempt: a.attempt + 1,
    }));
    dialog.current?.showModal();
  };

  return (
    <section className="min-h-svh bg-mist pt-18 text-ink">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8 lg:px-8">
        <aside className="self-start lg:sticky lg:top-26 lg:max-h-[calc(100svh-7.5rem)] lg:overflow-y-auto lg:border-r lg:border-ink/10 lg:pr-6">
          <button type="button" onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen} className="flex items-center gap-2 font-semibold lg:hidden">
            <ListFilter className="size-4 text-blue" /> Job Filters
          </button>
          <p className="hidden items-center gap-2 font-semibold lg:flex">
            <ListFilter className="size-4 text-blue" /> Job Filters
          </p>

          <div className={cn("mt-4 lg:block", !filtersOpen && "hidden")}>
            {FILTERS.map((f) => (
              <fieldset key={f.key} className="border-b border-ink/10 py-4 first:pt-0">
                <legend className="mb-2 text-sm font-semibold">{f.label}</legend>
                <div className="grid gap-1">
                  {f.options.map((o) => (
                    <label key={o} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-ink-2">
                      <input
                        type="checkbox"
                        checked={picked.includes(o)}
                        onChange={(e) => setPicked((p) => (e.target.checked ? [...p, o] : p.filter((x) => x !== o)))}
                        className="size-4 accent-blue"
                      />
                      <span className="flex-1">{o}</span>
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink/6 px-1.5 text-xs font-medium text-ink">
                        {JOBS.filter((j) => j[f.key] === o).length}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <label className="block border-b border-ink/10 py-4 text-sm font-semibold">
              Skills
              <input
                list="job-skills"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="Start typing to choose skills"
                className={cn(inputClass, "mt-2 font-normal")}
              />
              <datalist id="job-skills">{SKILLS.map((s) => <option key={s} value={s} />)}</datalist>
            </label>

            <button type="button" onClick={reset} className={cn(primaryBtn, "mt-4 h-11 w-full")}>Reset Filter</button>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h1 aria-live="polite" className="font-display text-2xl font-semibold tracking-[-.01em]">
              {jobs.length} {jobs.length === 1 ? "Opening" : "Openings"} Found
            </h1>
            <button type="button" onClick={() => apply()} className={cn(primaryBtn, "h-10 px-4")}>
              <Plus className="size-4" /> Get Discovered for Future Jobs
            </button>
          </div>

          {jobs.length === 0 && (
            <div className="rounded-xl border border-ink/10 bg-white p-10 text-center">
              <p className="font-semibold">{filtering ? "No openings match your filters." : "No openings right now."}</p>
              <p className="mt-1 text-sm text-ink-2">
                {filtering ? "Try removing a filter to see more roles." : "Share your details and we'll reach out when a role fits you."}
              </p>
            </div>
          )}

          <ul className="grid gap-3">
            {jobs.map((job) => (
              <li key={job.id} className="rounded-xl border border-ink/10 bg-white p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="font-semibold">{job.title}</h2>
                    <p className="mt-1 text-[13px] text-ink-2/80">ID {job.id}</p>
                    <p className="text-[13px] text-ink-2/80">Posted {job.posted}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px]">
                      <Meta icon={MapPin} label="Job Location" value={`${job.location} (${job.workspace})`} />
                      <Meta icon={BriefcaseBusiness} label="Job Type" value={job.type} />
                      <Meta icon={Clock} label="Job Nature" value={job.nature} />
                      <Meta icon={Star} label="Experience" value={job.experience} />
                    </div>
                  </div>
                  <div className="flex flex-none gap-2">
                    <button type="button" onClick={() => apply(job)} aria-label={`Apply for ${job.title}`} className={cn(primaryBtn, "h-10 px-6")}>Apply</button>
                    <button
                      type="button"
                      onClick={() => setDetails((d) => (d === job.id ? null : job.id))}
                      aria-expanded={details === job.id}
                      aria-label={`${details === job.id ? "Hide" : "View"} details for ${job.title}`}
                      className="h-10 rounded-lg border border-ink/10 px-4 text-sm font-semibold transition-colors hover:bg-mist"
                    >
                      {details === job.id ? "Hide Details" : "View Details"}
                    </button>
                  </div>
                </div>
                {details === job.id && (
                  <div className="mt-4 border-t border-ink/10 pt-4 text-sm leading-relaxed text-ink-2">
                    <p>{job.description}</p>
                    <p className="mt-2"><span className="font-semibold text-ink">Skills:</span> {job.skills.join(", ")}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <dialog
        ref={dialog}
        aria-label={applying.title || "Apply"}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="m-auto max-h-[92svh] w-[min(640px,calc(100%-24px))] max-w-none overflow-y-auto overscroll-contain rounded-[28px] bg-transparent backdrop:bg-ink/70 backdrop:backdrop-blur-sm"
      >
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full text-ink transition hover:bg-ink/6">
          <X className="size-5" />
        </button>
        <SiteForm key={applying.attempt} form="careers" submit="Submit application" success="Thank you for your interest, we will get in touch with you soon.">
          <h2 className="font-display pr-10 text-xl font-bold text-ink">{applying.title}</h2>
          <input type="hidden" name="position" value={applying.position} />
          {children}
        </SiteForm>
      </dialog>
    </section>
  );
}
