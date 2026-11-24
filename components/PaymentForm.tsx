"use client";

import { useState } from "react";
import { Check, Lock } from "lucide-react";
import { createPaymentOrder, verifyPayment } from "@/app/actions";
import type { PayKind } from "@/lib/razorpay";
import { fieldClass } from "@/components/SiteForm";
import { Field, FieldGrid } from "@/components/student-pages";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
declare global {
  interface Window { Razorpay?: new (options: object) => { open(): void } }
}

function loadCheckout() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/** Payer details + amount → Razorpay Checkout → server-side signature check. */
export function PaymentForm({ kind, currency, purposes, centreLabel = "G-TEC centre" }: { kind: PayKind; currency: "INR" | "USD"; purposes: string[]; centreLabel?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState("");

  async function pay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    data.set("kind", kind);
    setBusy(true);
    setError("");
    const [order, loaded] = await Promise.all([createPaymentOrder(data), loadCheckout()]);
    if (!order.ok || !loaded || !window.Razorpay) {
      setBusy(false);
      return setError(order.ok ? "Couldn't load the payment gateway. Check your connection and try again." : order.message);
    }
    new window.Razorpay({
      key: order.key,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: "G-TEC Education",
      description: String(data.get("purpose")),
      prefill: { name: data.get("name"), email: data.get("email"), contact: data.get("phone") },
      theme: { color: "#004282" },
      modal: { ondismiss: () => setBusy(false) },
      handler: async (r: RazorpayResponse) => {
        const res = await verifyPayment(r.razorpay_order_id, r.razorpay_payment_id, r.razorpay_signature);
        setBusy(false);
        if (res.ok) setPaid(res.message);
        else setError(`${res.message} If money was deducted, email us with payment ID ${r.razorpay_payment_id}.`);
      },
    }).open();
  }

  if (paid)
    return (
      <div role="status" className="rounded-[28px] bg-white p-10 text-center ring-1 ring-ink/[.07] shadow-card">
        <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-ice text-blue"><Check className="size-6" strokeWidth={2.6} /></span>
        <p className="font-display text-xl font-bold text-ink">Payment successful. Thank you!</p>
        <p className="mt-2 text-sm text-ink-2">Payment ID: <b className="font-mono">{paid}</b>. Keep it for your records.</p>
      </div>
    );

  return (
    <form onSubmit={pay} className="grid gap-4 rounded-[28px] bg-white p-[clamp(24px,4vw,40px)] ring-1 ring-ink/[.07] shadow-card">
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
      <p className="text-xs text-ink-2">Payments are processed by Razorpay. Cards, UPI, net banking and wallets accepted{currency === "USD" ? " (international cards)" : ""}.</p>
    </form>
  );
}
