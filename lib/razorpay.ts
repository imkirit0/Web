import { deliver } from "@/lib/deliver";

/** What each payment page accepts. Shared by the pages (to render) and the server (to validate). */
export const PAYMENTS = {
  onlinepayment: { currency: "INR", purposes: ["Course / certification fee", "Live classes", "NSDC programme", "G-Coderz programme", "Soft skills workshop", "Centre registration"] },
  paymentforcentres: { currency: "INR", purposes: ["Subscription fee", "G-TEC Universities fee", "GenSmart Academy fee", "Royalty", "Franchise registration", "Examination fee", "Course fee"] },
  onlineinternationalpayment: { currency: "USD", purposes: ["Royalty", "Global Campus Franchisee Fee"] },
} as const;
export type PayKind = keyof typeof PAYMENTS;

export const RZP_ID = /^[\w-]{1,100}$/;

/** Authenticated Razorpay API call (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET). Null on missing keys or network failure. */
export function razorpay(pathname: string, init?: RequestInit) {
  const id = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) return console.error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set"), Promise.resolve(null);
  return fetch(`https://api.razorpay.com/v1${pathname}`, {
    ...init,
    headers: { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`, "Content-Type": "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
}

async function getJson<T>(pathname: string): Promise<T | null> {
  const res = await razorpay(pathname);
  return res?.ok ? ((await res.json()) as T) : null;
}

/**
 * Emails the team a receipt, using only data fetched from Razorpay: the payment must be authorized/captured and belong
 * to the order. Marks the order (notes.receipt_sent) so replays, webhook retries and the callback+webhook pair email once.
 * Returns false only when a retry could help (Razorpay or email unreachable).
 */
export async function sendPaymentReceipt(orderId: string, paymentId: string): Promise<boolean> {
  if (!RZP_ID.test(orderId) || !RZP_ID.test(paymentId)) return true;
  const [payment, order] = await Promise.all([
    getJson<{ order_id: string; status: string; amount: number; currency: string; method: string }>(`/payments/${paymentId}`),
    getJson<{ notes: Record<string, string> | [] }>(`/orders/${orderId}`),
  ]);
  if (!payment || !order) return false;
  if (payment.order_id !== orderId || !["authorized", "captured"].includes(payment.status)) {
    console.error("Razorpay payment rejected for receipt:", paymentId, payment.status, payment.order_id);
    return true; // not a real payment for this order; nothing to retry
  }
  const notes = Array.isArray(order.notes) ? {} : order.notes; // Razorpay returns [] for empty notes
  if (notes.receipt_sent) return true;
  // ponytail: check-then-mark isn't atomic; a callback and webhook landing in the same instant can still email twice.
  const sent = await deliver(
    `Payment received (${notes.kind ?? "online"}): ${notes.name ?? paymentId}`,
    { ...notes, amount: `${payment.currency} ${(payment.amount / 100).toFixed(2)}`, status: payment.status, method: payment.method, order_id: orderId, payment_id: paymentId },
    "payments.jsonl",
  );
  if (sent) await razorpay(`/orders/${orderId}`, { method: "PATCH", body: JSON.stringify({ notes: { ...notes, receipt_sent: "1" } }) });
  return sent;
}
