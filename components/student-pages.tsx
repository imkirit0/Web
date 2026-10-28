import Link from "next/link";
import { ArrowRight, ExternalLink, Lock, Mail, Phone } from "lucide-react";
import { wrap } from "@/components/courses";
import { CONTACT } from "@/lib/data";
import { cn } from "@/lib/utils";

export { wrap };
// Old payment/results system. Set NEXT_PUBLIC_PORTAL_URL (e.g. https://portal.gteceducation.com) once it moves to its subdomain.
export const LIVE = process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://www.gteceducation.com";
export const h2 = "font-display text-[clamp(28px,3.4vw,42px)] font-bold leading-[1.08] tracking-[-.025em] text-balance";
export const card = "rounded-[28px] bg-white ring-1 ring-ink/6";

/** Labelled form control. `wide` spans both columns of a `FieldGrid`. */
export function Field({ label, required, wide, children }: { label: string; required?: boolean; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={cn("grid gap-2 text-sm font-semibold text-ink", wide && "sm:col-span-2")}>
      <span>
        {label}
        {required && <span className="text-red"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

/** Stands in for the live form's file upload, which this site doesn't take. */
export function EmailNote({ what }: { what: string }) {
  return (
    <p className="flex items-start gap-2.5 rounded-[14px] bg-ice px-4 py-3 text-sm leading-relaxed text-ink-2">
      <Mail className="mt-0.5 size-4 flex-none text-blue" />
      <span>
        Want to include your {what}? Email it to{" "}
        <a href={CONTACT.email.href} className="font-semibold text-blue underline underline-offset-2">{CONTACT.email.label}</a> after you submit.
      </span>
    </p>
  );
}

/** Light section with copy on the left and a form (or anything) on the right. */
export function Split({ eyebrow, title, intro, aside, children }: { eyebrow?: string; title: string; intro?: React.ReactNode; aside?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-mist py-[clamp(64px,8vw,112px)] text-ink">
      <div className={cn(wrap, "grid items-start gap-[clamp(32px,5vw,64px)] lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]")}>
        <div className="grid gap-6">
          {eyebrow && <p className="flex items-center gap-3 text-xs font-bold tracking-[.18em] text-red uppercase"><span className="h-0.5 w-7 bg-red" />{eyebrow}</p>}
          <h2 className={h2}>{title}</h2>
          {intro && <div className="grid gap-4 text-[16px] leading-[1.75] text-pretty text-ink-2">{intro}</div>}
          {aside}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}

/** Quick contact chips used beside forms. */
export function ContactChips() {
  const items = [
    { icon: Phone, label: CONTACT.phone.label, href: CONTACT.phone.href },
    { icon: Mail, label: CONTACT.email.label, href: CONTACT.email.href },
  ];
  return (
    <div className="flex flex-wrap gap-3">
      {items.map(({ icon: Icon, label, href }) => (
        <a key={label} href={href} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink ring-1 ring-ink/8 transition hover:ring-blue/40">
          <Icon className="size-4 text-blue" /> {label}
        </a>
      ))}
    </div>
  );
}

const PAY = [
  { label: "Online Payment", href: "/onlinepayment" },
  { label: "Payment for Centres", href: "/paymentforcentres" },
  { label: "International Payment", href: "/onlineinternationalpayment" },
];

export function PaymentTabs({ current }: { current: string }) {
  return (
    <nav aria-label="Payment type" className="mt-10 flex flex-wrap gap-2">
      {PAY.map((p) => (
        <Link
          key={p.href}
          href={p.href}
          aria-current={p.href === current ? "page" : undefined}
          className={cn(
            "rounded-full px-5 py-2.5 text-sm font-semibold transition",
            p.href === current ? "bg-white text-navy" : "border border-white/20 bg-white/5 text-white/80 hover:bg-white/12",
          )}
        >
          {p.label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Steps + a hand-off card that sends the visitor to the live system (payments, results).
 * `details` is a list of { label, items } groups describing what the live form asks for.
 */
export function HandOff({
  title,
  steps,
  details,
  href,
  cta,
  note,
  image,
}: {
  title: string;
  steps: string[];
  details?: { label: string; items: string[] }[];
  href: string;
  cta: string;
  note: string;
  image?: string;
}) {
  return (
    <section className="bg-mist py-[clamp(64px,8vw,112px)] text-ink">
      <div className={cn(wrap, "grid items-start gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,.8fr)]")}>
        <div className="grid gap-6">
          <div className={cn(card, "p-[clamp(24px,4vw,44px)]")}>
            <h2 className={cn(h2, "mb-8")}>{title}</h2>
            <ol className="grid gap-5">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="font-display flex size-9 flex-none items-center justify-center rounded-full bg-ice text-sm font-bold text-blue">{i + 1}</span>
                  <span className="pt-1.5 leading-relaxed text-ink-2">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          {details?.map((d) => (
            <div key={d.label} className={cn(card, "p-[clamp(24px,4vw,44px)]")}>
              <h3 className="font-display mb-4 text-lg font-bold">{d.label}</h3>
              <ul className="flex flex-wrap gap-2">
                {d.items.map((x) => (
                  <li key={x} className="rounded-full bg-mist px-3.5 py-1.5 text-sm font-medium text-ink-2 ring-1 ring-ink/6">{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <aside className="grid gap-4 lg:sticky lg:top-28">
          {image && <img src={image} alt="" className="aspect-[4/3] w-full rounded-[28px] object-cover" />}
          <div className="rounded-[28px] bg-navy p-7 text-white">
            <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-white/8 text-sky"><Lock className="size-5" /></span>
            <p className="font-display text-xl font-bold tracking-tight">{cta}</p>
            <p className="mt-2 mb-6 text-sm leading-relaxed text-white/65">{note}</p>
            {/* ponytail: hands off to the live gateway/results system until it is migrated */}
            <a href={href} className="flex items-center justify-center gap-2 rounded-full bg-red px-6 py-3.5 text-[15px] font-bold transition hover:bg-red-dark">
              {cta} <ExternalLink className="size-4" />
            </a>
            <a href={CONTACT.email.href} className="mt-3 flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-[15px] font-semibold transition hover:bg-white/8">
              Need help? Email us <ArrowRight className="size-4" />
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
