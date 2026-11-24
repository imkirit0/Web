import { cookies } from "next/headers";
import { deliver } from "@/lib/deliver";
import { PAY_COOKIE, PAYMENTS, openPayer, paidCode, sameHex, secureHash } from "@/lib/icici";

/**
 * ICICI Orange PG posts the payment result here from the payer's browser (the returnURL sent with initiateSale).
 * The post is trusted only if its secureHash checks out against ICICI_PG_SECRET; then the team is emailed a receipt
 * and the payer is sent back to the payment page with the outcome.
 */
export async function POST(request: Request) {
  const secret = process.env.ICICI_PG_SECRET;
  if (!secret) return new Response("Payments not configured", { status: 503 });
  if (Number(request.headers.get("content-length") ?? 0) > 20_000) return new Response("Too large", { status: 413 });

  const form = await request.formData().catch(() => null);
  const params: Record<string, string> = {};
  let hash = "";
  for (const [k, v] of form ?? []) {
    if (typeof v !== "string") continue;
    if (k.toLowerCase() === "securehash") hash = v;
    else params[k] = v.slice(0, 500);
  }
  const kind = Object.hasOwn(PAYMENTS, params.addlParam1 ?? "") ? params.addlParam1 : "onlinepayment";
  const back = (q: string) => Response.redirect(new URL(`/${kind}?${q}#pay`, request.url), 303);
  if (!hash || !sameHex(secureHash(params, secret), hash)) {
    console.error("ICICI return: bad secureHash", params.merchantTxnNo);
    return back("payment=unverified");
  }

  const txn = params.merchantTxnNo ?? "";
  const jar = await cookies();
  const payer = openPayer(jar.get(PAY_COOKIE)?.value, secret);
  jar.delete(PAY_COOKIE);
  if (!paidCode(params.responseCode)) return back(`payment=failed&txn=${encodeURIComponent(txn)}`);

  // Payer details come from our signed cookie (same browser); the bank's own fields are always included.
  const details = payer?.txn === txn ? payer : { note: "Payer details unavailable (paid from a different browser); match by transaction number in the ICICI dashboard." };
  // ponytail: no store, so a payer who closes the tab before ICICI redirects back sends no email; the ICICI merchant dashboard still has it.
  await deliver(`Payment received (${kind}): ${details.name ?? txn}`, { ...details, ...Object.fromEntries(Object.entries(params).map(([k, v]) => [`icici_${k}`, v])) }, "payments.jsonl");
  return back(`payment=success&txn=${encodeURIComponent(txn)}`);
}
