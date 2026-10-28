"use server";

import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { CONTACT, COUNTRIES, COURSES } from "@/lib/data";

const FAILED = `Sorry, we couldn't send that right now. Please call us on ${CONTACT.phone.label}.`;

/**
 * Emails a submission to the G-TEC team via Resend (RESEND_API_KEY, optional FORMS_TO / FORMS_FROM).
 * Without a key, development falls back to data/<file>.jsonl; production reports failure rather than dropping it.
 */
async function deliver(subject: string, fields: Record<string, string>, file: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      console.error("RESEND_API_KEY is not set; form submission not delivered:", subject);
      return false;
    }
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, file), JSON.stringify({ subject, ...fields, at: new Date().toISOString() }) + "\n");
    return true;
  }
  const esc = (v: string) => v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#4a5873"><b>${esc(k)}</b></td><td style="padding:4px 0">${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.FORMS_FROM ?? "G-TEC Website <onboarding@resend.dev>",
      to: (process.env.FORMS_TO ?? CONTACT.email.label).split(","),
      reply_to: fields.email || undefined,
      subject,
      html: `<table>${rows}</table>`,
    }),
  }).catch(() => null);
  if (!res?.ok) console.error("Resend failed:", res?.status, await res?.text().catch(() => ""));
  return !!res?.ok;
}

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

const FORMS = ["feedback", "postamessage", "becomeapartner", "postvacancy", "vacancy-application", "jobfair", "testimonial", "placement", "centre-enquiry", "course-enquiry", "support"] as const;

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
