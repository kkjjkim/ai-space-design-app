"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { navItems, site, CTA_LABEL } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 홈은 어두운 시네마틱 히어로 위에 떠 있으므로, 스크롤 전엔 밝은 글자.
  const overDarkHero = pathname === "/" && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/90 backdrop-blur"
          : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "container flex h-16 items-center justify-between md:h-20",
          overDarkHero ? "text-background" : "text-foreground"
        )}
      >
        <Link href="/" className="font-serif text-lg font-semibold uppercase tracking-[0.25em]">
          {site.brandName}
        </Link>

        {/* 데스크톱 내비 */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.slice(0, -1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors",
                overDarkHero
                  ? "text-background/80 hover:text-background"
                  : "text-foreground/70 hover:text-foreground"
              )}
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
        <div className="border-t border-border bg-background text-foreground md:hidden">
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
