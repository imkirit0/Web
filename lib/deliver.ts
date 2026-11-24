import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { CONTACT } from "@/lib/data";

/**
 * Emails a submission to the G-TEC team via Resend (RESEND_API_KEY, optional FORMS_TO / FORMS_FROM).
 * Without a key, development falls back to data/<file>.jsonl; production reports failure rather than dropping it.
 */
export async function deliver(subject: string, fields: Record<string, string>, file: string): Promise<boolean> {
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
