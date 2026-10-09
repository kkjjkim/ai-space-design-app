import localFont from "next/font/local";
import { Noto_Serif_KR } from "next/font/google";

// Pretendard 자체 호스팅 (CDN 차단 대비 + 확실한 로딩). 본문·제목 모두 사용.
export const pretendard = localFont({
  src: [
    { path: "./fonts/Pretendard-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Pretendard-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Pretendard-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Pretendard-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Pretendard-800.woff2", weight: "800", style: "normal" },
    { path: "./fonts/Pretendard-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

// 큰 제목용 명조 (AGENTS.md 9번: 큰 제목·인용문 = 명조). 2026-10 개편 첫 화면부터 쓴다.
// 펜 도면 → 공간으로 이어지는 첫 화면의 "설계 도면" 느낌과 맞춘다.
export const notoSerif = Noto_Serif_KR({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: false,
});
