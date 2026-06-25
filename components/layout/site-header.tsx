"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { navItems, site, CTA_LABEL } from "@/lib/site";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
          {site.brandName}
        </Link>

        {/* 데스크톱 내비 */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.slice(0, -1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/#apply" className={buttonVariants({ size: "sm" })}>
            {CTA_LABEL}
          </Link>
        </nav>

        {/* 모바일 토글 */}
        <button
          className="md:hidden"
          aria-label="메뉴 열기"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-base text-foreground/80 hover:bg-foreground/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
