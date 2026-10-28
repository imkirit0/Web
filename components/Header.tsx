"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronDown, Phone, X } from "lucide-react";
import { CONTACT, MORE_NAV, NAV, type NavItem, type NavLink } from "@/lib/data";
import { cn } from "@/lib/utils";

const isActive = (pathname: string, href: string) => href.startsWith("/") && (pathname === href || pathname.startsWith(href + "/"));

function MenuLink({ link, className }: { link: NavLink; className?: string }) {
  return link.href.startsWith("/") ? (
    <Link href={link.href} className={className}>{link.label}</Link>
  ) : (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {link.label} <ArrowUpRight className="inline size-3.5 opacity-50" />
    </a>
  );
}

// Every top-level item is the same 36px-tall pill, so links and dropdown triggers line up exactly.
const topLink =
  "flex h-9 items-center gap-1 rounded-full px-2.5 text-[14px] font-medium whitespace-nowrap transition-colors hover:bg-white/8 hover:text-white 2xl:px-3.5";
const panel =
  "invisible absolute top-full z-10 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100";
const panelInner = "min-w-60 rounded-2xl border border-white/10 bg-navy/97 p-2 shadow-[0_24px_60px_rgba(0,0,0,.45)] backdrop-blur-xl";
const panelLink = "block rounded-xl px-3.5 py-2.5 text-[14px] font-medium text-white/75 transition hover:bg-white/8 hover:text-white";

function DesktopItem({ item, pathname }: { item: NavItem; pathname: string }) {
  if ("href" in item) {
    const on = isActive(pathname, item.href);
    return (
      <Link href={item.href} aria-current={on ? "page" : undefined} className={cn(topLink, on ? "bg-white/10 text-white" : "text-white/70")}>
        {item.label}
      </Link>
    );
  }
  const on = item.children.some((c) => isActive(pathname, c.href));
  return (
    <div className="group relative">
      <button type="button" aria-haspopup="true" className={cn(topLink, on ? "bg-white/10 text-white" : "text-white/70 group-focus-within:text-white group-hover:bg-white/8 group-hover:text-white")}>
        {item.label}
        <ChevronDown className="size-3.5 opacity-60 transition-transform group-hover:rotate-180" />
      </button>
      <div className={cn(panel, "left-1/2 -translate-x-1/2")}>
        <div className={panelInner}>
          {item.children.map((c) => <MenuLink key={c.href} link={c} className={cn(panelLink, isActive(pathname, c.href) && "bg-white/8 text-white")} />)}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 40);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-60 transition-[background,border-color,backdrop-filter] duration-500",
          scrolled ? "border-b border-white/8 bg-navy/95 backdrop-blur-xl" : "border-b border-transparent bg-gradient-to-b from-navy/80 to-transparent",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 transition-[height] duration-500 lg:px-8 xl:grid xl:grid-cols-[1fr_auto_1fr]",
            scrolled ? "h-18" : "h-22",
          )}
        >
          <Link href="/" aria-label="G-TEC Education home" className="flex-none justify-self-start">
            <img src="/logo-mark.png" alt="G-TEC Education" className={cn("block w-auto transition-[height] duration-500", scrolled ? "h-11" : "h-13")} />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-0.5 rounded-full border border-white/10 bg-white/[.04] p-1 backdrop-blur-md xl:flex">
            {NAV.map((item) => <DesktopItem key={item.label} item={item} pathname={pathname} />)}
            <div className="group relative">
              <button type="button" aria-haspopup="true" className={cn(topLink, "text-white/70 group-focus-within:text-white group-hover:bg-white/8 group-hover:text-white")}>
                More
                <ChevronDown className="size-3.5 opacity-60 transition-transform group-hover:rotate-180" />
              </button>
              <div className={cn(panel, "right-0")}>
                <div className={cn(panelInner, "grid w-[560px] grid-cols-3 gap-2 p-4")}>
                  {MORE_NAV.map((g) => (
                    <div key={g.label}>
                      <p className="px-3.5 pt-1 pb-2 text-[11px] font-bold tracking-[.14em] text-red uppercase">{g.label}</p>
                      {g.children.map((c) => <MenuLink key={c.href} link={c} className={panelLink} />)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="hidden items-center gap-2 justify-self-end xl:flex">
            <Link href={CONTACT.pay} className="hidden h-11 items-center rounded-full px-4 text-[14px] font-medium whitespace-nowrap text-white/70 transition hover:bg-white/8 hover:text-white min-[1760px]:flex">
              Pay now
            </Link>
            <a
              href="#enquire"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-red pr-2 pl-5 text-[14px] font-semibold whitespace-nowrap shadow-[0_8px_24px_rgba(255,1,0,.3)] transition hover:bg-red-dark"
            >
              Enquire now
              <span className="flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="size-3.5" strokeWidth={2.4} />
              </span>
            </a>
          </div>

          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="flex flex-col items-end gap-1.5 p-2 xl:hidden">
            <span className="h-0.5 w-6 bg-white" />
            <span className="h-0.5 w-4 bg-red" />
          </button>
        </div>
      </header>

      {open && (
        <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-70 flex flex-col overflow-auto bg-navy px-6 pt-5 pb-8 xl:hidden">
          <div className="flex items-center justify-between">
            <img src="/logo-mark.png" alt="G-TEC Education" className="h-13" />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="p-2">
              <X className="size-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-8 flex flex-col">
            <Link href="/" className="font-display border-b border-white/8 py-3.5 text-xl font-bold">Home</Link>
            {[...NAV, ...MORE_NAV].map((item) =>
              "href" in item ? (
                <Link key={item.label} href={item.href} className="font-display border-b border-white/8 py-3.5 text-xl font-bold">{item.label}</Link>
              ) : (
                <details key={item.label} className="group border-b border-white/8" open={item.children.some((c) => isActive(pathname, c.href))}>
                  <summary className="font-display flex cursor-pointer list-none items-center justify-between py-3.5 text-xl font-bold [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <ChevronDown className="size-5 text-red transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="grid pb-3">
                    {item.children.map((c) => <MenuLink key={c.href} link={c} className="py-2 pl-3 text-[15px] font-medium text-white/70 hover:text-white" />)}
                  </div>
                </details>
              ),
            )}
          </nav>
          <div className="mt-auto grid grid-cols-2 gap-3 pt-10">
            <a href="#enquire" onClick={() => setOpen(false)} className="col-span-2 bg-red p-4 text-center font-bold tracking-wider uppercase">
              Enquire Now
            </a>
            <Link href={CONTACT.pay} className="border border-white/20 p-4 text-center text-sm font-semibold">
              Pay Now
            </Link>
            <a href={CONTACT.whatsapp.href} className="inline-flex items-center justify-center gap-2 border border-white/20 p-4 text-sm font-semibold">
              <Phone className="size-4" /> Contact
            </a>
          </div>
        </div>
      )}
    </>
  );
}
