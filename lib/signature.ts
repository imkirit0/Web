import { createHmac, timingSafeEqual } from "node:crypto";

/** Constant-time check of a hex HMAC-SHA256 signature (Razorpay checkout + webhooks). */
export function validSignature(payload: string, signature: string, secret: string): boolean {
  const expected = Buffer.from(createHmac("sha256", secret).update(payload).digest("hex"));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

// Self-check: node --experimental-strip-types lib/signature.ts
if (process.argv[1]?.endsWith("signature.ts")) {
  const sig = createHmac("sha256", "s").update("order_1|pay_1").digest("hex");
  if (!validSignature("order_1|pay_1", sig, "s")) throw new Error("valid sig rejected");
  if (validSignature("order_1|pay_2", sig, "s")) throw new Error("wrong payload accepted");
  if (validSignature("order_1|pay_1", sig.slice(1), "s")) throw new Error("short sig accepted");
  console.log("signature ok");
}
