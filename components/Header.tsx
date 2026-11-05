"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Phone, X } from "lucide-react";
import { CONTACT, COURSES_NAV, NAV, type NavItem, type NavLink } from "@/lib/data";
import { cn } from "@/lib/utils";

const isActive = (pathname: string, href: string) => href.startsWith("/") && (pathname === href || (href !== "/" && pathname.startsWith(href + "/")));

function MenuLink({ link, className }: { link: NavLink; className?: string }) {
  const desc = link.desc && <span className="mt-0.5 block text-[13px] font-normal text-ink-2/80">{link.desc}</span>;
  return link.href.startsWith("/") ? (
    // Blur so the focus-driven dropdown closes after client-side navigation.
    <Link href={link.href} onClick={(e) => e.currentTarget.blur()} className={className}>{link.label}{desc}</Link>
  ) : (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {link.label} <ArrowUpRight className="inline size-3.5 opacity-50" />
      {desc}
    </a>
  );
}

const topLink = "relative flex h-10 items-center gap-1 rounded-full px-2.5 text-base font-medium whitespace-nowrap transition-colors hover:text-blue 2xl:px-3.5";
/** Underline that wipes in from the left. */
const underline = "after:absolute after:inset-x-2.5 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-red after:transition-transform after:duration-300 after:ease-out-expo hover:after:scale-x-100 2xl:after:inset-x-3.5";
// Mouse users open on hover only, so a clicked trigger can't hold its menu open over the next one. Keyboard users open on focus. Closing turns transparent at once, so two menus never overlap; visibility lags slightly so Tab can still land on a link inside.
const panel = "invisible absolute top-full left-0 z-10 pt-3 translate-y-1.5 opacity-0 [transition:visibility_0s_linear_60ms] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:[transition:opacity_200ms,translate_260ms_var(--ease-out-expo)] group-has-[:focus-visible]:visible group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100";
const panelInner = "max-h-[calc(100svh-6rem)] w-72 overflow-y-auto rounded-2xl bg-white p-2 shadow-[0_16px_48px_rgba(11,26,51,.16)] ring-1 ring-ink/[.06]";
const panelLink = "block rounded-xl px-3.5 py-2.5 text-base font-medium text-ink transition hover:bg-mist";

function Dropdown({ item, pathname, trigger }: { item: { label: string; children: NavLink[] }; pathname: string; trigger: string }) {
  return (
    <div className="group relative">
      <button type="button" aria-haspopup="true" className={trigger}>
        {item.label}
        <ChevronDown className="size-4 transition-transform group-hover:rotate-180" />
      </button>
      <div className={panel}>
        <div className={panelInner}>
          {item.children.map((c) => <MenuLink key={c.href} link={c} className={cn(panelLink, isActive(pathname, c.href) && "bg-ice")} />)}
        </div>
      </div>
    </div>
  );
}

function DesktopItem({ item, pathname }: { item: NavItem; pathname: string }) {
  if ("href" in item) {
    const on = isActive(pathname, item.href);
    return <Link href={item.href} aria-current={on ? "page" : undefined} className={cn(topLink, underline, on && "text-blue after:scale-x-100")}>{item.label}</Link>;
  }
  const on = item.children.some((c) => isActive(pathname, c.href));
  return <Dropdown item={item} pathname={pathname} trigger={cn(topLink, "group-hover:text-blue group-has-[:focus-visible]:text-blue", on && "text-blue")} />;
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => setOpen(false), [pathname]);

  // Slides away while reading down the page and returns on any scroll up.
  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      if (Math.abs(y - last) < 8) return;
      setHidden(y > last && y > 240);
      last = y;
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [pathname]);

  // The menu is a dialog: focus moves in when it opens and back when it closes.
  useEffect(() => {
    if (open) closeButton.current?.focus();
    else if (wasOpen.current) menuButton.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header data-hidden={hidden || undefined} className="site-header font-nav fixed inset-x-0 top-0 z-60 bg-white text-ink shadow-[0_4px_20px_rgba(11,26,51,.1)]">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-8">
          <Link href="/" aria-label="G-TEC Education home" className="flex-none">
            <img src="/logo-mark-dark.png" alt="G-TEC Education" className="block h-12 w-auto" />
          </Link>

          <div className="hidden flex-none xl:ml-4 xl:block">
            <Dropdown
              item={COURSES_NAV}
              pathname={pathname}
              trigger="flex h-11 items-center gap-1.5 rounded-full border border-blue px-5 text-base font-medium whitespace-nowrap text-blue transition-colors hover:bg-blue hover:text-white"
            />
          </div>

          <nav aria-label="Main" className="mx-auto hidden items-center gap-0.5 xl:flex">
            {NAV.map((item) => <DesktopItem key={item.label} item={item} pathname={pathname} />)}
          </nav>

          <a href="#enquire" className="hidden h-11 flex-none items-center rounded-full bg-blue px-6 text-base font-medium whitespace-nowrap text-white transition-colors hover:bg-blue-dark active:scale-[.97] xl:flex">
            Enquire now
          </a>

          <button ref={menuButton} type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="flex flex-col items-end gap-1.5 p-2 xl:hidden">
            <span className="h-0.5 w-6 bg-ink" />
            <span className="h-0.5 w-4 bg-red" />
          </button>
        </div>
      </header>

      {/* Always mounted so it can animate out; `inert` keeps it out of the tab order while closed. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        data-open={open || undefined}
        className="mobile-menu font-nav fixed inset-0 z-70 flex flex-col overflow-auto bg-white px-6 pt-3 pb-8 text-ink xl:hidden"
      >
          <div className="flex items-center justify-between">
            <img src="/logo-mark-dark.png" alt="G-TEC Education" className="h-12" />
            <button ref={closeButton} type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 transition-transform duration-300 hover:rotate-90">
              <X className="size-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-6 flex flex-col">
            {[COURSES_NAV, ...NAV].map((item, i) =>
              "href" in item ? (
                <Link key={item.label} href={item.href} style={{ "--i": i } as React.CSSProperties} className="menu-row border-b border-ink/10 py-3.5 text-xl font-medium">{item.label}</Link>
              ) : (
                <details key={item.label} style={{ "--i": i } as React.CSSProperties} className="menu-row group border-b border-ink/10" open={item.children.some((c) => isActive(pathname, c.href))}>
                  <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-xl font-medium [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <ChevronDown className="size-5 text-blue transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="grid pb-3">
                    {item.children.map((c) => <MenuLink key={c.href} link={c} className="py-2 pl-3 text-[15px] font-medium text-ink" />)}
                  </div>
                </details>
              ),
            )}
          </nav>
          <div className="mt-auto grid grid-cols-2 gap-3 pt-10">
            <a href="#enquire" onClick={() => setOpen(false)} className="col-span-2 rounded-full bg-blue p-4 text-center font-bold text-white">
              Enquire now
            </a>
            <Link href={CONTACT.pay} className="rounded-full border border-ink/20 p-4 text-center text-sm font-semibold">
              Pay now
            </Link>
            <a href={CONTACT.whatsapp.href} className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 p-4 text-sm font-semibold">
              <Phone className="size-4" /> Contact
            </a>
          </div>
      </div>
    </>
  );
}
