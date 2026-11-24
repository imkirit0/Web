import { createHmac, timingSafeEqual } from "node:crypto";

/** What each payment page accepts. Shared by the pages (to render) and the server (to validate). */
export const PAYMENTS = {
  onlinepayment: { currency: "INR", purposes: ["Course / certification fee", "Live classes", "NSDC programme", "G-Coderz programme", "Soft skills workshop", "Centre registration"] },
  paymentforcentres: { currency: "INR", purposes: ["Subscription fee", "G-TEC Universities fee", "GenSmart Academy fee", "Royalty", "Franchise registration", "Examination fee", "Course fee"] },
  onlineinternationalpayment: { currency: "USD", purposes: ["Royalty", "Global Campus Franchisee Fee"] },
} as const;
export type PayKind = keyof typeof PAYMENTS;

const CURRENCY_CODE = { INR: "356", USD: "840" } as const; // ISO 4217 numeric, as ICICI expects
// Production endpoint. For UAT, set ICICI_PG_URL to the initiateSale URL in ICICI's UAT kit.
const DEFAULT_URL = "https://pgpay.icicibank.com/pg/api/v2/initiateSale";
export const PAY_COOKIE = "gtec_pay";

/** ICICI Orange PG secureHash: values concatenated in alphabetical key order, HMAC-SHA256 with the merchant key, hex. */
export function secureHash(fields: Record<string, string>, secret: string) {
  const plain = Object.keys(fields).sort().map((k) => fields[k]).join("");
  return createHmac("sha256", secret).update(plain).digest("hex");
}

/** Constant-time, case-insensitive compare of two hex strings. */
export function sameHex(a: string, b: string) {
  const x = Buffer.from(a.toLowerCase()), y = Buffer.from(b.toLowerCase());
  return x.length === y.length && timingSafeEqual(x, y);
}

/** yyyyMMddHHmmss in India time. */
function txnDate(d = new Date()) {
  return new Date(d.getTime() + 330 * 60_000).toISOString().replace(/\D/g, "").slice(0, 14);
}

export type Sale = { kind: PayKind; amount: string; name: string; email: string; phone: string; purpose: string; returnURL: string };

/**
 * Registers the sale with ICICI (server to server) and returns the hosted payment page URL to send the payer to.
 * Null on missing config, network failure or a refusal from ICICI (logged).
 */
export async function initiateSale(s: Sale): Promise<{ url: string; txnNo: string } | null> {
  const merchantId = process.env.ICICI_PG_MERCHANT_ID, secret = process.env.ICICI_PG_SECRET;
  if (!merchantId || !secret) return console.error("ICICI_PG_MERCHANT_ID / ICICI_PG_SECRET not set"), null;
  // Alphanumeric, at most 20 characters (ICICI rule). 19 here.
  const merchantTxnNo = `GT${Date.now()}${Math.floor(Math.random() * 1e4).toString().padStart(4, "0")}`;
  const digits = s.phone.replace(/\D/g, "");
  const fields: Record<string, string> = {
    addlParam1: s.kind,
    addlParam2: s.purpose.slice(0, 50),
    amount: Number(s.amount).toFixed(2),
    currencyCode: CURRENCY_CODE[PAYMENTS[s.kind].currency],
    customerEmailID: s.email,
    customerMobileNo: digits.length === 10 ? `91${digits}` : digits,
    customerName: s.name.replace(/[^\p{L}\p{N} .'-]/gu, "").slice(0, 50),
    merchantId,
    merchantTxnNo,
    payType: "0", // standard redirect to ICICI's hosted page
    returnURL: s.returnURL,
    transactionType: "SALE",
    txnDate: txnDate(),
  };
  if (process.env.ICICI_PG_AGGREGATOR_ID) fields.aggregatorID = process.env.ICICI_PG_AGGREGATOR_ID;

  const res = await fetch(process.env.ICICI_PG_URL || DEFAULT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...fields, secureHash: secureHash(fields, secret) }),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  }).catch(() => null);
  const out = (await res?.json().catch(() => null)) as { responseCode?: string; redirectURI?: string; tranCtx?: string } | null;
  if (out?.responseCode !== "R1000" || !out.redirectURI || !out.tranCtx) {
    console.error("ICICI initiateSale refused:", res?.status, JSON.stringify(out));
    return null;
  }
  return { url: `${out.redirectURI}?tranCtx=${encodeURIComponent(out.tranCtx)}`, txnNo: merchantTxnNo };
}

/** Success codes on ICICI's return post. */
export const paidCode = (code = "") => code === "000" || code.startsWith("0000");

/** Payer details carried to the return route in a cookie, signed with the merchant key so it can't be edited. */
export function sealPayer(data: Record<string, string>, secret: string) {
  const body = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${body}.${createHmac("sha256", secret).update(body).digest("hex")}`;
}

export function openPayer(cookie: string | undefined, secret: string): Record<string, string> | null {
  const [body, sig] = cookie?.split(".") ?? [];
  if (!body || !sig || !sameHex(createHmac("sha256", secret).update(body).digest("hex"), sig)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString());
  } catch {
    return null;
  }
}

// Self-check: node --experimental-strip-types lib/icici.ts
if (process.argv[1]?.endsWith("icici.ts")) {
  const h = secureHash({ b: "2", a: "1" }, "k");
  if (h !== createHmac("sha256", "k").update("12").digest("hex")) throw new Error("hash not in key order");
  if (txnDate(new Date("2026-01-01T00:00:00Z")) !== "20260101053000") throw new Error("txnDate not IST");
  const c = sealPayer({ name: "A" }, "k");
  if (openPayer(c, "k")?.name !== "A") throw new Error("seal round trip");
  if (openPayer(c.replace(/^./, "x"), "k")) throw new Error("tampered cookie accepted");
  if (!sameHex("AB", "ab") || sameHex("ab", "abc")) throw new Error("sameHex");
  if (!paidCode("0000") || !paidCode("000") || paidCode("R1000")) throw new Error("paid codes");
  console.log("icici ok");
}
