"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";

// 4) 한 테이블, 두 전문가 — 브랜드각의 핵심 차별점.
// 사업(경영지도사)과 공간(백화점·대형 쇼핑몰 브랜드 매장 시공팀)이 한 테이블에서 같이 결정한다.
// 시공팀 이력은 발주처 이름 없이 쓴다(대표 결정: 클라이언트가 알아보는 실적은 노출하지 않음).
const EXPERTS = [
  {
    mark: "선",
    role: "사업·브랜드",
    who: "국가공인 경영지도사",
    lead: "되는 장사인지부터 숫자로 봅니다.",
    items: ["상권·자리 타당성", "예산·자금 계획 (정책자금 포함)", "브랜드 컨셉·이름·상품 구성", "오픈 후 운영 컨설팅 (별도 계약)"],
  },
  {
    mark: "면",
    role: "공간·시공",
    who: "백화점·대형 쇼핑몰 브랜드 매장 시공팀",
    lead: "까다로운 브랜드 기준으로 짓습니다.",
    items: ["평면·동선·도면 설계", "자재·마감 기준", "공정·안전·일정 관리", "설비·인허가 협의"],
  },
];

// 따로 맡기면 생기는 일 vs 한 테이블에서
const CONTRAST = [
  { apart: "컨설팅 따로, 시공 따로 — 기획 의도가 현장에서 바뀝니다", together: "기획한 사람이 현장까지 같이 봅니다" },
  { apart: "평당 가격으로 견적부터 받습니다", together: "사업 계획에 맞춘 예산부터 정합니다" },
  { apart: "문제가 생기면 서로 책임을 미룹니다", together: "창구가 하나라 결정과 책임이 한곳에 있습니다" },
];

export function TwoExperts() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, (gsap) => {
    // 두 카드가 양쪽에서 가운데로 모이고, 가운데 선이 그어진다
    gsap.from("[data-expert='0']", {
      x: -60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 70%" },
    });
    gsap.from("[data-expert='1']", {
      x: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 70%" },
    });
    gsap.from("[data-join]", {
      scaleX: 0,
      duration: 1.2,
      ease: "power2.inOut",
      delay: 0.3,
      scrollTrigger: { trigger: ref.current, start: "top 70%" },
    });
    gsap.from("[data-row]", {
      y: 24,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: "[data-rows]", start: "top 80%" },
    });
  });

  return (
    <section ref={ref} className="overflow-hidden bg-foreground py-28 text-background md:py-36">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 inline-flex items-center gap-3 text-[0.8125rem] font-medium tracking-[0.04em] text-primary">
            <span aria-hidden className="h-px w-8 bg-primary" />
            브랜드각이 일하는 방식
            <span aria-hidden className="h-px w-8 bg-primary" />
          </p>
          <h2 className="font-display text-[1.9rem] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[2.8rem]">
            한 테이블에, 두 전문가가 앉습니다.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-[1.85] text-background/70">
            사업을 아는 사람과 공간을 짓는 사람이 처음부터 같이 결정합니다. 그래서 도면이 숫자를 배신하지 않습니다.
          </p>
        </div>

        <div className="relative mx-auto mt-16 grid max-w-5xl gap-5 md:grid-cols-2 md:gap-10">
          {/* 가운데를 잇는 금색 선 (데스크톱) */}
          <div
            aria-hidden
            data-join
            className="absolute left-1/2 top-1/2 hidden h-px w-24 -translate-x-1/2 bg-primary md:block"
          />
          {EXPERTS.map((e, i) => (
            <article
              key={e.role}
              data-expert={i}
              className="rounded-2xl border border-background/10 bg-background/[0.04] p-8 md:p-10"
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.8125rem] font-medium tracking-[0.04em] text-primary">{e.role}</span>
                <span className="font-display text-3xl font-semibold text-background/25">{e.mark}</span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold leading-snug">{e.who}</h3>
              <p className="mt-3 text-background/70">{e.lead}</p>
              <ul className="mt-8 space-y-3 border-t border-background/10 pt-6">
                {e.items.map((it) => (
                  <li key={it} className="flex items-center gap-3 text-[0.975rem] text-background/85">
                    <span aria-hidden className="h-1 w-1 rounded-full bg-primary" />
                    {it}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div data-rows className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-2 gap-6 border-b border-background/10 pb-4 text-[0.8125rem] font-medium tracking-[0.04em]">
            <span className="text-background/45">따로 맡기면</span>
            <span className="text-primary">한 테이블에서</span>
          </div>
          {CONTRAST.map((c) => (
            <div
              key={c.apart}
              data-row
              className="grid grid-cols-2 gap-6 border-b border-background/10 py-5 text-[0.975rem] leading-relaxed"
            >
              <span className="text-background/45 line-through decoration-background/20">{c.apart}</span>
              <span className="text-background/90">{c.together}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
