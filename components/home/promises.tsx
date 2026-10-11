"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";

// 7) 약속 — "믿어도 되나? 돈은 어떻게?"에 확인 가능한 방식으로 답한다.
// 실적·발주처 이름은 쓰지 않는다(대표 결정). 비용은 퍼센트 없이 방식만(대표 결정 2026-10-09).
// 2026-10-11: 글만 있던 카드 묶음 → 사진 장(章). 견적서·공정표·자재 샘플이 놓인 테이블 사진이
// 스크롤에 맞춰 양옆으로 열리고, 아래 약속 4개 위로 금색 선이 왼→오른쪽으로 그어진다(브랜드 모티프 '선').
// 사진은 분위기 컷(힉스필드)이며 서류 글자는 읽히지 않는다 — 실제 계약서처럼 보이게 쓰지 않는다.
const PROMISES = [
  {
    t: "상담은 무료, 영업 전화는 없습니다",
    d: "상담만 받고 끝내셔도 됩니다. 진행 여부는 사장님이 정합니다.",
  },
  {
    t: "범위와 금액은 서면으로 드립니다",
    d: "어디까지 하고 얼마인지 문서로 확인한 뒤에 결정하세요. 말로만 정하지 않습니다.",
  },
  {
    t: "대금은 공정에 맞춰 나눠 받습니다",
    d: "착수금·중도금·잔금처럼 공사가 진행된 만큼만 받습니다. 단계별 금액은 계약 전에 공정표와 함께 정합니다.",
  },
  {
    t: "자격과 기준이 분명한 팀입니다",
    d: "사업은 중소벤처기업부 등록 국가자격인 경영지도사가, 공간은 백화점·대형 쇼핑몰 브랜드 매장을 시공해 온 팀이 맡습니다.",
  },
];

export function Promises({ chapter }: { chapter?: string } = {}) {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, (gsap) => {
    // 사진 펼침 — 서브 페이지 머리말(ImageReveal)과 같은 결
    gsap.fromTo(
      "[data-frame]",
      { clipPath: "inset(0% 10% 0% 10% round 1.25rem)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 1.25rem)",
        ease: "none",
        scrollTrigger: { trigger: "[data-frame]", start: "top 90%", end: "top 30%", scrub: true },
      }
    );
    gsap.fromTo(
      "[data-img]",
      { scale: 1.12 },
      { scale: 1, ease: "none", scrollTrigger: { trigger: "[data-frame]", start: "top 90%", end: "bottom top", scrub: true } }
    );
    // 금색 선이 그어지고, 약속이 차례로 켜진다
    gsap.fromTo(
      "[data-rule]",
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        transformOrigin: "left center",
        scrollTrigger: { trigger: "[data-list]", start: "top 85%", end: "top 40%", scrub: true },
      }
    );
    gsap.from("[data-promise]", {
      y: 24,
      opacity: 0,
      stagger: 0.14,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: "[data-list]", start: "top 80%" },
    });
  });

  return (
    <section ref={ref} className="bg-secondary/40 py-28 md:py-36">
      <div className="container">
        <div className="max-w-2xl">
          <p className="mb-6 flex items-baseline gap-4 text-[0.8125rem] font-medium tracking-[0.04em] text-primary">
            {chapter ? (
              <span className="font-display text-2xl text-foreground/80">{chapter}</span>
            ) : (
              <span aria-hidden className="h-px w-8 self-center bg-primary" />
            )}
            상담 전에 약속드리는 것
          </p>
          <h2 className="font-display text-[1.9rem] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[2.8rem]">
            큰돈이 오가는 일이라, 방식부터 투명하게.
          </h2>
        </div>

        {/* 견적서·공정표·자재 샘플이 놓인 테이블 — "서면·공정" 약속을 사물로 보여준다 */}
        <div data-frame className="mt-14 overflow-hidden rounded-[1.25rem] bg-secondary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-img
            src="/home/promise-desk-1600.webp"
            srcSet="/home/promise-desk-960.webp 960w, /home/promise-desk-1600.webp 1600w"
            sizes="(min-width: 1280px) 1200px, 100vw"
            alt="견적서와 공정표, 자재 샘플이 놓인 작업 테이블"
            loading="lazy"
            className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] md:aspect-[21/9]"
          />
        </div>

        <div data-list className="relative mt-14 grid gap-10 border-t border-border pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div aria-hidden data-rule className="absolute inset-x-0 -top-px h-px bg-primary" />
          {PROMISES.map((p, i) => (
            <div key={p.t} data-promise>
              <span className="font-display text-2xl text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-display text-xl font-semibold leading-snug">{p.t}</h3>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-foreground/70">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
