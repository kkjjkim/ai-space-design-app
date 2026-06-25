"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CTA_LABEL } from "@/lib/site";

// 스크롤을 따라다니는 고정 CTA. AvroKO식 약한 링크로 숨기지 말고 또렷하게.
export function FloatingCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 신청 완료 페이지에서는 숨김
  if (pathname?.startsWith("/complete")) return null;

  const href = pathname === "/" ? "#apply" : "/#apply";

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-300",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <div className="container flex justify-center md:justify-end">
        <Link
          href={href}
          className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90"
        >
          {CTA_LABEL} · 1분
        </Link>
      </div>
    </div>
  );
}
