import { Mail, MessageCircle, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CONTACT } from "@/lib/data";
import { cn } from "@/lib/utils";

const BLOB = "animate-float pointer-events-none absolute rounded-full";

/** Rendered by the root layout on every page. Its own file, so the layout doesn't pull the home page's motion code into every route. */
export function Enquire() {
  const channels = [
    { icon: Phone, label: "Call us", value: CONTACT.phone.label, href: CONTACT.phone.href, tint: "bg-[rgba(0,102,204,.25)] text-sky" },
    { icon: MessageCircle, label: "WhatsApp", value: CONTACT.whatsapp.label, href: CONTACT.whatsapp.href, tint: "bg-[rgba(37,211,102,.2)] text-[#7EE2A3]" },
    { icon: Mail, label: "Email", value: CONTACT.email.label, href: CONTACT.email.href, tint: "bg-red/20 text-[#FF8A80]" },
  ];
  return (
    // Rendered inside EnquireDialog, so no reveal animations: they'd wait on an observer that never sees a closed dialog.
    <section className="relative overflow-hidden p-[clamp(24px,4vw,56px)]">
      <div className={cn(BLOB, "top-0 left-[10%] size-[40vw] bg-[radial-gradient(circle,rgba(0,102,204,.35),transparent_65%)] blur-[50px] [animation:float-a_16s_ease-in-out_infinite]")} />
      <div className={cn(BLOB, "right-[5%] bottom-0 size-[32vw] bg-[radial-gradient(circle,rgba(255,1,0,.22),transparent_65%)] blur-[50px] [animation:float-b_20s_ease-in-out_infinite]")} />
      <div className="relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-[clamp(28px,4vw,56px)]">
        <div>
          <div className="mb-5 flex items-center gap-3 text-xs font-bold tracking-[.18em] text-coral uppercase">
            <span className="h-0.5 w-7 bg-red" />
            Admissions open
          </div>
          <h2 className="font-display mb-5 text-[clamp(32px,4vw,52px)] leading-[1.02] font-extrabold tracking-[-.03em] text-balance">
            Start your journey with G-TEC.
          </h2>
          <p data-reveal="0.2" className="mb-9 max-w-[480px] text-[17px] leading-[1.7] text-pretty text-white/70">
            Tell us what you want to learn and our counsellors will call you back with course options, fees and the nearest centre.
          </p>
          <div className="grid max-w-[420px] gap-3.5">
            {channels.map(({ icon: Icon, label, value, href, tint }) => (
              <a key={label} href={href} className="flex items-center gap-4 rounded-[18px] border border-white/10 bg-white/5 px-4.5 py-4 transition hover:border-white/30 hover:bg-white/8">
                <span className={cn("flex size-10.5 flex-none items-center justify-center rounded-xl", tint)}>
                  <Icon className="size-4.5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold text-white/55">{label}</span>
                  <span className="block font-bold">{value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-white/12 bg-white/5 p-[clamp(24px,3vw,36px)] shadow-[0_40px_100px_rgba(0,0,0,.35)] backdrop-blur-2xl">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
