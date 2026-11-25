import { CreditCard, Landmark, ReceiptText, ShieldCheck, Smartphone, UserRound, Wallet } from "lucide-react";
import { ContactChips, LIVE, h2 } from "@/components/student-pages";

const wrap = "mx-auto w-[min(1240px,100%)] px-6";

const STEPS = [
  { icon: UserRound, title: "Fill in your details", text: "Who's paying, what for, and how much." },
  { icon: ShieldCheck, title: "Pay on ICICI Bank's page", text: "You're sent to the bank's secure checkout." },
  { icon: ReceiptText, title: "Get your payment ID", text: "Shown here and emailed as your receipt." },
];

const METHODS = { INR: [{ icon: CreditCard, label: "Cards" }, { icon: Smartphone, label: "UPI" }, { icon: Landmark, label: "Net banking" }, { icon: Wallet, label: "Wallets" }], USD: [{ icon: CreditCard, label: "International cards" }] };

/** Shared body of the three payment pages: how it works on the left, the checkout card on the right. */
export function PaymentLayout({ eyebrow, title, intro, currency, children }: { eyebrow: string; title: string; intro: string; currency: "INR" | "USD"; children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-mist py-[clamp(72px,9vw,128px)] text-ink">
      <div aria-hidden className="pointer-events-none absolute top-24 right-[-8%] size-[520px] rounded-full bg-[radial-gradient(circle,rgba(0,66,130,.10),transparent_65%)]" />
      <div className={`${wrap} relative grid items-start gap-[clamp(40px,6vw,80px)] lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]`}>
        <div className="grid gap-8 lg:sticky lg:top-28">
          <div>
            <p data-reveal="0" className="mb-4 flex items-center gap-3 text-xs font-bold tracking-[.18em] text-red uppercase"><span className="h-0.5 w-7 bg-red" />{eyebrow}</p>
            <h2 data-reveal="0.08" className={h2}>{title}</h2>
            <p data-reveal="0.16" className="mt-5 text-[16px] leading-[1.75] text-pretty text-ink-2">{intro}</p>
          </div>

          <ol data-stagger className="grid gap-0">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative flex gap-4 pb-6 last:pb-0">
                {i < STEPS.length - 1 && <span aria-hidden className="absolute top-11 bottom-1 left-[21px] w-px bg-gradient-to-b from-blue/30 to-blue/5" />}
                <span className="relative flex size-11 flex-none items-center justify-center rounded-2xl bg-white text-blue shadow-[0_6px_18px_rgba(11,26,51,.08)] ring-1 ring-ink/[.06]">
                  <Icon className="size-5" />
                  <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-red-dark text-[10px] font-bold text-white">{i + 1}</span>
                </span>
                <div className="pt-1">
                  <p className="font-display text-[17px] font-bold">{title}</p>
                  <p className="mt-0.5 text-sm text-ink-2">{text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div data-reveal="0.1" className="relative">
            <img src={`${LIVE}/assets/img/payment/online-payment.webp`} alt="" className="aspect-[16/10] w-full rounded-[28px] object-cover" />
            <div className="pay-float absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-[0_14px_34px_rgba(11,26,51,.16)] ring-1 ring-ink/[.06] backdrop-blur-md">
              <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><ShieldCheck className="size-5" /></span>
              <span className="text-sm leading-tight">
                <b className="block text-ink">Secured by ICICI Bank</b>
                <span className="text-ink-2">Encrypted end to end</span>
              </span>
            </div>
          </div>

          <div data-reveal="0.15" className="mt-2 grid gap-3">
            <p className="text-xs font-bold tracking-[.14em] text-ink-2 uppercase">Accepted</p>
            <div className="flex flex-wrap gap-2">
              {METHODS[currency].map(({ icon: Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold ring-1 ring-ink/[.07]"><Icon className="size-4 text-blue" />{label}</span>
              ))}
            </div>
          </div>

          <div data-reveal="0.2" className="grid gap-3">
            <p className="text-xs font-bold tracking-[.14em] text-ink-2 uppercase">Need help?</p>
            <ContactChips />
          </div>
        </div>

        <div data-reveal="0.1" className="relative">
          {/* Soft brand glow behind the checkout card. */}
          <div aria-hidden className="absolute -inset-6 -z-0 rounded-[40px] bg-[radial-gradient(60%_50%_at_80%_0%,rgba(0,66,130,.16),transparent),radial-gradient(50%_40%_at_10%_100%,rgba(230,0,0,.10),transparent)] blur-2xl" />
          <div className="relative rounded-[30px] bg-gradient-to-br from-blue/35 via-ink/[.06] to-red/30 p-px shadow-[0_30px_70px_-20px_rgba(11,26,51,.25)]">{children}</div>
        </div>
      </div>
    </section>
  );
}
