import { Noto_Serif_KR } from "next/font/google";

// Pretendard 는 app/pretendard-subset.css (공식 "다이내믹 서브셋", 자체 호스팅 public/fonts/pretendard)로 옮겼다.
// 예전엔 굵기 6개를 한글 전체(각 770KB)로 미리 받아 휴대폰 첫 화면이 4.6MB·30초+ 걸렸다(2026-10-11 Lighthouse).
// 지금은 페이지에 실제로 쓰인 글자 조각만 받는다. 가변 글꼴이라 굵기 45~920 전부 한 벌로 된다.

// 큰 제목용 명조 (AGENTS.md 9번: 큰 제목·인용문 = 명조). 2026-10 개편 첫 화면부터 쓴다.
// 펜 도면 → 공간으로 이어지는 첫 화면의 "설계 도면" 느낌과 맞춘다.
export const notoSerif = Noto_Serif_KR({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: false,
});
