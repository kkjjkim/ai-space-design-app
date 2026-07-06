import type { Metadata } from "next";
import "./globals.css";
import { pretendard } from "./fonts";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingCta } from "@/components/layout/floating-cta";
import { JsonLd } from "@/components/json-ld";
import { localBusinessLd, websiteLd, serviceLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.tagline} | ${site.brandName}`,
    template: `%s | ${site.brandName}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.tagline} | ${site.brandName}`,
    description: site.description,
    url: site.url,
    siteName: site.brandName,
    type: "website",
    locale: "ko_KR",
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.tagline }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.tagline} | ${site.brandName}`,
    description: site.description,
    images: [site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // 검색엔진 소유확인 (코드가 있을 때만 태그가 나간다)
  verification: {
    ...(site.verification.google.length
      ? { google: [...site.verification.google] }
      : {}),
    ...(site.verification.naver.length
      ? { other: { "naver-site-verification": [...site.verification.naver] } }
      : {}),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="min-h-screen">
        <JsonLd data={localBusinessLd()} />
        <JsonLd data={websiteLd()} />
        <JsonLd data={serviceLd()} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <FloatingCta />
      </body>
    </html>
  );
}
