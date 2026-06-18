import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "공간디자인 — 인테리어 무료 상담 신청",
  description:
    "아파트·주택·상가 인테리어 시공 전문. 1:1 맞춤 무료 견적 상담을 신청하세요.",
  openGraph: {
    title: "공간디자인 — 인테리어 무료 상담 신청",
    description: "1:1 맞춤 무료 견적 상담을 신청하세요.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
