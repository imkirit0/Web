"use client";

import { useEffect, useState } from "react";
import { Check, Lock } from "lucide-react";
import { createPaymentOrder } from "@/app/actions";
import type { PayKind } from "@/lib/icici";
import { fieldClass } from "@/components/SiteForm";
import { Field, FieldGrid } from "@/components/student-pages";

/** Payer details + amount → ICICI's hosted payment page → back here via /api/icici/return with the outcome. */
export function PaymentForm({ kind, currency, purposes, centreLabel = "G-TEC centre" }: { kind: PayKind; currency: "INR" | "USD"; purposes: string[]; centreLabel?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState("");

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
      <div id="pay" role="status" className="rounded-[28px] bg-white p-10 text-center ring-1 ring-ink/[.07] shadow-card">
        <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-ice text-blue"><Check className="size-6" strokeWidth={2.6} /></span>
        <p className="font-display text-xl font-bold text-ink">Payment successful. Thank you!</p>
        <p className="mt-2 text-sm text-ink-2">{paid && <>Transaction number: <b className="font-mono">{paid}</b>. Keep it for your records.</>}</p>
      </div>
    );

  return (
    <form id="pay" onSubmit={pay} className="grid gap-4 rounded-[28px] bg-white p-[clamp(24px,4vw,40px)] ring-1 ring-ink/[.07] shadow-card">
      <FieldGrid>
        <Field label="Name" required wide><input name="name" required minLength={2} maxLength={100} autoComplete="name" className={fieldClass} /></Field>
        <Field label="Email" required><input name="email" type="email" required autoComplete="email" className={fieldClass} /></Field>
        <Field label="Contact number" required><input name="phone" type="tel" required autoComplete="tel" className={fieldClass} /></Field>
        <Field label={centreLabel} wide><input name="centre" maxLength={200} className={fieldClass} /></Field>
        <Field label="Paying for" required>
          <select name="purpose" required defaultValue="" className={fieldClass}>
            <option value="" disabled>Choose…</option>
            {purposes.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label={`Amount (${currency === "INR" ? "₹" : "$"})`} required>
          <input name="amount" type="number" required min={1} max={9999999} step="0.01" inputMode="decimal" className={fieldClass} />
        </Field>
        <Field label="Details (course, invoice no., particulars)" wide><textarea name="details" rows={3} maxLength={250} className={fieldClass} /></Field>
      </FieldGrid>
      {error && <p role="alert" className="text-sm font-semibold text-red">{error}</p>}
      <button disabled={busy} className="mt-1 inline-flex items-center gap-2 justify-self-start rounded-full bg-red px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(255,1,0,.28)] transition hover:-translate-y-0.5 hover:bg-red-dark disabled:opacity-60">
        <Lock className="size-4" /> {busy ? "Processing…" : "Pay securely"}
      </button>
      <p className="text-xs text-ink-2">Payments are processed securely by ICICI Bank. Cards, UPI and net banking accepted{currency === "USD" ? " (international cards)" : ""}.</p>
    </form>
  );
}
