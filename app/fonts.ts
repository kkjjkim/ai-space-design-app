import localFont from "next/font/local";

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
