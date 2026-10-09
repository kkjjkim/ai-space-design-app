"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGsap } from "@/lib/use-gsap";

// 3) 각 잡기 (대표 효과 2) — 비뚤게 흩어진 "공사 전에 정할 것" 카드 7장이 스크롤에 맞춰 회전이 풀리며 정렬된다.
// 브랜드 이름(각)과 해법(정렬)을 한 동작으로 보여주는 장면. 각 카드는 해당 인사이트 글로 이어진다.
const DECISIONS = [
  { k: "자리", t: "권리금과 임대료가 매출로 회수되는 자리인가", href: "/insights/location-analysis" },
  { k: "예산", t: "공사비에 다 쓰고 버틸 운영비가 남지 않는가", href: "/insights/cafe-startup-cost" },
  { k: "컨셉", t: "손님이 \"여긴 왜 와야 하지?\"에 답할 수 있는가", href: "/insights/brand-concept-first" },
  { k: "상품 구성", t: "객단가와 회전율이 이 평수와 맞는가", href: "/insights/business-plan-before-construction" },
  { k: "동선", t: "주방·카운터 동선이 인건비를 늘리지 않는가", href: "/insights/store-flow-design" },
  { k: "인허가·설비", t: "전기·가스·배기·소방을 계약 전에 확인했는가", href: "/insights/restaurant-permit" },
  { k: "오픈 후", t: "매출 숫자를 보고 고칠 수 있게 설계했는가", href: "/insights/data-driven-operation" },
];

// 흩어진 상태(데스크톱) — 각 카드의 회전·이동 값. 정렬되면 0이 된다.
const SCATTER = [
  { r: -14, x: -60, y: 40 },
  { r: 9, x: 30, y: -50 },
  { r: -6, x: 80, y: 70 },
  { r: 16, x: -40, y: -30 },
  { r: -11, x: 50, y: 60 },
  { r: 7, x: -70, y: -60 },
  { r: -18, x: 20, y: 50 },
];

export function SquareUp() {
  const ref = useRef<HTMLElement>(null);

  useGsap(ref, (gsap) => {
    const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      cards.forEach((card, i) => {
        const s = SCATTER[i % SCATTER.length];
        gsap.set(card, { rotate: s.r, x: s.x, y: s.y });
      });
      gsap.to(cards, {
        rotate: 0,
        x: 0,
        y: 0,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: { trigger: "[data-grid]", start: "top 85%", end: "top 25%", scrub: 0.6 },
      });
    });
    mm.add("(max-width: 1023px)", () => {
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { rotate: i % 2 ? 5 : -5, y: 30, opacity: 0.4 },
          {
            rotate: 0,
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 92%", end: "top 65%", scrub: 0.5 },
          }
        );
      });
    });
  });

  return (
    <section ref={ref} className="overflow-hidden bg-secondary/40 py-28 md:py-36">
      <div className="container">
        <div className="max-w-3xl">
          <p className="mb-6 flex items-center gap-3 text-[0.8125rem] font-medium tracking-[0.04em] text-primary">
            <span aria-hidden className="h-px w-8 bg-primary" />
            각을 잡는다는 것
          </p>
          <h2 className="font-display text-[1.9rem] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[2.8rem]">
            공사 전에 각을 잡아야 할 7가지
          </h2>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.85] text-foreground/70">
            여기서 어긋나면 인테리어를 아무리 잘해도 되돌리기 어렵습니다. 상담은 이 일곱 가지를 하나씩 맞추는 데서
            시작합니다.
          </p>
        </div>

        <ol data-grid className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DECISIONS.map((d, i) => (
            <li key={d.k} data-card className={i === 6 ? "lg:col-span-2" : ""}>
              <Link
                href={d.href}
                className="group flex h-full min-h-[11rem] flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-[0_1px_0_hsl(var(--border))] transition-colors hover:border-primary/50"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl font-semibold">{d.k}</span>
                  <span className="text-xs tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-6 text-[0.975rem] leading-relaxed text-foreground/75">{d.t}</p>
                <span className="mt-4 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  자세히 보기 →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
