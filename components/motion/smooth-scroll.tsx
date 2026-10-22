"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// Lenis 부드러운 스크롤 + GSAP ScrollTrigger 동기화.
// 스크롤에 묶인 장면(첫 화면 3D, 각 잡기 카드)이 끊기지 않게 하려면 둘이 같은 시계로 돌아야 한다.
// 움직임 줄이기 설정이면 켜지 않는다(브라우저 기본 스크롤 그대로).
declare global {
  interface Window {
    __lenis?: {
      resize: () => void;
      scrollTo: (target: HTMLElement, options?: { offset?: number }) => void;
    };
  }
}

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let destroyed = false;
    let cleanup = () => {};

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (destroyed) return;
      gsap.registerPlugin(ScrollTrigger);

      // anchors: "#apply" 같은 페이지 안 링크도 부드럽게 이동(헤더 높이만큼 띄움).
      const lenis = new Lenis({ autoRaf: false, anchors: { offset: -80 } });
      // 다른 컴포넌트(고정 상담 버튼)가 페이지 안 이동을 부탁할 수 있게 전역에 둔다.
      // 브라우저 scrollIntoView 는 Lenis 가 매 프레임 자기 위치로 되돌려 먹히지 않는다.
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        delete window.__lenis;
      };
    })();

    return () => {
      destroyed = true;
      cleanup();
    };
  }, []);

  return null;
}
