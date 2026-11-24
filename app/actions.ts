"use server";

import { deliver } from "@/lib/deliver";
import { cookies, headers } from "next/headers";
import { PAY_COOKIE, PAYMENTS, initiateSale, sealPayer, type PayKind } from "@/lib/icici";
import { CONTACT, COUNTRIES, COURSES } from "@/lib/data";

const FAILED = `Sorry, we couldn't send that right now. Please call us on ${CONTACT.phone.label}.`;

export type EnquiryState = { ok: boolean; message: string; errors?: Record<string, string> };

export async function submitEnquiry(_: EnquiryState, form: FormData): Promise<EnquiryState> {
  const get = (k: string) => String(form.get(k) ?? "").trim();
  const name = get("name");
  const phone = get("phone");
  const email = get("email");
  const country = get("country");
  const course = get("course");
  const message = get("message").slice(0, 2000);

  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 100) errors.name = "Please enter your name.";
  if (!/^\+?[\d\s()-]{7,20}$/.test(phone)) errors.phone = "Please enter a valid phone number.";
  if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)) errors.email = "Please enter a valid email.";
  if (country && !COUNTRIES.some((c) => c.name === country)) errors.country = "Unknown country.";
  if (course && !COURSES.some((c) => c.slug === course)) errors.course = "Unknown course.";
  if (Object.keys(errors).length) return { ok: false, message: "Please fix the highlighted fields.", errors };

  const sent = await deliver(`New enquiry: ${name}`, { name, phone, email, country, course, message }, "enquiries.jsonl");
  return sent ? { ok: true, message: "" } : { ok: false, message: FAILED };
}

export type FormState = { ok: boolean; message: string };

const FORMS = ["feedback", "postamessage", "becomeapartner", "postvacancy", "vacancy-application", "careers", "jobfair", "testimonial", "placement", "centre-enquiry", "course-enquiry", "support"] as const;

/** Generic handler for the site's simple contact-style forms. Fields are free-form; we only check the basics. */
export async function submitForm(_: FormState, form: FormData): Promise<FormState> {
  const kind = String(form.get("form") ?? "");
  if (!(FORMS as readonly string[]).includes(kind)) return { ok: false, message: "Unknown form." };
  const data: Record<string, string> = {};
  for (const [k, v] of form.entries()) if (typeof v === "string" && k !== "form") data[k] = v.trim().slice(0, 2000);
  if (!data.name || data.name.length < 2) return { ok: false, message: "Please enter your name." };
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { ok: false, message: "Please enter a valid email." };
  const phone = data.phone ?? data.mobile ?? data.contact_number;
  if (phone && !/^\+?[\d\s()-]{7,20}$/.test(phone)) return { ok: false, message: "Please enter a valid phone number." };

  const sent = await deliver(`Website form (${kind}): ${data.name}`, { form: kind, ...data }, "forms.jsonl");
  return sent ? { ok: true, message: "" } : { ok: false, message: FAILED };
}

// ---- ICICI Orange PG ----

export type OrderResult = { ok: true; url: string } | { ok: false; message: string };

/**
 * Validates the payer's details, registers the sale with ICICI and returns ICICI's hosted payment page to redirect to.
 * The amount is what the payer enters (fee payment). ICICI posts the result to /api/icici/return.
 */
export async function createPaymentOrder(form: FormData): Promise<OrderResult> {
  const get = (k: string) => String(form.get(k) ?? "").trim();
  const kind = get("kind") as PayKind;
  if (!Object.hasOwn(PAYMENTS, kind)) return { ok: false, message: "Unknown payment type." };
  const f = { name: get("name"), email: get("email"), phone: get("phone"), centre: get("centre"), purpose: get("purpose"), details: get("details") };
  if (f.name.length < 2 || f.name.length > 100) return { ok: false, message: "Please enter your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email) || f.email.length > 200) return { ok: false, message: "Please enter a valid email." };
  if (!/^\+?[\d\s()-]{7,20}$/.test(f.phone)) return { ok: false, message: "Please enter a valid phone number." };
  if (!(PAYMENTS[kind].purposes as readonly string[]).includes(f.purpose)) return { ok: false, message: "Please choose what you are paying for." };
  const amount = get("amount");
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(amount) || Number(amount) < 1) return { ok: false, message: "Please enter a valid amount." };

  const h = await headers();
  const host = h.get("host") ?? "www.gteceducation.com";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const sale = await initiateSale({ kind, amount, ...f, returnURL: `${proto}://${host}/api/icici/return` });
  if (!sale) return { ok: false, message: `Sorry, the payment gateway isn't available right now. Please try again or call us on ${CONTACT.phone.label}.` };

  // The return post is cross-site from ICICI, so the cookie must be SameSite=None (and therefore Secure).
  const payer = Object.fromEntries(Object.entries({ kind, ...f, amount: `${PAYMENTS[kind].currency} ${Number(amount).toFixed(2)}`, txn: sale.txnNo }).map(([k, v]) => [k, v.slice(0, 250)]));
  (await cookies()).set(PAY_COOKIE, sealPayer(payer, process.env.ICICI_PG_SECRET!), { httpOnly: true, secure: true, sameSite: "none", path: "/api/icici", maxAge: 3600 });
  return { ok: true, url: sale.url };
}
