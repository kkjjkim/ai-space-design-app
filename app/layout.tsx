import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingCta } from "@/components/layout/floating-cta";
import { site } from "@/lib/site";

// 큰 제목·인용문용 명조. 본문 Pretendard 는 globals.css 에서 CDN 로드.
const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

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
    // images: ["/og.jpg"], // 대표 이미지는 운영자가 추가
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSerifKr.variable}>
      <body className="min-h-screen">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <FloatingCta />
      </body>
    </html>
  );
}
