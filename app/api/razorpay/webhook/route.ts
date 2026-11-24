import { sendPaymentReceipt } from "@/lib/razorpay";
import { validSignature } from "@/lib/signature";

/**
 * Razorpay webhook (Dashboard → Webhooks): URL https://www.gteceducation.com/api/razorpay/webhook,
 * event "order.paid", secret = RAZORPAY_WEBHOOK_SECRET. Non-2xx makes Razorpay retry.
 * Only IDs are taken from the payload; the receipt re-fetches everything from the Razorpay API.
 */
export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook not configured", { status: 503 });
  if (Number(request.headers.get("content-length") ?? 0) > 100_000) return new Response("Too large", { status: 413 });
  const body = await request.text();
  if (!validSignature(body, request.headers.get("x-razorpay-signature") ?? "", secret)) return new Response("Bad signature", { status: 401 });

  let event: { event?: string; payload?: { order?: { entity?: { id?: string } }; payment?: { entity?: { id?: string } } } };
  try {
    event = JSON.parse(body);
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }
  const orderId = event.payload?.order?.entity?.id, paymentId = event.payload?.payment?.entity?.id;
  if (event.event !== "order.paid" || typeof orderId !== "string" || typeof paymentId !== "string") return new Response("ignored");
  return (await sendPaymentReceipt(orderId, paymentId)) ? new Response("ok") : new Response("Retry", { status: 500 });
}
