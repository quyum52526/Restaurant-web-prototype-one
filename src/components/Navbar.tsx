"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/data/restaurant";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation and lock scroll while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "border-b border-line bg-ink/85 py-3 backdrop-blur-xl" : "py-5"
      }`}
    >
      <div className="container-lux flex items-center justify-between">
        <Logo imageClassName="h-14 md:h-20" showName={false} />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                isActive(link.href) ? "font-semibold text-gold-light" : "text-cream/70 hover:text-gold-light"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gold" aria-hidden />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/reservations" className="btn-gold hidden !py-2.5 sm:inline-flex">
            <CalendarDays size={16} />
            Book a Table
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-full border border-line transition hover:border-gold hover:bg-gold/10 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden transition-[max-height,opacity] duration-500 lg:hidden ${
          open ? "max-h-[80vh] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="container-lux flex flex-col gap-1 pb-6 pt-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`border-b border-line py-4 font-display text-2xl font-bold ${
                isActive(link.href) ? "text-gold" : "text-cream"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/reservations" className="btn-gold mt-5 sm:hidden">
            <CalendarDays size={16} />
            Book a Table
          </Link>
        </nav>
      </div>
    </header>
  );
}
