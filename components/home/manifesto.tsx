"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";

// 2) 선언 — 왜 "공사 전"이 중요한지 한 문장으로. 스크롤에 맞춰 글자가 흐린색에서 진하게 차오른다.
const LINE_A = "인테리어 비용은 한 번 나가지만,";
const LINE_B = "잘못 잡은 방향의 비용은 매달 나갑니다.";

function Words({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {/* 단어 사이에 실제 띄어쓰기 문자를 둔다 — 검색엔진·화면낭독기가 문장을 붙여 읽지 않게 */}
      {text.split(" ").map((w, i, arr) => (
        <span key={i}>
          <span data-word className="inline-block">
            {w}
          </span>
          {i < arr.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, (gsap) => {
    const words = ref.current!.querySelectorAll("[data-word]");
    gsap.fromTo(
      words,
      { opacity: 0.16 },
      {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 55%", scrub: true },
      }
    );
  });

  return (
    <section ref={ref} className="bg-background py-28 md:py-40">
      <div className="container max-w-5xl">
        <p className="mb-10 flex items-center gap-3 text-[0.8125rem] font-medium tracking-[0.04em] text-primary">
          <span aria-hidden className="h-px w-8 bg-primary" />
          왜 공사 전인가
        </p>
        <h2 className="font-display text-[1.9rem] font-semibold leading-[1.35] tracking-[-0.02em] sm:text-5xl md:text-[3.4rem]">
          <Words text={LINE_A} />
          <br className="hidden sm:block" />{" "}
          <Words text={LINE_B} className="text-primary" />
        </h2>
        <p className="mt-10 max-w-2xl text-[1.0625rem] leading-[1.85] text-foreground/70">
          자리·예산·컨셉·동선이 어긋난 채로 문을 열면, 그 차이는 임대료와 인건비, 빈 좌석으로 매달 돌아옵니다.
          그래서 브랜드각은 도면보다 먼저 장사의 숫자를 봅니다.
        </p>
      </div>
    </section>
  );
}
