"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingCta } from "@/components/layout/floating-cta";
import { RecentLeadsToast } from "@/components/recent-leads-toast";

// 마케팅 사이트의 껍데기(상단 내비 · 푸터 · 상담 CTA · 토스트).
// 스튜디오(/studio)는 사장님·사모님이 쓰는 별도 "제작 도구"이므로
// 이 마케팅 껍데기를 숨기고 앱 화면만 보여준다.
export function MarketingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio") ?? false;

  if (isStudio) {
    return <main>{children}</main>;
  }

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <FloatingCta />
      <RecentLeadsToast />
    </>
  );
}
