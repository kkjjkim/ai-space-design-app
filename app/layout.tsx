import type { Metadata } from "next";
import "./globals.css";
import { pretendard } from "./fonts";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingCta } from "@/components/layout/floating-cta";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"), // 배포 도메인으로 교체
  title: {
    default: `${site.tagline} | ${site.brandName}`,
    template: `%s | ${site.brandName}`,
  },
  description: site.description,
  openGraph: {
    title: site.tagline,
    description: site.description,
    type: "website",
    locale: "ko_KR",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="min-h-screen">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <FloatingCta />
      </body>
    </html>
  );
}
