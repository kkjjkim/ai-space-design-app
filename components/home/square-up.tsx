"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useGsap } from "@/lib/use-gsap";
import { cn } from "@/lib/utils";

// 3) 각 잡기 (대표 효과 2) — 공사 전에 정할 7가지.
// 데스크톱: 왼쪽 큰 사진이 고정되고, 오른쪽 항목을 스크롤할 때마다 사진이 바뀐다.
//   새 사진은 비뚤게(회전) 들어왔다가 반듯하게 자리 잡는다 = "각을 잡는다".
// 휴대폰: 항목마다 사진이 위에 붙고, 스크롤에 맞춰 회전이 풀린다.
const DECISIONS = [
  { k: "자리", t: "권리금과 임대료가 매출로 회수되는 자리인가", href: "/insights/location-analysis", img: "d-place" },
  { k: "예산", t: "공사비에 다 쓰고 버틸 운영비가 남지 않는가", href: "/insights/cafe-startup-cost", img: "d-budget" },
  { k: "컨셉", t: "손님이 \"여긴 왜 와야 하지?\"에 답할 수 있는가", href: "/insights/brand-concept-first", img: "d-concept" },
  { k: "상품 구성", t: "객단가와 회전율이 이 평수와 맞는가", href: "/insights/business-plan-before-construction", img: "d-product" },
  { k: "동선", t: "주방·카운터 동선이 인건비를 늘리지 않는가", href: "/insights/store-flow-design", img: "d-flow" },
  { k: "인허가·설비", t: "전기·가스·배기·소방을 계약 전에 확인했는가", href: "/insights/restaurant-permit", img: "d-permit" },
  { k: "오픈 후", t: "매출 숫자를 보고 고칠 수 있게 설계했는가", href: "/insights/data-driven-operation", img: "d-open" },
];
// 사진이 들어올 때의 기울기 — 항목마다 다르게
const TILT = [-7, 6, -5, 8, -6, 5, -8];

const src = (name: string, w: 960 | 1600 = 960) => `/home/${name}-${w}.webp`;

export function SquareUp() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGsap(ref, (gsap, ScrollTrigger) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-item]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    });
    mm.add("(max-width: 1023px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-mimg]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { rotate: TILT[i % TILT.length], scale: 0.92 },
          {
            rotate: 0,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 95%", end: "top 55%", scrub: 0.5 },
          }
        );
      });
    });
  });

  return (
    <section ref={ref} className="bg-background py-28 md:py-36">
      <div className="container">
        <div className="max-w-3xl">
          <p className="flex items-baseline gap-4 text-[0.8125rem] font-medium tracking-[0.04em] text-primary">
            <span className="font-display text-2xl text-foreground/80">02</span>
            각을 잡는다는 것
          </p>
          <h2 className="mt-8 font-display text-[1.9rem] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[2.8rem]">
            공사 전에 각을 잡아야 할 7가지
          </h2>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-[1.85] text-foreground/70">
            여기서 어긋나면 인테리어를 아무리 잘해도 되돌리기 어렵습니다. 상담은 이 일곱 가지를 하나씩 맞추는 데서
            시작합니다.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* 고정 사진 (데스크톱) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              <div className="relative h-full overflow-hidden rounded-[1.5rem] bg-secondary">
                {DECISIONS.map((d, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={d.img}
                    src={src(d.img, 1600)}
                    alt=""
                    loading="lazy"
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)]",
                      i === active ? "rotate-0 scale-100 opacity-100" : "scale-[1.08] opacity-0"
                    )}
                    style={i === active ? undefined : { transform: `rotate(${TILT[i]}deg) scale(1.08)` }}
                  />
                ))}
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-7 right-7 flex items-end justify-between text-background">
                  <span className="font-display text-3xl font-semibold">{DECISIONS[active].k}</span>
                  <span className="text-sm tabular-nums text-background/80">
                    {String(active + 1).padStart(2, "0")} / {String(DECISIONS.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 항목 */}
          <ol className="space-y-14 lg:space-y-0">
            {DECISIONS.map((d, i) => (
              <li key={d.k} data-item className="lg:flex lg:min-h-[62vh] lg:items-center">
                {/* 휴대폰: 항목마다 사진 */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-mimg
                  src={src(d.img)}
                  alt=""
                  loading="lazy"
                  className="mb-6 aspect-[4/5] w-full rounded-2xl object-cover lg:hidden"
                />
                <Link
                  href={d.href}
                  className={cn(
                    "group block border-l-2 pl-6 transition-colors md:pl-8",
                    i === active ? "lg:border-primary" : "lg:border-border",
                    "border-primary"
                  )}
                >
                  <span className="text-sm tabular-nums text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <h3
                    className={cn(
                      "mt-3 font-display text-3xl font-semibold transition-colors sm:text-4xl",
                      i === active ? "lg:text-foreground" : "lg:text-foreground/35"
                    )}
                  >
                    {d.k}
                  </h3>
                  <p
                    className={cn(
                      "mt-4 max-w-md text-[1.0625rem] leading-relaxed transition-colors",
                      i === active ? "lg:text-foreground/80" : "lg:text-foreground/35",
                      "text-foreground/75"
                    )}
                  >
                    {d.t}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm text-primary">
                    관련 글 읽기 <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
