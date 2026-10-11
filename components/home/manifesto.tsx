"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";

// 2) 선언 — 화면 가득한 "공사 전 빈 상가" 사진 위에 왜 공사 전인지 한 문장으로.
// 벤치마크: Loam House(Awwwards) — 장 번호 + 큰 명조 두 줄 + 짧은 설명 + 아래 큰 숫자 3개.
// 숫자는 지어내지 않고 사이트 안의 사실만(정할 것 7가지, 전문가 2명, 상담 0원).
const LINE_A = "인테리어 비용은 한 번 나가지만,";
const LINE_B = "잘못 잡은 방향의 비용은 매달 나갑니다.";

const FACTS = [
  { v: "7", l: "공사 전에 정할 것" },
  { v: "2", l: "한 테이블의 전문가" },
  { v: "0원", l: "상담·컨셉 진단" },
];

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
    gsap.fromTo(
      "[data-bg]",
      { scale: 1.18 },
      { scale: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } }
    );
    gsap.fromTo(
      "[data-word]",
      { opacity: 0.22 },
      {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 60%", end: "center 40%", scrub: true },
      }
    );
    gsap.from("[data-fact]", {
      y: 30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: { trigger: "[data-facts]", start: "top 90%" },
    });
  });

  return (
    <section ref={ref} className="relative isolate flex min-h-[110svh] items-end overflow-hidden bg-foreground text-background">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-bg
        src="/home/raw-space-1920.webp"
        srcSet="/home/raw-space-1280.webp 1280w, /home/raw-space-1920.webp 1920w"
        sizes="100vw"
        alt="공사 전 비어 있는 상가"
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#120e0b]/95 via-[#120e0b]/35 to-transparent" />

      <div className="container pb-16 pt-40 md:pb-24">
        <p className="flex items-baseline gap-4 text-[0.8125rem] font-medium tracking-[0.04em] text-primary">
          <span className="font-display text-2xl text-background/90">01</span>
          왜 공사 전인가
        </p>
        <h2 className="mt-8 max-w-5xl font-display text-[2rem] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-5xl md:text-[3.6rem]">
          <Words text={LINE_A} />
          <br className="hidden sm:block" />{" "}
          <Words text={LINE_B} className="text-primary" />
        </h2>
        <p className="mt-8 max-w-xl text-[1.0625rem] leading-[1.85] text-background/75">
          자리·예산·컨셉·동선이 어긋난 채로 문을 열면, 그 차이는 임대료와 인건비, 빈 좌석으로 매달 돌아옵니다. 그래서
          브랜드각은 도면보다 먼저 장사의 숫자를 봅니다.
        </p>

        <dl data-facts className="mt-16 grid max-w-3xl grid-cols-3 gap-6 border-t border-background/20 pt-8">
          {FACTS.map((f) => (
            <div key={f.l} data-fact>
              <dt className="sr-only">{f.l}</dt>
              <dd className="font-display text-4xl font-semibold sm:text-6xl">{f.v}</dd>
              <dd className="mt-2 text-[0.8125rem] text-background/65 sm:text-sm">{f.l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
