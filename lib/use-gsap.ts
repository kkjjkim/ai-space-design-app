"use client";

import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type Gsap = typeof import("gsap").gsap;
type ScrollTriggerType = typeof import("gsap/ScrollTrigger").ScrollTrigger;

// 섹션별 스크롤 움직임 공통 훅 — GSAP·ScrollTrigger 를 필요할 때 불러오고, 언마운트 시 정리한다.
// 움직임 줄이기 설정이면 setup 을 부르지 않는다(요소는 CSS 기본 상태 = 다 보이는 상태로 둔다).
export function useGsap(
  scope: RefObject<HTMLElement>,
  setup: (gsap: Gsap, ScrollTrigger: ScrollTriggerType, root: HTMLElement) => void,
  deps: unknown[] = []
) {
  useEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;
    let ctx: { revert: () => void } | null = null;
    let disposed = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => setup(gsap, ScrollTrigger, root), root);
    })();
    return () => {
      disposed = true;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
