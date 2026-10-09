"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";

// 5) 진행 순서와 받는 결과물 — "상담하면 뭘 받는데?"에 단계별로 답한다.
// 데스크톱: 화면을 고정하고 가로로 흐른다. 휴대폰: 세로로 쌓인다.
// 첫 화면과 같은 사진(도면 → 낮 → 저녁)을 단계 배경으로 다시 써서 이야기를 잇는다.
const STEPS = [
  {
    n: "01",
    t: "무료 상담",
    d: "업종·자리·예산·일정을 듣고, 지금 단계에서 먼저 할 일과 아껴야 할 지출을 정리합니다.",
    get: "지금 할 일 정리",
    img: null,
  },
  {
    n: "02",
    t: "사업·브랜드 설계",
    d: "자리와 예산이 맞는지 숫자로 보고, 손님이 찾아올 이유를 한 문장의 컨셉으로 잡습니다.",
    get: "사업·예산 계획 · 컨셉 보드",
    img: "/hero/stage-sketch-1280.webp",
  },
  {
    n: "03",
    t: "공간 설계",
    d: "컨셉을 평면·동선·재료로 옮기고, 범위와 금액을 서면 견적으로 드립니다.",
    get: "도면·시안 · 서면 견적",
    img: "/hero/stage-day-1280.webp",
  },
  {
    n: "04",
    t: "시공",
    d: "브랜드 매장 기준으로 공정표대로 짓습니다. 대금은 공정 단계에 맞춰 나눠 받습니다.",
    get: "공정표 · 단계별 점검",
    img: null,
  },
  {
    n: "05",
    t: "오픈 후",
    d: "문을 연 뒤의 매출 숫자를 함께 보고, 고칠 곳을 찾아 손봅니다.",
    get: "운영 점검",
    img: "/hero/stage-night-1280.webp",
  },
];

export function ProcessFlow() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGsap(ref, (gsap) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const track = trackRef.current!;
      const distance = () => track.scrollWidth - window.innerWidth + 80;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    });
  });

  return (
    <section ref={ref} className="overflow-hidden bg-background py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0">
      <div className="container">
        <p className="mb-6 flex items-center gap-3 text-[0.8125rem] font-medium tracking-[0.04em] text-primary">
          <span aria-hidden className="h-px w-8 bg-primary" />
          진행 순서
        </p>
        <h2 className="max-w-3xl font-display text-[1.9rem] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[2.8rem]">
          단계마다, 손에 쥐는 결과물이 있습니다.
        </h2>
      </div>

      <div
        ref={trackRef}
        className="container mt-12 grid gap-5 lg:mt-14 lg:flex lg:w-max lg:max-w-none lg:gap-6 lg:pr-24"
      >
        {STEPS.map((s) => (
          <article
            key={s.n}
            className="relative isolate flex min-h-[19rem] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-7 lg:h-[26rem] lg:w-[24rem] lg:shrink-0"
          >
            {s.img && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt="" loading="lazy" className="absolute inset-0 -z-20 h-full w-full object-cover" />
                <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-card via-card/90 to-card/60" />
              </>
            )}
            <div className="flex items-baseline justify-between">
              <span className="font-display text-5xl font-semibold text-primary/80">{s.n}</span>
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold">{s.t}</h3>
              <p className="mt-3 text-[0.975rem] leading-relaxed text-foreground/75">{s.d}</p>
              <div className="mt-6 border-t border-border pt-4">
                <span className="text-xs font-medium tracking-[0.04em] text-foreground/45">받는 것</span>
                <p className="mt-1 font-medium">{s.get}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
