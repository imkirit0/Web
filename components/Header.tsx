"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronRight, CreditCard, Phone, X } from "lucide-react";
import { CONTACT, COURSES_NAV, NAV, type NavItem, type NavLink } from "@/lib/data";
import { cn } from "@/lib/utils";

const isActive = (pathname: string, href: string) => href.startsWith("/") && (pathname === href || (href !== "/" && pathname.startsWith(href + "/")));

function MenuLink({ link, className }: { link: NavLink; className?: string }) {
  const desc = link.desc && <span className="mt-0.5 block text-[13px] font-normal text-ink-2/80">{link.desc}</span>;
  return link.href.startsWith("/") ? (
    // Blur so the focus-driven dropdown closes after client-side navigation.
    <Link href={link.href} onClick={(e) => e.currentTarget.blur()} className={className}><span className="nav-label">{link.label}</span>{desc}</Link>
  ) : (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      <span className="nav-label">{link.label}</span> <ArrowUpRight className="inline size-3.5 opacity-50" />
      {desc}
    </a>
  );
}

const topLink = "relative flex h-10 items-center gap-1 rounded-full px-2.5 text-base font-medium whitespace-nowrap transition-colors hover:text-sky xl:px-1.5 2xl:px-2.5";
/** Underline that wipes in from the left. */
const underline = "after:absolute after:inset-x-2.5 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-red after:transition-transform after:duration-300 after:ease-out-expo hover:after:scale-x-100 xl:after:inset-x-1.5 2xl:after:inset-x-2.5";
// Mouse users open on hover only, so a clicked trigger can't hold its menu open over the next one. Keyboard users open on focus. Closing turns transparent at once, so two menus never overlap; visibility lags slightly so Tab can still land on a link inside.
const panel = "invisible absolute top-full left-0 z-10 pt-3 translate-y-1.5 opacity-0 [transition:visibility_0s_linear_60ms] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-hover:[transition:opacity_200ms,translate_260ms_var(--ease-out-expo)] group-has-[:focus-visible]:visible group-has-[:focus-visible]:translate-y-0 group-has-[:focus-visible]:opacity-100";
// A spiral notebook page that flips down from the nav (styles: .nav-book in globals.css).
const panelInner = "nav-book w-80";
const panelLink = "block py-2.5 pr-4 pl-15 text-base font-medium text-ink";

function Dropdown({ item, pathname, trigger }: { item: { label: string; children: NavLink[] }; pathname: string; trigger: string }) {
  return (
    <div className="group relative">
      <button type="button" aria-haspopup="true" className={trigger}>
        {item.label}
        <ChevronDown className="size-4 transition-transform group-hover:rotate-180" />
      </button>
      <div className={panel}>
        <div className={panelInner}>
          <div className="max-h-[calc(100svh-8rem)] overflow-y-auto">
            {item.children.map((c) => <MenuLink key={c.href} link={c} className={cn(panelLink, isActive(pathname, c.href) && "is-current")} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopItem({ item, pathname }: { item: NavItem; pathname: string }) {
  if ("href" in item) {
    const on = isActive(pathname, item.href);
    return <Link href={item.href} aria-current={on ? "page" : undefined} className={cn(topLink, underline, on && "after:scale-x-100")}>{item.label}</Link>;
  }
  const on = item.children.some((c) => isActive(pathname, c.href));
  return <Dropdown item={item} pathname={pathname} trigger={cn(topLink, "group-hover:text-sky group-has-[:focus-visible]:text-sky", on && "text-sky")} />;
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
      <header data-hidden={hidden || undefined} className="site-header font-nav fixed inset-x-0 top-0 z-60 bg-blue text-white shadow-[0_4px_20px_rgba(11,26,51,.1)]">
        <div className="mx-auto flex h-18 max-w-[1440px] items-center justify-between gap-4 px-5 max-sm:grid max-sm:grid-cols-[1fr_auto_1fr] lg:px-8">
          {/* Phones: logo centred, Menu on the right. */}
          <div className="flex items-center gap-6 max-sm:col-start-2">
            <Link href="/" aria-label="G-TEC Education home" className="flex-none">
              <img src="/logo-mark.png" alt="G-TEC Education" className="block h-15 w-auto" />
            </Link>
            <div className="hidden flex-none xl:block">
              <Dropdown
                item={COURSES_NAV}
                pathname={pathname}
                trigger="flex h-11 items-center gap-1.5 rounded-full border border-white/50 px-5 text-base font-medium whitespace-nowrap text-white transition-colors hover:bg-white hover:text-blue"
              />
            </div>
          </div>

          <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex">
            {NAV.map((item) => <DesktopItem key={item.label} item={item} pathname={pathname} />)}
          </nav>

          <div className="hidden flex-none items-center gap-2 justify-self-end xl:flex">
            {/* Below 2xl the row is tight: Pay now drops to its icon, Enquire now to one word. */}
            <Link href={CONTACT.pay} title="Pay now" className="flex h-11 items-center gap-2 rounded-full bg-red-dark px-3 text-base font-medium whitespace-nowrap text-white transition-colors hover:bg-[#c40000] active:scale-[.97] 2xl:px-5">
              <CreditCard aria-hidden className="size-5 2xl:hidden" />
              <span className="max-2xl:sr-only">Pay now</span>
            </Link>
            <a href="#enquire" className="flex h-11 items-center rounded-full bg-white px-6 text-base font-medium whitespace-nowrap text-blue transition-colors hover:bg-ice active:scale-[.97]">
              Enquire<span className="max-2xl:hidden">&nbsp;now</span>
            </a>
          </div>

          <button ref={menuButton} type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="flex items-center gap-2.5 p-2 text-[15px] font-semibold max-sm:col-start-3 max-sm:justify-self-end xl:hidden">
            Menu
            <span aria-hidden className="flex flex-col items-end gap-1.5">
              <span className="h-0.5 w-6 bg-white" />
              <span className="h-0.5 w-4 bg-red" />
            </span>
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
        className="mobile-menu fixed inset-0 z-70 flex flex-col overflow-y-auto overscroll-contain bg-white text-ink xl:hidden"
      >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/[.06] bg-white/90 px-5 py-2 backdrop-blur-md">
            <img src="/logo-mark-dark.png" alt="G-TEC Education" className="h-13" />
            <button ref={closeButton} type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="flex size-11 items-center justify-center rounded-full bg-mist transition-transform duration-300 active:scale-90">
              <X className="size-5" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-col px-5 pt-3 pb-6">
            {[COURSES_NAV, ...NAV].map((item, i) => {
              const row = "flex min-h-15 items-center justify-between gap-3 py-3 font-display text-[21px] font-semibold tracking-[-.01em]";
              if ("href" in item) {
                const on = isActive(pathname, item.href);
                return (
                  <Link key={item.label} href={item.href} aria-current={on ? "page" : undefined} style={{ "--i": i } as React.CSSProperties} className={cn("menu-row border-b border-ink/[.07]", row, on && "text-blue")}>
                    <span className="flex items-center gap-3">{on && <span className="h-5 w-1 rounded-full bg-red" />}{item.label}</span>
                    <ChevronRight className="size-5 text-ink/25" />
                  </Link>
                );
              }
              const on = item.children.some((c) => isActive(pathname, c.href));
              const isCourses = item === COURSES_NAV;
              return (
                <details key={item.label} style={{ "--i": i } as React.CSSProperties} className="menu-row menu-acc group border-b border-ink/[.07]" open={on}>
                  <summary className={cn(row, "cursor-pointer list-none [&::-webkit-details-marker]:hidden", on && "text-blue")}>
                    <span className="flex items-center gap-3">
                      {on && <span className="h-5 w-1 rounded-full bg-red" />}
                      {item.label}
                      {isCourses && <span className="rounded-full bg-ice px-2 py-0.5 font-sans text-xs font-bold text-blue">{item.children.length - 1}</span>}
                    </span>
                    <span className="flex size-9 items-center justify-center rounded-full bg-mist text-blue transition-[rotate,background-color] duration-300 group-open:rotate-180 group-open:bg-blue group-open:text-white">
                      <ChevronDown className="size-4" />
                    </span>
                  </summary>
                  {isCourses ? (
                    // Courses as a two-column tile grid: half the height of a list, easier to scan.
                    <div className="grid grid-cols-2 gap-2 pb-4">
                      {item.children.map((c, j) => (
                        <MenuLink
                          key={c.href}
                          link={c}
                          className={cn(
                            "rounded-2xl bg-mist p-3.5 text-[15px] leading-snug font-bold text-ink transition active:scale-[.97]",
                            j === 0 && "col-span-2 bg-blue text-white [&_span:last-child]:text-white/70",
                            isActive(pathname, c.href) && j > 0 && "bg-ice ring-2 ring-blue",
                          )}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="mb-4 ml-1 grid border-l-2 border-ice pl-3">
                      {item.children.map((c) => (
                        <MenuLink key={c.href} link={c} className={cn("rounded-xl px-3 py-2.5 text-[16px] font-semibold text-ink transition active:bg-mist", isActive(pathname, c.href) && "bg-ice text-blue")} />
                      ))}
                    </div>
                  )}
                </details>
              );
            })}
          </nav>

          <div className="sticky bottom-0 mt-auto grid grid-cols-2 gap-2.5 border-t border-ink/[.06] bg-white/95 px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_-12px_30px_rgba(11,26,51,.06)] backdrop-blur-md">
            <a href="#enquire" onClick={() => setOpen(false)} className="col-span-2 flex items-center justify-center gap-2 rounded-full bg-blue p-4 font-bold text-white active:scale-[.98]">
              Enquire now <ArrowRight className="size-4" />
            </a>
            <Link href={CONTACT.pay} className="flex items-center justify-center gap-2 rounded-full bg-red-dark p-3.5 text-sm font-bold text-white active:scale-[.98]">
              <CreditCard className="size-4" /> Pay now
            </Link>
            <a href={CONTACT.whatsapp.href} className="flex items-center justify-center gap-2 rounded-full bg-mist p-3.5 text-sm font-bold text-ink active:scale-[.98]">
              <Phone className="size-4 text-blue" /> Contact
            </a>
          </div>
      </div>
    </>
  );
}
