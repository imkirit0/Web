"use client";

import { startTransition, useActionState } from "react";
import { Check } from "lucide-react";
import { submitForm, type FormState } from "@/app/actions";

export const fieldClass =
  "w-full rounded-[14px] border border-ink/12 bg-white px-4 py-3.5 text-[15px] text-ink outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10";

/**
 * Light-theme form shell for simple site forms. Pass the inputs as children (use `fieldClass`);
 * `form` names the submission so it can be routed later.
 */
export function SiteForm({ form, submit = "Send", success = "Thanks! We've got your message and will be in touch soon.", children }: { form: string; submit?: string; success?: string; children: React.ReactNode }) {
  const [state, action, pending] = useActionState<FormState, FormData>(submitForm, { ok: false, message: "" });
  if (state.ok)
    return (
      <div role="status" className="rounded-[28px] bg-white p-10 text-center ring-1 ring-ink/6">
        <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-ice text-blue"><Check className="size-6" strokeWidth={2.6} /></span>
        <p className="font-display text-xl font-bold text-ink">{success}</p>
      </div>
    );
  return (
    <form
      className="grid gap-4 rounded-[28px] bg-white p-[clamp(24px,4vw,40px)] ring-1 ring-ink/6"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        data.set("form", form);
        startTransition(() => action(data));
      }}
    >
      {children}
      {state.message && <p role="alert" className="text-sm font-semibold text-red">{state.message}</p>}
      <button disabled={pending} className="justify-self-start rounded-full bg-blue px-7 py-3.5 text-[15px] font-bold text-white transition hover:bg-blue-dark disabled:opacity-60">
        {pending ? "Sending…" : submit}
      </button>
    </form>
  );
}
