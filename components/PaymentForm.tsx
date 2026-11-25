"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, Loader2, Lock, ShieldCheck } from "lucide-react";
import { createPaymentOrder } from "@/app/actions";
import type { PayKind } from "@/lib/icici";
import { fieldClass } from "@/components/SiteForm";
import { Field, FieldGrid } from "@/components/student-pages";

function Group({ n, title }: { n: number; title: string }) {
  return (
    <p className="flex items-center gap-2.5 text-xs font-bold tracking-[.14em] text-ink-2 uppercase">
      <span className="flex size-6 items-center justify-center rounded-full bg-ice text-[11px] text-blue">{n}</span>
      {title}
      <span className="h-px flex-1 bg-ink/[.07]" />
    </p>
  );
}

/** Payer details + amount → ICICI's hosted payment page → back here via /api/icici/return with the outcome. */
export function PaymentForm({ kind, currency, purposes, centreLabel = "G-TEC centre" }: { kind: PayKind; currency: "INR" | "USD"; purposes: string[]; centreLabel?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState("");
  const [amount, setAmount] = useState("");
  const symbol = currency === "INR" ? "₹" : "$";
  const total = Number(amount) > 0 ? new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", { style: "currency", currency }).format(Number(amount)) : "";

  // The return route sends the payer back with ?payment=success|failed|unverified&txn=…
  useEffect(() => {
    const q = new URLSearchParams(location.search), txn = q.get("txn") ?? "";
    const outcome = q.get("payment");
    if (outcome === "success") setPaid(txn);
    else if (outcome === "failed") setError(`The payment didn't go through${txn ? ` (reference ${txn})` : ""}. No money was taken, or any deduction will be reversed by your bank. Please try again.`);
    else if (outcome === "unverified") setError("We couldn't verify the payment response. If money was deducted, email us with your bank reference.");
    // Busy is stuck on if the payer comes Back from ICICI's page (bfcache); reset it.
    const reset = (e: PageTransitionEvent) => e.persisted && setBusy(false);
    addEventListener("pageshow", reset);
    return () => removeEventListener("pageshow", reset);
  }, []);

  async function pay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    data.set("kind", kind);
    setBusy(true);
    setError("");
    const order = await createPaymentOrder(data);
    if (!order.ok) {
      setBusy(false);
      return setError(order.message);
    }
    location.assign(order.url);
  }

  if (paid)
    return (
      <div id="pay" role="status" className="rounded-[29px] bg-white p-10 text-center">
        <span className="mx-auto mb-5 flex size-16 animate-[pop_.5s_var(--ease-out-expo)] items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60"><Check className="size-7" strokeWidth={2.6} /></span>
        <p className="font-display text-2xl font-bold text-ink">Payment successful. Thank you!</p>
        <p className="mt-2 text-sm text-ink-2">Transaction number: <b className="font-mono text-ink">{paid}</b>. Keep it for your records.</p>
      </div>
    );

  return (
    <form id="pay" onSubmit={pay} className="grid gap-6 rounded-[29px] bg-white p-[clamp(24px,4vw,40px)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-xl font-bold text-ink">Payment details</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><Lock className="size-3.5" /> Secure checkout</span>
      </div>

      <Group n={1} title="Your details" />
      <FieldGrid>
        <Field label="Name" required wide><input name="name" required minLength={2} maxLength={100} autoComplete="name" placeholder="Full name" className={fieldClass} /></Field>
        <Field label="Email" required><input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={fieldClass} /></Field>
        <Field label="Contact number" required><input name="phone" type="tel" required autoComplete="tel" placeholder="+91" className={fieldClass} /></Field>
        <Field label={centreLabel} wide><input name="centre" maxLength={200} placeholder="Optional" className={fieldClass} /></Field>
      </FieldGrid>

      <Group n={2} title="Payment" />
      <fieldset className="grid gap-2.5">
        <legend className="mb-2.5 text-sm font-semibold text-ink">Paying for<span className="text-red"> *</span></legend>
        <div className="flex flex-wrap gap-2">
          {purposes.map((p, i) => (
            <label key={p} className="cursor-pointer rounded-full border border-ink/10 bg-mist/70 px-4 py-2.5 text-sm font-semibold text-ink-2 transition hover:border-ink/25 has-[:checked]:border-blue has-[:checked]:bg-blue has-[:checked]:text-white has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-blue/20 active:scale-[.97]">
              <input type="radio" name="purpose" value={p} required={i === 0} className="sr-only" />
              {p}
            </label>
          ))}
        </div>
      </fieldset>
      <FieldGrid>
        <Field label={`Amount (${currency})`} required wide>
          <span className="relative block">
            <span aria-hidden className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-lg font-bold text-ink-2">{symbol}</span>
            <input name="amount" type="number" required min={1} max={9999999} step="0.01" inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className={`${fieldClass} pl-10 text-lg font-bold tabular-nums`} />
          </span>
        </Field>
        <Field label="Details" wide><textarea name="details" rows={3} maxLength={250} placeholder="Course, invoice number or other particulars" className={fieldClass} /></Field>
      </FieldGrid>

      {error && (
        <p role="alert" className="flex items-start gap-2.5 rounded-2xl bg-red/[.06] px-4 py-3 text-sm font-semibold text-red-dark ring-1 ring-red/15">
          <AlertCircle className="mt-0.5 size-4 flex-none" /> {error}
        </p>
      )}

      <button disabled={busy} className="group relative inline-flex w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-full bg-red-dark px-7 py-4 text-base font-bold text-white shadow-[0_14px_32px_-8px_rgba(230,0,0,.5)] transition hover:-translate-y-0.5 hover:bg-[#c40000] hover:shadow-[0_18px_36px_-8px_rgba(230,0,0,.55)] active:translate-y-0 disabled:cursor-wait disabled:opacity-75 disabled:hover:translate-y-0">
        {!busy && <span aria-hidden className="pay-shimmer pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />}
        {busy ? <Loader2 className="size-5 animate-spin" /> : <Lock className="size-4" />}
        {busy ? "Taking you to ICICI Bank…" : total ? `Pay ${total} securely` : "Pay securely"}
      </button>
      <p className="-mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-ink-2">
        <ShieldCheck className="size-3.5 text-emerald-600" /> Processed by ICICI Bank. {currency === "USD" ? "International cards accepted." : "Cards, UPI and net banking accepted."}
      </p>
    </form>
  );
}
