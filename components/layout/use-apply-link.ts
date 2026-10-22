"use client";

import { usePathname } from "next/navigation";

// "무료 상담 문의" 버튼(헤더·고정)이 어디로 갈지 정한다.
// 지금 페이지 안에 신청 폼(#apply)이 있으면 그리로 내려가고, 없을 때만 홈 폼으로 간다.
// 진단 결과 화면에서 홈(/#apply)으로 보내면 페이지가 바뀌며 결과·미리 채운 내용이 사라졌다
// (10/21 GA4: 진단 완료 5 → 제출 0). 결과 화면은 스크롤 중간에 생기므로 누를 때 판단한다.
export function useApplyLink() {
  const pathname = usePathname();
  const href = pathname === "/" ? "#apply" : "/#apply";

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname === "/") return; // 홈은 Lenis anchors 가 "#apply" 를 처리한다
    const target = document.getElementById("apply");
    if (!target) return;
    e.preventDefault();
    if (window.__lenis) {
      // 진단 결과는 방금 생긴 내용이라 Lenis 가 아는 페이지 높이가 옛값일 수 있다 — 재면 끝까지 내려간다.
      window.__lenis.resize();
      window.__lenis.scrollTo(target, { offset: -80 });
    } else target.scrollIntoView({ behavior: "smooth", block: "start" }); // 움직임 줄이기 = Lenis 없음
  }

  return { href, onClick };
}
