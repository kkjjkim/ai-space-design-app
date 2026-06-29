"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// 스크롤 시 부드럽게 떠오르는 모션.
// 안전장치: 이미 화면 안이면 즉시 표시 + 관찰자 + 2초 안전망으로 "절대 숨겨진 채 남지 않게".
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 모션 비선호 / 미지원 환경: 즉시 표시
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    // 마운트 시 이미 화면 안(또는 위)이면 즉시 표시
    const rect = el.getBoundingClientRect();
    if (rect.top < (window.innerHeight || 0) + 100) {
      setShown(true);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);

    // 안전망: 관찰자가 못 잡아도 일정 시간 뒤 무조건 노출
    const t = setTimeout(() => setShown(true), 2000);

    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-[800ms] ease-out will-change-[opacity,transform]",
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
